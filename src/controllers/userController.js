import UserService from "../services/userService.js";
import Joi from "joi";

class UserController {
	static async register(req, res) {
		const schema = Joi.object({
			name: Joi.string().min(2).max(100).required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
			dateOfBirth: Joi.date().required(),
		});

		try {
			await schema.validateAsync(req.body);
			// satu per satu disetor kalau error
			const user = await UserService.registerUser(req.body);

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: user,
			});			
		} catch (err) {
			if (err.isJoi) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					error: err.message,
				});
			}

			res.status(400).json({
				success: false,
				message: "Failed to register user",
				error: err.message,
			});
		}
	}

	static async login(req, res) {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
		});

		try {
			await schema.validateAsync(req.body);

			const { email, password } = req.body;
			const result = await UserService.loginUser(email, password);

			res.status(200).json({
				success: true,
				message: "Login successful",
				token: result,
			});
		} catch (err) {
			if (err.isJoi) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					error: err.message,
				});
			}

			res.status(401).json({
				success: false,
				message: "Failed to login",
				error: err.message,
			});
		}
	}

	static async assignRole(req, res) {
		const schema = Joi.object({
			email: Joi.string().email().required(),
			role: Joi.string().valid("READER", "WRITER", "EDITOR", "ADMIN").required(),
		});

		try {
			await schema.validateAsync(req.body);

			const { email, role } = req.body;
			const updatedUser = await UserService.assignRole(email, role);

			res.status(200).json({
				success: true,
				message: "Role assigned successfully",
				data: updatedUser,
			});
		} catch (err) {
			if (err.isJoi) {
				return res.status(400).json({
					success: false,
					message: "Validation error",
					error: err.message,
				});
			}

			const status = err.message === "User not found" ? 404 : 400;
			res.status(status).json({
				success: false,
				message: "Failed to assign role",
				error: err.message,
			});
		}
	}
}

export default UserController;

// import prisma from "../config/db.config.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// export const RegisterController = async (req, res) => {
// 	try {
// 		const { name, email, password } = req.body;

// 		const user = await prisma.user.findFirst({
// 			where: {
// 				email: email,
// 			},
// 		});

// 		if (user) {
// 			return res.status(400).json({ message: "User already exists" });
// 		}

// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		const newUser = await prisma.user.create({
// 			data: {
// 				name: name,
// 				email: email,
// 				password: hashedPassword,
// 			},
// 		});

// 		return res.status(201).json({ newUser });
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({ message: "Internal server error" });
// 	}
// };

// export const SigninController = async (req, res) => {
// 	try {
// 		const { email, password } = req.body;

// 		const user = await prisma.user.findFirst({
// 			where: {
// 				email: email,
// 			},
// 		});

// 		if (!user) {
// 			return res.status(400).json({ message: "User does not exists" });
// 		}

// 		const comparePassword = await bcrypt.compare(password, user.password);

// 		if (!comparePassword) {
// 			return res.status(400).json({ message: "Invalid credentials" });
// 		}

// 		const payload = {
// 			id: user.id,
// 			name: user.name,
// 			email: user.email,
// 			password: user.password,
// 		};

// 		const token = jwt.sign(payload, process.env.JWT_SECRET);

// 		return res.status(200).json({ message: "Login Succesful", token });
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json({ message: "Internal server error" });
// 	}
// };
