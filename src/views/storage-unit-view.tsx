import CameraRoll, { AssetType, GroupType } from "@react-native-community/cameraroll";
import React, { Component } from "react";
import { AppState, AppStateStatus, Image, ImageBackground, Platform, StyleSheet, TouchableHighlight, View } from "react-native";
import { NavigationContainerProps, NavigationEventSubscription, ScrollView } from "react-navigation";
import DefaultArticles from "../data/default-articles";
import { smallImageStyle } from "../main-app";
import { Article, ArticleType, hp, IArticle, IArtImage, wp } from "../shared/article";
import { Constants } from "../shared/constants";
import { SimpleCallback } from "../shared/simple-callback";
import { WStorageCache } from "../shared/w-storage-cache";
import ArticleSelect from "./article-select";

interface IState {
  articles: Array<IArtImage>;
  appState: AppStateStatus;
  cameraDataLoaded: boolean;
}

export default class StorageUnitView extends Component<NavigationContainerProps, IState> {
  static navigationOptions = {
    swipeEnabled: false,
    tabBarIcon: ({ tintColor, focused }) => (
      <Image source={ Constants.open ?  require('../../assets/open-resources/storage-unit.png') :require('../../assets/resources/storage-unit.png')} style={smallImageStyle.image} />
    )
  };
  // invoked when this tab gained focus
  focusListener: NavigationEventSubscription;
  articleSelectRef: React.RefObject<ArticleSelect>;

  constructor(props: NavigationContainerProps) {
    super(props);
    this.state = { articles: [], appState: AppState.currentState, cameraDataLoaded: false };
    this.articleSelectRef = React.createRef<ArticleSelect>();
    this.getDataFromCache = this.getDataFromCache.bind(this);
    this.getDataFromCamera = this.getDataFromCamera.bind(this);
    this.onImageSelected = this.onImageSelected.bind(this);
    this.cameraTookPictureCb = this.cameraTookPictureCb.bind(this);
  }

  getDataFromCamera() {
    console.log("storage unit getDataFromCamera()");
    CameraRoll.getPhotos({
      first: 1000,
      assetType: 'Photos' as AssetType,
      groupTypes: 'Album' as GroupType,
      groupName: Constants.wStorageUnitName
    }).then(identifier => {
      const relavantArts: Array<IArtImage> = [];
      const irrlavantArts: Array<IArtImage> = [];
      //  Conversions
      identifier.edges.forEach(edge => {
        const article = WStorageCache.getByUri(edge.node.image.uri);
        if (article) {
          relavantArts.push({ image: article.image, type: article.type, relavance: article.relavance });
        } else {
          irrlavantArts.push({ image: { uri: edge.node.image.uri }, relavance: "99|99999999" });
        }
      });

      // Sort
      relavantArts.sort((left, right) => {
        let comparison = 0;
        if (left.relavance > right.relavance) {
          comparison = 1;
        } else if (left.relavance < right.relavance) {
          comparison = -1;
        }
        return comparison;
      })

      // Concat them
      this.setState({ articles: relavantArts.concat(irrlavantArts), cameraDataLoaded: true });
    }).catch(error => console.log(`StorageUnitView.getPhotos() error : ${error}`));
  }

  getDataFromCache() {
    if (this.state.cameraDataLoaded) {
      console.log("storage unit getDataFromCache()");
      this.state.articles.forEach(artImage => {
        const article = WStorageCache.getByUri(artImage.image.uri);
        if (article) {
          artImage.relavance = article.relavance;
          artImage.type = article.type;
        } else {
          artImage.relavance = "99|99999999";
          artImage.type = undefined;
        }
      });
      this.state.articles.sort((left, right) => {
        let comparison = 0;
        if (left.relavance > right.relavance) {
          comparison = 1;
        } else if (left.relavance < right.relavance) {
          comparison = -1;
        }
        return comparison;
      });
      this.forceUpdate();
    }
  }

