import CameraRoll, { AssetType, GroupType } from "@react-native-community/cameraroll";
import React, { Component } from 'react';
import { Image, PermissionsAndroid, Platform, StyleSheet, View, YellowBox } from 'react-native';
import RNFS, { ReadDirItem } from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import DefaultArticles from "./src/data/default-articles";
import MainApp from "./src/main-app";
import { wp } from "./src/shared/article";
import { Constants } from './src/shared/constants';
import { WStorage } from './src/shared/w-storage';
import { WStorageCache } from './src/shared/w-storage-cache';

interface IState { init: boolean };

export default class App extends Component<IState, any> {

  constructor(props: IState) {
    super(props);
    this.state = { init: false };
    YellowBox.ignoreWarnings(['Remote debugger']);
    this.initalAppData = this.initalAppData.bind(this);
  }

	/**
	 * Sets the current location after the map is finished rendering
	 */
  componentDidMount() {
    if (Platform.OS === 'android') {
      this.requestLocationPermissions().then(() => {
        this.initalAppData().then(() => WStorageCache.loadCaches()).finally(() => {
          this.setState({ init: true });
        });
      }).catch(error => {
        console.log("Failed to request android permissions : " + error);
        this.setState({ init: true });
      });
    } else {
      this.initalAppData().then(() => WStorageCache.loadCaches()).finally(() => {
        this.setState({ init: true });
      });
    }
  }

  componentWillUnmount() {
    WStorageCache.writeCaches();
  }

  async initalAppData() {
    console.log("App check initial install");
    const identifier = await CameraRoll.getPhotos({
      first: 1000,
      assetType: 'Photos' as AssetType,
      groupTypes: 'Album' as GroupType,
      groupName: Constants.wStorageUnitName
    });

    if (identifier.edges.length === 0 && identifier.page_info.has_next_page === false) {
      const init = await WStorage.appDataInstalled();
      if (!init) {
        try {
          if (Platform.OS === 'android') {
            console.log("Initial images from android");
            const path = `${RNFS.PicturesDirectoryPath}/${Constants.wStorageUnitName}`;
            await RNFS.mkdir(RNFS.PicturesDirectoryPath);
            await RNFS.mkdir(path);
            for (const dir of ['top', 'bottom', 'shoe']) {
              const resources: ReadDirItem[] = await RNFS.readDirAssets(dir);
              if (resources) {
                for (const resource of resources) {
                  console.log(`Saving : ${resource.path}`);
                  await RNFS.copyFileAssets(resource.path, `${RNFS.PicturesDirectoryPath}/${Constants.wStorageUnitName}/${resource.name}`)
                  await RNFS.scanFile(`${RNFS.PicturesDirectoryPath}/${Constants.wStorageUnitName}/${resource.name}`);
                }
              }
            }
          } else {
            console.log("Initial images from resources");
            for (const demoUri of DefaultArticles.getDemosUris()) {
              console.log(`Saving : ${demoUri}`);
              await CameraRoll.save(demoUri, { type: 'photo', album: Constants.wStorageUnitName })
            }
          }
        } catch (error) {
          console.log(`App.initalAppData failed to copy inital demo picts to ( ${Constants.wStorageUnitName} ) Error  : ${error} `);
        }
      }
    }
  }

  /**
   * Handles location permission API access for Android.
   */
  async requestLocationPermissions() {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (!permission) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        'title': 'Save Your Selections',
        'message': 'Wardrobe needs to save your selections locally.',
        'buttonPositive': 'Allow'
      });
      if (!result) {
        console.error("WRITE_EXTERNAL_STORAGE not granted");
      }
    }

    permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (!permission) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        'title': 'Take wardrobe photos',
        'message': 'Wardrobe needs to load your selections locally.',
        'buttonPositive': 'Allow'
      });
      if (!result) {
        console.error("PERMISSIONS.READ_EXTERNAL_STORAGE not granted");
      }
    }

    permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (!permission) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA, {
        'title': 'Take wardrobe photos',
        'message': 'Add phots to the Wardorbe.',
        'buttonPositive': 'Allow'
      });
      if (!result) {
        console.error("PERMISSIONS.CAMERA not granted");
      }
    }
  }

  render() {
    if (this.state.init) {
      return (<MainApp />);
    } else {
      return (
        <View style={styles.content}>
          <Spinner
            visible={!this.state.init}
            textContent={'Loading...'}
            textStyle={styles.bText}
          />
          <Image source={Constants.open ? require('./assets/open-resources/wardrobe-app.png') : require('./assets/resources/wardrobe-app.png')} style={styles.image} />
        </View>);
    }
  }
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  image: {
    resizeMode: 'contain',
    width: wp(90),
    height: undefined,
    aspectRatio: 1

  },
  bText: Platform.select({
		ios: {
      color: '#FFF',
      fontFamily: 'Arial',
      fontSize: 4
		},
		android: {
      color: '#FFF',
      fontFamily: 'Arial',
      fontSize: 12
		}
	})
});
