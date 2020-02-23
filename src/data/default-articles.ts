
import { Image } from 'react-native';
import { Article, ArticleType } from "../shared/article";
import { Constants } from '../shared/constants';

const top = new Article(Image.resolveAssetSource(
    Constants.open ? require('../../assets/open-resources/top0.png') : require('../../assets/resources/top0.png')).uri, ArticleType.wTop, 2.5, true);
const bottom = new Article(Image.resolveAssetSource(
    Constants.open ? require('../../assets/open-resources/bottom0.png') : require('../../assets/resources/bottom0.png')).uri, ArticleType.wBottom, 2.5, true);
const shoe = new Article(Image.resolveAssetSource(
    Constants.open ? require('../../assets/open-resources/shoe0.png') : require('../../assets/resources/shoe0.png')).uri, ArticleType.wShoe, 2.5, true);


export default class DefaultArticles {

    static getDemosUris(): string[] {
        let ret: string[] = [];

        ret.push(Image.resolveAssetSource(require('../../assets/top/top1.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/top/top2.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/top/top3.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/top/top4.jpg')).uri);

        ret.push(Image.resolveAssetSource(require('../../assets/bottom/bottom1.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/bottom/bottom2.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/bottom/bottom3.jpg')).uri);

        ret.push(Image.resolveAssetSource(require('../../assets/shoe/shoe1.jpg')).uri);
        ret.push(Image.resolveAssetSource(require('../../assets/shoe/shoe2.jpg')).uri);
        return ret;
    }


    static getDefault(articleType: ArticleType): Article {
        switch (articleType) {
            case ArticleType.wTop: { return top; break }
            case ArticleType.wBottom: { return bottom; break }
            case ArticleType.wShoe: { return shoe; break }
        }
    }
}


