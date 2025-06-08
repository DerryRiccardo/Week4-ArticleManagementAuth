import ArticleService from "../services/articleService.js";
import Joi from "joi";

class ArticleController {
	static async getAllPublishedArticles(req, res) {
		try {
			const articles = await ArticleService.getAllPublished();

			res.status(200).json({
				success: true,
				message: "Published articles retrieved successfully",
				data: articles,
				count: articles.length,
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve published articles",
				error: err.message,
			});
		}
	}

	static async getAllArticles(req, res) {
		try {
			const articles = await ArticleService.getAllArticles();

			res.status(200).json({
				success: true,
				message: "All articles retrieved successfully",
				data: articles,
				count: articles.length,
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: "Failed to retrieve articles",
				error: err.message,
			});
		}
	}

	static async createArticle(req, res) {
		// Validate request body
		const schema = Joi.object({
			title: Joi.string().required(),
			content: Joi.string().required(),
			author: Joi.string().required(),
		});

		try {
			await schema.validateAsync(req.body);

			const article = await ArticleService.createArticle(req.body);

			res.status(201).json({
				success: true,
				message: "Article created successfully",
				data: article,
			});
		} catch (err) {
			if (err.isJoi) {
				return res.status(400).json({
					success: false,
					message: "Title, content, and author are required",
				});
			}

			res.status(400).json({
				success: false,
				message: "Failed to create article",
				error: err.message,
			});
		}
	}

	static async updateArticle(req, res) {
		// Validate request body
		const schema = Joi.object({
			title: Joi.string().optional(),
			content: Joi.string().optional(),
			author: Joi.string().optional(),
			published: Joi.boolean().optional(),
		});

		try {
			await schema.validateAsync(req.body);

			const article = await ArticleService.updateArticle(
				req.params.id,
				req.body
			);

			res.status(200).json({
				success: true,
				message: "Article updated successfully",
				data: article,
			});
		} catch (err) {
			if (err.isJoi) {
				return res.status(400).json({
					success: false,
					message: "Invalid data format",
				});
			}

			const status = err.message === "Article not found" ? 404 : 400;
			res.status(status).json({
				success: false,
				message: "Failed to update article",
				error: err.message,
			});
		}
	}

	static async deleteArticle(req, res) {
		try {
			await ArticleService.deleteArticle(req.params.id);

			res.status(200).json({
				success: true,
				message: "Article deleted successfully",
			});
		} catch (err) {
			const status = err.message === "Article not found" ? 404 : 500;
			res.status(status).json({
				success: false,
				message: "Failed to delete article",
				error: err.message,
			});
		}
	}

	static async publishArticle(req, res) {
		try {
			const article = await ArticleService.publishArticle(req.params.id);

			res.status(200).json({
				success: true,
				message: "Article published successfully",
				data: article,
			});
		} catch (err) {
			const status = err.message === "Article not found" ? 404 : 500;
			res.status(status).json({
				success: false,
				message: "Failed to publish article",
				error: err.message,
			});
		}
	}

	static async searchArticleByTitle(req, res) {
		try {
			const { q } = req.query;

			const articles = await ArticleService.searchArticleByTitle(q);

			res.status(200).json({
				success: true,
				message:
					articles.length > 0
						? "Search completed successfully"
						: "No articles found matching your search",
				data: articles,
				query: q,
				count: articles.length,
			});
		} catch (err) {
			if (err.message === "Search query is required") {
				return res.status(400).json({
					success: false,
					message: err.message,
				});
			}

			res.status(500).json({
				success: false,
				message: "Search failed",
				error: err.message,
			});
		}
	}
}

export default ArticleController;
