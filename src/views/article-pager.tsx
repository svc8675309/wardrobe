'use strict';

import React from 'react';
import { Animated, Image, Platform, StyleSheet, TouchableHighlight, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import DefaultArticles from '../data/default-articles';
import { ArticleType, IArticle, wp } from '../shared/article';
import { WStorageCache } from '../shared/w-storage-cache';
import ArticleManage, { ManageDlgAction } from './article-manage';


const sliderWidth = wp(100);
const itemWidth = wp(60);


interface IState {
  articles: IArticle[];
  selectedIndex: number;
  selectedArticle: IArticle;
};

interface IProps {
  articleType: ArticleType,
  artTypeCb: (articleType: ArticleType, navTo: boolean) => void  // Used to let parent know this default type was just selected
}

export default class ArticlePager extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedIndex: undefined,
      selectedArticle: undefined,
      articles: [DefaultArticles.getDefault(props.articleType)],
    };

    this.articleRender = this.articleRender.bind(this);
    this.articleManage = this.articleManage.bind(this);
    this.articleManageCb = this.articleManageCb.bind(this);
    this.onSnapToItem = this.onSnapToItem.bind(this);
  }

  cameraTookPicture(article: IArticle) {
    const { articles } = this.state;
    articles.push(article);
    this.setState({ articles: articles });
    const carouselref = this.refs.carousel as any;
    carouselref.snapToPrev();
  }


  parentSetState(articles: IArticle[], index: number) {
    this.setState({ articles: articles });
    if (index > -1) {
      const carouselref = this.refs.carousel as any;
      carouselref.snapToItem(index);
    }
  }

  articleManage(anyArticle: IArticle, index: number) {
    const { selectedIndex, selectedArticle } = this.state;
    if (selectedArticle && anyArticle.image.uri === selectedArticle.image.uri &&
      selectedIndex && index === selectedIndex) {
      return (<ArticleManage callback={this.articleManageCb} article={this.state.selectedArticle} />)
    } else {
      return null;
    }
  }

  // Child article manage to this parent
  articleManageCb(action: ManageDlgAction, article: IArticle) {
    const { selectedIndex, selectedArticle, articles } = this.state;
    switch (action) {
      case ManageDlgAction.Cancel: {
        break;
      }
      case ManageDlgAction.OK: {
        // update cache
        WStorageCache.addUpdateArticle(selectedArticle);
        // update local state
        break;
      }
      case ManageDlgAction.Remove: {
        // Update cache
        WStorageCache.removeArticle(article.image.uri, this.props.articleType);
        // Update local state
        articles.splice(selectedIndex, 1);
        const carouselref = this.refs.carousel as any;
        carouselref.snapToPrev();
        break;
      }
    }
    this.setState({ selectedArticle: undefined, selectedIndex: undefined });
  };

  articleRender({ item, index }): JSX.Element {
    const article: IArticle = item as IArticle;
    return (
      <View style={styles.imageContainer}>
        <TouchableHighlight onPress={() => {
          if (article.defaultImage) {
            this.props.artTypeCb(this.props.articleType, true);
          } else {
            this.setState({ selectedArticle: article, selectedIndex: index });
          }
        }}>
          <Image source={article.image} style={styles.image} />
        </TouchableHighlight>
        {this.articleManage(article, index)}
      </View>
    );
  }

  onSnapToItem(slideIndex: number) {
    this.props.artTypeCb(this.props.articleType, false);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Carousel
          ref={'carousel'} // add this object by name to this.refs... aka this.refs.carousel
          data={this.state.articles}
          loop={false}
          onSnapToItem={this.onSnapToItem}
          renderItem={this.articleRender}
          sliderWidth={sliderWidth}
          useScrollView={true}
          itemWidth={itemWidth}
          enableMomentum={true}
          swipeThreshold={10}
          autoplay={false}
          activeSlideAlignment={'center'}
          containerCustomStyle={{ overflow: 'visible' }}
          activeAnimationType={'spring'}
          activeAnimationOptions={{
            friction: 4,
            tension: 40
          } as Animated.SpringAnimationConfig}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: Platform.select({
    ios: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center'
    },
    android: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center'
    }
  }),
  image: Platform.select({
    ios: {
      width: '80%',
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'contain'
    },
    android: {
      width: '60%',
      height: undefined,
      aspectRatio: .75,
      resizeMode: 'contain'
    }
  })
});