  componentDidMount() {
    SimpleCallback.listenForAddImage2(this.cameraTookPictureCb);
    this.getDataFromCamera();
    AppState.addEventListener('change', this._handleAppStateChange);

    this.focusListener = this.props.navigation.addListener('didFocus',
      payload => {
        this.getDataFromCache();
        WStorageCache.writeCaches();
      });
    this.articleSelectRef.current.onArticleTypeSelect(ArticleType.wBottom);
  }

  cameraTookPictureCb(article: IArticle) {
    // the camera took a picture
    this.state.articles.push({ image: article.image, type: article.type, relavance: article.relavance });
    this.forceUpdate();
  }

  _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log("stroageUnit._handleAppStateChange");
      this.getDataFromCamera();
      WStorageCache.writeCaches();
    }
    this.setState({ appState: nextAppState });
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.focusListener.remove();
    this.setState({ cameraDataLoaded: false });
  }

  onImageSelected(edge: IArtImage) {
    const targetAt = this.articleSelectRef.current.onGetArticleType();
    if (targetAt === undefined) {
      if (edge.type !== undefined) {
        WStorageCache.removeArticle(edge.image.uri, edge.type);
      }
    } else {
      if (edge.type === undefined) {
        const article = new Article(edge.image.uri, targetAt);
        WStorageCache.addUpdateArticle(article);
        edge.relavance = article.relavance;
      } else {
        // Update WStorage
        WStorageCache.copyArticleData(edge.image.uri, edge.type, targetAt)
          .catch(error => console.log(`StorageUnitView.onImageSelected() error : ${error}`));
      }
    }
    edge.type = targetAt;
    this.forceUpdate();
  }

  render() {
    return (
      <View style={styles.containerView}>
        <View style={styles.topButtonGroup}>
          <ArticleSelect ref={this.articleSelectRef} removeItem={true} />
        </View>
        <ScrollView style={styles.scroll} scrollEnabled={true} bounces={true} contentContainerStyle={styles.scrollView}>
          {
            this.state.articles.map((edge: IArtImage) => {
              const image = edge.image;
              const articleType = edge.type;
              if (articleType) {
                let defaultArticle = DefaultArticles.getDefault(ArticleType.wTop);
                if (articleType === ArticleType.wBottom) {
                  defaultArticle = DefaultArticles.getDefault(ArticleType.wBottom);
                } else if (articleType === ArticleType.wShoe) {
                  defaultArticle = DefaultArticles.getDefault(ArticleType.wShoe);
                }
                return (
                  <View key={image.uri} style={styles.item}>
                    <TouchableHighlight style={styles.imageCell} onPress={() => this.onImageSelected(edge)}>
                      <ImageBackground source={image} style={styles.image} resizeMode={'contain'} >
                        <Image source={defaultArticle.image} style={styles.smallImage} />
                      </ImageBackground>
                    </TouchableHighlight>
                  </View>);
              } else {
                return (
                  <View key={image.uri} style={styles.item}>
                    <TouchableHighlight style={styles.imageCell} onPress={() => this.onImageSelected(edge)}>
                      <Image source={image} style={styles.image} resizeMode={'contain'} />
                    </TouchableHighlight>
                  </View>);
              }
            })
          }
        </ScrollView>
      </View>);
  };
}

const styles = StyleSheet.create({
  scroll: {
    marginLeft: 5,
    marginRight: 5,
    height: hp(75)
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  containerView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  imageCell: {
    margin: 5,
    padding: 5,
    height: undefined,
    aspectRatio: Platform.OS === 'android'? .75 : 1, // Andoroid camera ratio
    width: wp(30),
  },
  smallImage: {
    width: 30,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: 'white'

  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
  },
  item: Platform.select({
    ios: {
      flexBasis: '30%',
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      flexDirection: 'column',

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 9,
    },
    android: {
      flexBasis: '30%',
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
      flexDirection: 'column',
    }
  }),
  topButtonGroup: {
    flexDirection: 'row',
    marginBottom: 10
  }
});