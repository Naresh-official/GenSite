import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { hashPassword } from "../../../../../prisma/utils/userHelpers";

export async function POST(request: Request) {
	try {
		const signUpData = await request.json();
		const existingUser = await prisma.user.findUnique({
			where: {
				email: signUpData.email,
			},
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}
		if (!signUpData.password && !signUpData.provider) {
			return NextResponse.json(
				{ error: "Password is required" },
				{ status: 400 }
			);
		}
		const newUser = await prisma.user.create({
			data: {
				name: signUpData.name,
				email: signUpData.email,
				password: signUpData.provider
					? null
					: await hashPassword(signUpData.password as string),
				isSocialLogin: signUpData.isSocialLogin,
				provider: signUpData.provider ? signUpData.provider : null,
			},
		});
		if (!newUser) {
			throw new Error("Unable to create user");
		}
		const displayUser = {
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			isSocialLogin: newUser.isSocialLogin,
			provider: newUser.provider,
		};
		return NextResponse.json(displayUser, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
