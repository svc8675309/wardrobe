import CameraRoll, { AssetType, GroupType } from "@react-native-community/cameraroll";
import React, { Component } from "react";
import { AppState, AppStateStatus, Image, View } from "react-native";
import { NavigationContainerProps, NavigationEventSubscription } from "react-navigation";
import DefaultArticles from "../data/default-articles";
import { smallImageStyle } from "../main-app";
import { ArticleType, IArticle } from "../shared/article";
import { Constants } from "../shared/constants";
import { SimpleCallback } from "../shared/simple-callback";
import { WStorageCache } from "../shared/w-storage-cache";
import ArticlePager from "./article-pager";

// Hacky way to get the ArticleCamera params from the parent so we can set this article type on swipe... 
interface IParentParam {
  key: string;
  params: { articleType: ArticleType };
}

interface IState {
  appState: AppStateStatus;
  cameraDataLoaded: boolean;
}

/**
 * Wardrobe of clothing articles
 */
export default class WardrobeView extends Component<NavigationContainerProps, IState> {
  static navigationOptions = {
    swipeEnabled: false,
    tabBarIcon: ({ tintColor, focused }) => (
      <Image source={ Constants.open ?  require('../../assets/open-resources/wardrobe.png') :require('../../assets/resources/wardrobe.png')} style={smallImageStyle.image} />
    )
  };

  // invoked when this tab gained focus
  focusListener: NavigationEventSubscription;

  topRef: React.RefObject<ArticlePager>;
  bottomRef: React.RefObject<ArticlePager>;
  shoeRef: React.RefObject<ArticlePager>;

  constructor(props: any) {
    super(props);
    this.state = { appState: AppState.currentState, cameraDataLoaded: false };
    this.artTypeCb = this.artTypeCb.bind(this);
    this.topRef = React.createRef<ArticlePager>();
    this.bottomRef = React.createRef<ArticlePager>();
    this.shoeRef = React.createRef<ArticlePager>();
    this.getDataFromCache = this.getDataFromCache.bind(this);
    this.getDataFromCamera = this.getDataFromCamera.bind(this);
    this.cameraTookPictureCb = this.cameraTookPictureCb.bind(this);
  }

  componentDidMount() {
    SimpleCallback.listenForAddImage1(this.cameraTookPictureCb);
    this.getDataFromCamera();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.focusListener = this.props.navigation.addListener('didFocus',
      payload => {
        this.getDataFromCache();
        WStorageCache.writeCaches();
      });
  }

  cameraTookPictureCb(article: IArticle) {
    // the camera took a picture
    switch (article.type) {
      case ArticleType.wTop:
        this.topRef.current.cameraTookPicture(article);
        break;
      case ArticleType.wBottom:
        this.bottomRef.current.cameraTookPicture(article);
        break;
      case ArticleType.wShoe:
        this.shoeRef.current.cameraTookPicture(article);
        break;
    }
  }

  _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log("wardrobe._handleAppStateChange");
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

  getDataFromCamera() {
    console.log("wardrobe getDataFromCamera()");
    CameraRoll.getPhotos({
      first: 1000,
      assetType: 'Photos' as AssetType,
      groupTypes: 'Album' as GroupType,
      groupName: Constants.wStorageUnitName
    }).then(identifiers => {

      const tops: IArticle[] = [];
      const bottoms: IArticle[] = [];
      const shoes: IArticle[] = [];

      identifiers.edges.forEach(edge => {
        let article = WStorageCache.getByUriAndType(edge.node.image.uri, ArticleType.wTop);
        if (article) {
          tops.push(article);
        } else {
          article = WStorageCache.getByUriAndType(edge.node.image.uri, ArticleType.wBottom);
          if (article) {
            bottoms.push(article);
          } else {
            article = WStorageCache.getByUriAndType(edge.node.image.uri, ArticleType.wShoe);
            if (article) {
              shoes.push(article);
            }
          }
        }
      });

      // Clean up the caches
      WStorageCache.updateCache(tops, ArticleType.wTop);
      WStorageCache.updateCache(bottoms, ArticleType.wBottom);
      WStorageCache.updateCache(shoes, ArticleType.wShoe);

      // Send to the children
      this.topRef.current.parentSetState([DefaultArticles.getDefault(ArticleType.wTop)].concat(tops), 0);
      this.bottomRef.current.parentSetState([DefaultArticles.getDefault(ArticleType.wBottom)].concat(bottoms), 0);
      this.shoeRef.current.parentSetState([DefaultArticles.getDefault(ArticleType.wShoe)].concat(shoes), 0);
      this.setState({ cameraDataLoaded: true });
    });
  }

  getDataFromCache() {
    if (this.state.cameraDataLoaded) {
      console.log("wardrobe getDataFromCache()");
      const tops: IArticle[] = [DefaultArticles.getDefault(ArticleType.wTop)].concat(WStorageCache.getArticleData(ArticleType.wTop));
      const bottoms: IArticle[] = [DefaultArticles.getDefault(ArticleType.wBottom)].concat(WStorageCache.getArticleData(ArticleType.wBottom));
      const shoes: IArticle[] = [DefaultArticles.getDefault(ArticleType.wShoe)].concat(WStorageCache.getArticleData(ArticleType.wShoe));
      this.topRef.current.parentSetState(tops, 0);
      this.bottomRef.current.parentSetState(bottoms, 0);
      this.shoeRef.current.parentSetState(shoes, 0);
    }
  }

  artTypeCb(articleType: ArticleType, navTo = false) {
    if (navTo) {
      this.props.navigation.navigate('Camera', { articleType: articleType });
    } else {
      // Hacky way to get the ArticleCamera params from the parent so we can set this article type on swipe... 
      const routes: Array<IParentParam> = this.props.navigation.dangerouslyGetParent().state['routes'];
      routes.find(x => x.key === 'Camera').params.articleType = articleType;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, marginBottom: 20 }}>
        <ArticlePager ref={this.topRef} artTypeCb={this.artTypeCb} articleType={ArticleType.wTop} />
        <ArticlePager ref={this.bottomRef} artTypeCb={this.artTypeCb} articleType={ArticleType.wBottom} />
        <ArticlePager ref={this.shoeRef} artTypeCb={this.artTypeCb} articleType={ArticleType.wShoe} />
      </View>
    );
  };
}


