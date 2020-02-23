'use strict';

import { Dimensions } from 'react-native';

enum ArticleType { wTop = 'wTop', wBottom = 'wBottom', wShoe = 'wShoe' }

const { width: viewportWidth, height: vieportHeight } = Dimensions.get('window');
function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
function hp(percentage: number) {
  const value = (percentage * vieportHeight) / 100;
  return Math.round(value);
}

interface AImage {
  uri: string;
}

interface IArtImage {
  image: AImage
  type?: ArticleType;
  relavance?: string;
}

interface IArticle extends IArtImage {
  type: ArticleType;
  relavance: string;
  rating: number;
  date: Date;
  defaultImage: boolean;
}

class Article implements IArticle {
  image: AImage;
  type: ArticleType;
  rating: number;
  relavance: string;
  date: Date;
  defaultImage: boolean;
  
  constructor(uri: string, type: ArticleType, rating: number = 2.5, defaultImage: boolean = false) {
    this.image = { uri: uri }; // for static images the uri is the file name
    this.type = type;
    this.rating = rating;
    this.date = new Date();
    this.defaultImage = defaultImage;
    this.relavance = `${this.rating}|${this.date.getTime()}`;
  }

  static updateRelavance(article: IArticle): void {
    const mils:number = new Date(article.date).getTime();
    article.relavance = `${article.rating}|${mils}`;
  }
}

export { wp, hp, Article as Article, ArticleType, AImage, IArtImage, IArticle };

