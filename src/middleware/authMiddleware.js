import jwt from "jsonwebtoken";

class AuthMiddleware {
	static authenticateToken(req, res, next) {
		const { authorization } = req.headers; // ambil token dari header Authorization

		if (!authorization) {
			return res.status(401).json({
				success: false,
				message: "Access token required",
			});
		}

		const token = authorization.split(" ")[1]; // ambil bagian token tanpa "Bearer"
		const secret = process.env.JWT_SECRET;

		try {
			const decoded = jwt.verify(token, secret);
			req.user = decoded;
			next();
		} catch (err) {
			return res.status(403).json({
				success: false,
				message: "Invalid or expired token",
				error: err.message,
			});
		}
	}

	static adminOnly(req, res, next) {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (req.user.role !== "ADMIN") {
			return res.status(403).json({
				success: false,
				message: "Admin access required",
			});
		}

		next();
	}

	static writerOrAdmin(req, res, next) {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const allowedRoles = ["WRITER", "ADMIN"];
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Writer or Admin access required",
			});
		}

		next();
	}

	static editorOnly(req, res, next) {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		if (req.user.role !== "EDITOR") {
			return res.status(403).json({
				success: false,
				message: "Editor access required",
			});
		}

		next();
	}

	static canDelete(req, res, next) {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Authentication required",
			});
		}

		const allowedRoles = ["WRITER", "EDITOR", "ADMIN"];
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Writer, Editor, or Admin access required",
			});
		}

		next();
	}
}

export default AuthMiddleware;
