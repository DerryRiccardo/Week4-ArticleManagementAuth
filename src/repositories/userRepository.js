import prisma from "../config/db.config.js";

class UserRepository {
	static async findByEmail(email) {
		return await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	}

	static async findById(id) {
		return await prisma.user.findUnique({
			where: {
				id: parseInt(id),
			},
		});
	}

	static async createUser(data) {
		return await prisma.user.create({
			data,
		});
	}

	static async updateUser(id, data) {
		return await prisma.user.update({
			where: {
				id: parseInt(id),
			},
			data,
		});
	}
}

export default UserRepository;