import { IArticle } from './article';
import { WStorageCache } from './w-storage-cache';
export class SimpleCallback {

    static cb1: (article: IArticle) => void;
    static cb2: (article: IArticle) => void;

    public static listenForAddImage1(cb1: (article: IArticle) => void) {
        this.cb1 = cb1;
    }

    public static listenForAddImage2(cb2: (article: IArticle) => void) {
        this.cb2 = cb2;
    }

    public static emit(article: IArticle) {
        WStorageCache.addUpdateArticle(article);
        this.cb1(article);
        this.cb2(article)
    }
}