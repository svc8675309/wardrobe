// https://github.com/hmajid2301/medium/tree/master/11.%20React%20Navigation%20with%20React%20Native
import { Platform, StyleSheet } from 'react-native';
import { createAppContainer } from "react-navigation";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { ArticleType, hp } from './shared/article';
import CameraView from './views/camera-view';
import SettingsView from './views/settings-view';
import StorageUnitView from './views/storage-unit-view';
import WardrobeView from "./views/wardrobe-view";

const MainNavigator = createMaterialTopTabNavigator(
  {
    Wardrobe: { screen: WardrobeView },
    Camera: { screen: CameraView, params: { ['articleType']: ArticleType.wBottom } },
    Storage: { screen: StorageUnitView },
    Settings: { screen: SettingsView }
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      showIcon: true,
      showLabel: false,
      style: {
        marginTop: Platform.OS === 'ios' ? hp(5) : 0,
        marginBottom: hp(2),
        backgroundColor: '#6593F5'
      }
    },
  }
);

const MainApp = createAppContainer(MainNavigator);

export const smallImageStyle = StyleSheet.create({
  image: {
    width: 30,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain'
  }
});

export default MainApp;
