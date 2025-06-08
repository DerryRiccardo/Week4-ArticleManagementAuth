import ArticleRepository from "../repositories/articleRepository.js";

class ArticleService {
	static async getAllPublished() {
		const articles = await ArticleRepository.getAllPublished();
		return articles;
	}

	static async getAllArticles() {
		const articles = await ArticleRepository.getAll();
		return articles;
	}

	static async createArticle(data) {
		const { title, content, author } = data;

		const articleData = {
			title,
			content,
			author,
			published: false,
		};

		const article = await ArticleRepository.create(articleData);
		return article;
	}

	static async updateArticle(id, data) {
		const existingArticle = await ArticleRepository.getById(id);
		if (!existingArticle) {
			throw new Error("Article not found");
		}

		const updatedArticle = await ArticleRepository.update(id, data);
		return updatedArticle;
	}

	static async deleteArticle(id) {
		const existingArticle = await ArticleRepository.getById(id);
		if (!existingArticle) {
			throw new Error("Article not found");
		}

		await ArticleRepository.delete(id);
		return { message: "Article deleted successfully" };
	}

	static async publishArticle(id) {
		const existingArticle = await ArticleRepository.getById(id);
		if (!existingArticle) {
			throw new Error("Article not found");
		}

		const publishedArticle = await ArticleRepository.update(id, {
			published: true,
		});
		return publishedArticle;
	}

	static async searchArticleByTitle(query) {
		if (!query || query.trim() === "") {
			throw new Error("Search query is required");
		}

		const articles = await ArticleRepository.searchByTitle(query.trim());
		return articles;
	}
}

export default ArticleService;
