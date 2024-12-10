import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "../../../../../../prisma/utils/userHelpers";

export const authOptions: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "password",
				},
			},
			async authorize(credentials) {
				try {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials?.email as string,
						},
					});
					if (!user) {
						return null;
					}
					if (
						!user?.password ||
						!(await verifyPassword(
							credentials?.password as string,
							user.password as string
						))
					) {
						return null;
					}
					return user;
				} catch (error: any) {
					console.log("error in authorize : ", error);
					return null;
				}
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, // 2 days
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider == "github") {
				try {
					const exitsingUser = await prisma.user.findUnique({
						where: {
							email: user?.email as string,
						},
					});
					if (!exitsingUser) {
						await prisma.user.create({
							data: {
								name: user?.name as string,
								email: user?.email as string,
								password: null,
								isSocialLogin: true,
								provider: "GITHUB",
							},
						});
						return true;
					} else {
						if (exitsingUser?.provider == "GITHUB") {
							return true;
						} else {
							return false;
						}
					}
				} catch (error: any) {
					console.log("error in signIn callback github : ", error);
					return false;
				}
			}

			if (account?.provider == "google") {
				try {
					const exitsingUser = await prisma.user.findUnique({
						where: {
							email: user?.email as string,
						},
					});
					if (!exitsingUser) {
						await prisma.user.create({
							data: {
								name: user?.name as string,
								email: user?.email as string,
								password: null,
								isSocialLogin: true,
								provider: "GOOGLE",
							},
						});
						return true;
					} else {
						if (exitsingUser?.provider == "GOOGLE") {
							return true;
						} else {
							return false;
						}
					}
				} catch (error: any) {
					console.log("error in signIn callback google : ", error);
					return false;
				}
			}
			if (account?.provider == "credentials") {
				return true;
			}
			return false;
		},
	},
};
