import express from 'express';
import UserController from "../controllers/userController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.put("/assignrole", AuthMiddleware.authenticateToken, AuthMiddleware.adminOnly, UserController.assignRole);

export default router;