import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
	// Create a new user
	const user = await prisma.user.create({
		data: {
			name: "Alice Example",
			email: `alice${Date.now()}@example.com`,
			hashedPassword: "hashedpassword123",
		},
	})

	// Create a resume for the user
	const _resume = await prisma.resume.create({
		data: {
			title: "Sample Resume",
			slug: `sample-resume-${Date.now()}`,
			userId: user.id,
		},
	})

	// Fetch all users and their resumes
	const usersWithResumes = await prisma.user.findMany({
		include: {
			resumes: true,
		},
	})

	console.log("Users and their resumes:", JSON.stringify(usersWithResumes, null, 2))
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
