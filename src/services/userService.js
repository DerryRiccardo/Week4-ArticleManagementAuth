import UserRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
	static async registerUser(data) {
		const { name, email, password, dateOfBirth } = data;

		const existingUser = await UserRepository.findByEmail(email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const userData = {
			name: name,
			email: email,
			password: hashedPassword,
			role: "READER",
			dateofBirth: new Date(dateOfBirth),
		};

		const user = await UserRepository.createUser(userData);
		return user;
	}

	static async loginUser(email, password) {
		const user = await UserRepository.findByEmail(email);
		if (!user) {
			throw new Error("Invalid email or password");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid email or password");
		}

		const payload = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "6h",
		});

		return token;
	}

	static async assignRole(email, newRole) {
		const existingUser = await UserRepository.findByEmail(email);
		if (!existingUser) {
			throw new Error("User not found");
		}

		const validRoles = ["WRITER", "EDITOR"];
		if (!validRoles.includes(newRole.toUpperCase())) {
			throw new Error("Invalid role");
		}

		const updatedUser = await UserRepository.updateUser(
			email,
			newRole.toUpperCase()
		);
		return updatedUser;
	}
}

export default UserService;
