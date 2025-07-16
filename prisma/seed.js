import pkg from "@prisma/client";
import bcrypt from "bcrypt";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash("admin@123", 10);

	const admin = await prisma.user.create({
		data: {
			name: "Admin",
			email: "tripi.tropi@gagak.com",
			password: hashedPassword,
			role: "ADMIN",
			dateOfBirth: new Date("2000-01-10"),
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
