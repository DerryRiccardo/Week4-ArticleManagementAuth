import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import articleRoutes from "./src/routes/articleRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/article", articleRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
