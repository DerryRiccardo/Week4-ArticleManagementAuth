import prisma from "../config/db.config.js";

class ArticleRepository {
	static async getAllPublished() {
		return await prisma.article.findMany({
			where: {
				published: true,
			},
		});
	}

	static async getAll() {
		return await prisma.article.findMany();
	}

	static async getById(id) {
		return await prisma.article.findUnique({
			where: {
				id: parseInt(id),
			},
		});
	}

	static async create(data) {
		return await prisma.article.create({
			data,
		});
	}

	static async update(id, data) {
		return await prisma.article.update({
			where: {
				id: parseInt(id),
			},
			data,
		});
	}

	static async delete(id) {
		return await prisma.article.delete({
			where: {
				id: parseInt(id),
			},
		});
	}

	static async searchByTitle(query) {
		return await prisma.article.findMany({
			where: {
				title: {
					contains: query,
				},
			},
		});
	}
}

export default ArticleRepository;
