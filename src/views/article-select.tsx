import React, { Component } from "react";
import { Image, ImageStyle, StyleProp, StyleSheet, TouchableOpacity, View } from "react-native";
import DefaultArticles from "../data/default-articles";
import { ArticleType, wp } from "../shared/article";
import { Constants } from "../shared/constants";

interface IProps { removeItem?: boolean }
interface IState { articleType: ArticleType };

export default class ArticleSelect extends Component<IProps, IState> {

  removeItem: boolean = false;

  constructor(props: IProps) {
    super(props);
    this.removeItem = (props.removeItem) ? true : false;
    this.state = { articleType: ArticleType.wBottom };
  }

  onArticleTypeSelect(articleType: ArticleType) {
    try {
      this.setState({ articleType: articleType });
    } catch (error) {
      console.log(`ArticleSelect.onArticleTypeSelect() ArticleType = ${articleType} Error: ${error}`);
    }
  }

  onGetArticleType(): ArticleType {
    return this.state.articleType;
  }

  getImageStyle(check: ArticleType): StyleProp<ImageStyle> {
    let typeStyle = (check === this.state.articleType) ? styles.imageWBorder : styles.image;
    let width = (this.removeItem) ? wp(5) : wp(9);
    return { ...typeStyle, marginLeft: width, marginRight: width };
  }

  render() {
    if (this.removeItem) {
      return (
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wTop) }}  >
            <Image style={this.getImageStyle(ArticleType.wTop)} source={DefaultArticles.getDefault(ArticleType.wTop).image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wBottom) }}  >
            <Image style={this.getImageStyle(ArticleType.wBottom)} source={DefaultArticles.getDefault(ArticleType.wBottom).image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wShoe) }}  >
            <Image style={this.getImageStyle(ArticleType.wShoe)} source={DefaultArticles.getDefault(ArticleType.wShoe).image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(undefined) }}  >
            <Image style={this.getImageStyle(undefined)} source={Constants.open ? require('../../assets/open-resources/hanger_off.png') : require('../../assets/resources/hanger_off.png')} />
          </TouchableOpacity>
        </View>);
    } else {
      return (
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wTop) }}  >
            <Image style={this.getImageStyle(ArticleType.wTop)} source={DefaultArticles.getDefault(ArticleType.wTop).image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wBottom) }}  >
            <Image style={this.getImageStyle(ArticleType.wBottom)} source={DefaultArticles.getDefault(ArticleType.wBottom).image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onArticleTypeSelect(ArticleType.wShoe) }}  >
            <Image style={this.getImageStyle(ArticleType.wShoe)} source={DefaultArticles.getDefault(ArticleType.wShoe).image} />
          </TouchableOpacity>
        </View>);
    }
  };
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  image: {
    width: wp(15),
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    backgroundColor: 'white'
  },
  imageWBorder: {
    width: wp(15),
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderColor: '#6593F5',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'white'
  }
});
