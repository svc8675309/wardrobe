import { Article, ArticleType, IArticle } from './article';
import { WStorage } from './w-storage';

let topCache: IArticle[] = [];
let bottomCache: IArticle[] = [];
let shoeCache: IArticle[] = [];

export class WStorageCache {

	/**
	 * Load cache
	 */
	static loadCaches() {
		console.log("loadCaches");
		WStorage.getAsJson(ArticleType.wTop).then(articles => { topCache = (articles && articles.length > 0) ? articles : topCache })
			.catch(error => { console.log(`WStorageCache.loadCache()  error: ${error}`) });
		WStorage.getAsJson(ArticleType.wBottom).then(articles => { bottomCache = (articles && articles.length > 0) ? articles : bottomCache })
			.catch(error => { console.log(`WStorageCache.loadCache()  error: ${error}`) });
		WStorage.getAsJson(ArticleType.wShoe).then(articles => { shoeCache = (articles && articles.length > 0) ? articles : shoeCache })
			.catch(error => { console.log(`WStorageCache.loadCache()  error: ${error}`) });
	}

	/**
	 * Save cache 
	 */
	static writeCaches() {
		console.log("writeCaches");
		WStorage.setAsJson(ArticleType.wTop, topCache)
			.catch(error => { console.log(`WStorageCache.saveCaches() error: ${error}`) });
		WStorage.setAsJson(ArticleType.wBottom, bottomCache)
			.catch(error => { console.log(`WStorageCache.saveCaches() error: ${error}`) });
		WStorage.setAsJson(ArticleType.wShoe, shoeCache)
			.catch(error => { console.log(`WStorageCache.saveCaches() error: ${error}`) });
	}

	static clearArticles() {
		WStorage.clear(ArticleType.wTop);
		WStorage.clear(ArticleType.wBottom);
		WStorage.clear(ArticleType.wShoe);

		topCache = [];
		bottomCache = [];
		shoeCache = [];
	}

	static updateCache(correctArray: IArticle[], articleType: ArticleType) {
		switch (articleType) {
			case ArticleType.wTop: { return topCache = correctArray; break }
			case ArticleType.wBottom: { return bottomCache = correctArray; break }
			case ArticleType.wShoe: { return shoeCache = correctArray; break }
		}
	}

	static getByUri(uri: string) {
		let article = topCache.find(art => { return art.image.uri === uri });
		if (!article) {
			article = bottomCache.find(art => { return art.image.uri === uri });
			if (!article) {
				article = shoeCache.find(art => { return art.image.uri === uri })
			}
		}
		return article;
	}

	static getByUriAndType(uri: string, articleType: ArticleType) {
		return WStorageCache.getArticleData(articleType).find(article => { return article.image.uri === uri });
	}

	/**
	 * Get cache data
	 */
	static getArticleData(articleType: ArticleType): IArticle[] {
		if (!articleType) {
			return [];
		}
		switch (articleType) {
			case ArticleType.wTop: { return topCache; }
			case ArticleType.wBottom: { return bottomCache; }
			case ArticleType.wShoe: { return shoeCache; }
			default: return [];
		}
	}

	/**
	 * Add to cache 
	 */
	static addUpdateArticle(article: IArticle): IArticle[] {
		const adSource = WStorageCache.getArticleData(article.type);
		// Make sure it's not here
		const eIndex = adSource.findIndex(art => {
			return art.image.uri === article.image.uri;
		});
		if (eIndex === -1) {
			adSource.push(article);
		} else {
			// Update
			const eArticle = adSource[eIndex];
			eArticle.date = article.date;
			eArticle.rating = article.rating;
			Article.updateRelavance(eArticle);
		}
		return adSource;
	}

	/**
	 * Returns the article that was removed and its old index
	 */
	static removeArticle(uri: string, sourceAt: ArticleType): { article: IArticle, ad: IArticle[] } {
		// Find the article in WStorage source And remove it always
		const adSource = WStorageCache.getArticleData(sourceAt);

		// Remove from the old
		let atSource: IArticle = undefined;
		let sIndex: number = adSource.findIndex(art => { return art.image.uri === uri; });
		if (sIndex !== -1) {
			atSource = adSource[sIndex];
			adSource.splice(sIndex, 1);
		}
		return { article: atSource, ad: adSource };
	}

	/**
	 * Copy an article from one type to another
	 * if target is null then it's just a remove
	 */
	static async copyArticleData(uri: string, sourceAt: ArticleType, targetAt: ArticleType) {
		// Remove the old
		const source = WStorageCache.removeArticle(uri, sourceAt);

		// Add to the new if applicable
		if (targetAt) {
			if (source) {
				source.article.type = targetAt;
				WStorageCache.addUpdateArticle(source.article);
			} else {
				const article = new Article(uri, targetAt);
				WStorageCache.addUpdateArticle(article);
			}
		}
	}
}

