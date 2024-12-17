import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	(() => {
		const client = new PrismaClient();
		if (process.env.NODE_ENV !== "production")
			globalForPrisma.prisma = client;
		return client;
	})();
