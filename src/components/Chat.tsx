"use client";

import { useEffect, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import Container from "./Container";
import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import axios from "axios";
import { title } from "process";
import { useParams } from "next/navigation";

export function Chat() {
	const { chatId } = useParams();

	const inputMessage = useSelector((state: any) => state.input.value);
	const [filePrompts, setFilePrompts] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [messages, setMessages] = useState<
		{
			id: string;
			content: string;
			role: "USER" | "MODEL";
			createdAt: string;
		}[]
	>([]);

	useEffect(() => {
		getAllMessages().then(() => {
			if (messages.length === 0) {
				getTemplate();
			}
		});
	}, []);

	const getTemplate = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post("/api/template", {
				message: inputMessage,
			});
			// run name change and first message simultaneously
			const [nameChangeResponse, messageResponse] = await Promise.all([
				axios.patch("/api/conversation", {
					id: chatId,
					title: data?.title,
				}),
				axios.post(`/api/chat?id=${chatId}`, {
					templatePrompts: data?.prompts,
					prompt: inputMessage,
				}),
			]);
			setFilePrompts(data.filePrompts);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(error?.response?.data?.error);
			} else if (error instanceof Error) {
				console.error(error?.message);
			} else {
				console.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	const getAllMessages = async () => {
		try {
			const { data } = await axios.get(`/api/conversation?id=${chatId}`);
			setMessages(data?.messages);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log(error?.response?.data?.error);
			} else if (error instanceof Error) {
				console.error(error?.message);
			} else {
				console.error(error);
			}
		}
	};

	return (
		<div className="bg-zinc-800 p-1 h-screen">
			<ResizablePanelGroup direction="horizontal" className="gap-[2px]">
				<ResizablePanel defaultSize={50} minSize={40}>
					<div className="flex h-full rounded-2xl flex-col bg-background">
						<div className="flex-1 p-3 overflow-y-auto">
							show messages
						</div>
						<div className="border-t p-4">
							<ChatInput loading={loading} />
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50} minSize={40}>
					<Container />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
