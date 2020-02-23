'use strict';

import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import AnimatedModal from 'react-native-modal';
import { Rating } from 'react-native-ratings';
import { smallImageStyle } from '../main-app';
import { IArticle } from '../shared/article';
import { Constants } from '../shared/constants';

export enum ManageDlgAction { OK, Cancel, Remove };

interface IState {
  article: IArticle;
  transientRating: number;
};

interface IProps {
  callback: (action: ManageDlgAction, article: IArticle) => void;
  article: IArticle;
}

export default class ArticleManage extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      article: props.article,
      transientRating: 2.5
    };
    this.onFinishedRating = this.onFinishedRating.bind(this);
    console.log("ArticleManage");
  }

  onDlgCancel() {
    this.props.callback(ManageDlgAction.Cancel, undefined)
  }

  onRatingsDlgOk() {
    const { transientRating, article } = this.state;
    article.rating = transientRating;
    this.props.callback(ManageDlgAction.OK, this.state.article)
  }

  onRemovedArticle() {
    this.props.callback(ManageDlgAction.Remove, this.state.article);
  }

  onRatingsDlg(item: IArticle) {
    this.setState({ article: item });
  }

  onFinishedRating(rating: number) {
    this.setState({ transientRating: rating });
  }

  render() {
    const { article } = this.state;
    return (
      <AnimatedModal backdropOpacity={0.3}
        style={styles.modal}
        isVisible={true}
        animationIn={Platform.OS === "ios" ? IOS_MODAL_ANIMATION : "zoomIn"}
        animationOut={"fadeOut"}>
        <View style={styles.content}>
          <TouchableOpacity style={{ margin: 10, justifyContent: 'flex-start' }} onPress={() => { this.onDlgCancel() }}  >
            <Image source={Constants.open ? require('../../assets/open-resources/back.png') : require('../../assets/resources/back.png')} style={smallImageStyle.image} />
          </TouchableOpacity>
          <Image source={article.image} style={styles.image} />
          <Rating style={{ paddingVertical: 10 } as any} type='star' ratingCount={5} imageSize={30}
            startingValue={article.rating} onFinishRating={this.onFinishedRating} />
          <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => { this.onRatingsDlgOk() }} >
              <Image source={Constants.open ? require('../../assets/open-resources/check.png') : require('../../assets/resources/check.png')} style={smallImageStyle.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.onRemovedArticle() }}  >
              <Image source={Constants.open ? require('../../assets/open-resources/hanger_off.png') : require('../../assets/resources/hanger_off.png')} style={smallImageStyle.image} />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedModal>
    );
  }
}

const IOS_MODAL_ANIMATION = {
  from: { opacity: 0, scale: 1.2 },
  0.5: { opacity: 1 },
  to: { opacity: 1, scale: 1 }
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  content: Platform.select({
    ios: {
      width: '60%',
      flexDirection: "column",
      borderRadius: 13,
      overflow: "hidden",
      backgroundColor: "white",
    },
    android: {
      flexDirection: "column",
      borderRadius: 3,
      padding: 16,
      margin: 16,
      backgroundColor: "white",
      overflow: "hidden",
      elevation: 4,
      minWidth: 300
    }
  }),
  image: Platform.select({
    ios: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'contain',
      borderColor: '#6593F5',
      borderWidth: 2,
      borderRadius: 10,
    },
    android: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      resizeMode: 'contain',
      borderColor: '#6593F5',
      borderWidth: 1,
      borderRadius: 10,
    }
  })
});



