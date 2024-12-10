import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { uuidValidtor } from "@/schemas/conversationSchema";
import { ZodError } from "zod";

export async function POST(request: Request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		const user = await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string,
			},
			select: {
				id: true,
				conversation: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		const conversation = await prisma.conversation.create({
			data: {
				title: "New conversation",
				userId: user?.id as string,
			},
		});
		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not created" },
				{ status: 500 }
			);
		}
		return NextResponse.json(conversation, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			console.error("Validation Error: ", error.errors);
			return NextResponse.json(
				{ error: error.errors[0]?.message || "Validation error" },
				{ status: 400 }
			);
		} else if (error instanceof Error) {
			console.error("Server Error: ", error.message);
			return NextResponse.json(
				{ error: error.message || "Something went wrong" },
				{ status: 500 }
			);
		} else {
			console.error("Unknown Error: ", error);
			return NextResponse.json(
				{ error: "An unknown error occurred" },
				{ status: 500 }
			);
		}
	}
}

export async function GET(request: Request) {
	try {
		const session = await getServerSession();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		const user = await prisma.user.findUnique({
			where: {
				email: session?.user?.email as string,
			},
			select: {
				id: true,
				conversation: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		const url = new URL(request.url);
		const id = url.searchParams.get("id");
		if (id) {
			uuidValidtor.parse(id);
			const conversation = await prisma.conversation.findUnique({
				where: {
					id: id,
				},
				include: {
					messages: {
						orderBy: {
							createdAt: "asc",
						},
					},
				},
			});
			return NextResponse.json(conversation, { status: 200 });
		} else {
			const conversations = user?.conversation;
			return NextResponse.json(conversations, { status: 200 });
		}
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			console.error("Validation Error: ", error.errors);
			return NextResponse.json(
				{ error: error.errors[0]?.message || "Validation error" },
				{ status: 400 }
			);
		} else if (error instanceof Error) {
			console.error("Server Error: ", error.message);
			return NextResponse.json(
				{ error: error.message || "Something went wrong" },
				{ status: 500 }
			);
		} else {
			console.error("Unknown Error: ", error);
			return NextResponse.json(
				{ error: "An unknown error occurred" },
				{ status: 500 }
			);
		}
	}
}

export async function PATCH(request: Request) {
	try {
		const { id, title }: { id: string; title: string } =
			await request.json();
		const conversation = await prisma.conversation.update({
			where: {
				id: id,
			},
			data: {
				title: title,
			},
		});
		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(conversation, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof ZodError) {
			console.error("Validation Error: ", error.errors);
			return NextResponse.json(
				{ error: error.errors[0]?.message || "Validation error" },
				{ status: 400 }
			);
		} else if (error instanceof Error) {
			console.error("Server Error: ", error.message);
			return NextResponse.json(
				{ error: error.message || "Something went wrong" },
				{ status: 500 }
			);
		} else {
			console.error("Unknown Error: ", error);
			return NextResponse.json(
				{ error: "An unknown error occurred" },
				{ status: 500 }
			);
		}
	}
}
