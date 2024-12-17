"use client";

import { useEffect, useRef, useState } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSelector } from "react-redux";
import ChatInput from "./ChatInput";
import axios from "axios";
import { useParams } from "next/navigation";
import { handleError } from "@/lib/ErrorHandler";
import MessageContainer from "./MessageContainer";
import EditorContainer from "./EditorContainer";

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

	const containerRef = useRef<HTMLDivElement>(null);

	// Function to scroll the container to the bottom
	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: containerRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	const didRun = useRef(false);
	useEffect(() => {
		if (didRun.current) return; // Prevent duplicate execution
		didRun.current = true;
		const fetchData = async () => {
			const fetchedMessages = await getAllMessages();
			if (fetchedMessages.length === 0) {
				setMessages([
					// first two messages are ignored because they are system messages
					{
						id: crypto.randomUUID() as string,
						content: inputMessage,
						role: "USER",
						createdAt: new Date().toISOString(),
					},
					{
						id: crypto.randomUUID() as string,
						content: "Hello! How can I help you today?",
						role: "MODEL",
						createdAt: new Date().toISOString(),
					},
					{
						id: crypto.randomUUID() as string,
						content: inputMessage as string,
						role: "USER",
						createdAt: new Date().toISOString(),
					},
				]);
				await getTemplate();
			}
		};

		fetchData();
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
			getAllMessages();
			setFilePrompts(data.filePrompts);
		} catch (error: unknown) {
			handleError(error);
		} finally {
			setLoading(false);
		}
	};

	const getAllMessages = async () => {
		try {
			const { data } = await axios.get(`/api/conversation?id=${chatId}`);
			setMessages(data?.messages);
			return data?.messages || [];
		} catch (error: unknown) {
			handleError(error);
			return [];
		}
	};

	return (
		<div className="bg-zinc-800 p-1 h-screen">
			<ResizablePanelGroup direction="horizontal" className="gap-[2px]">
				<ResizablePanel defaultSize={50} minSize={40}>
					<div className="flex h-full rounded-2xl flex-col bg-background overflow-hidden">
						<MessageContainer
							ref={containerRef}
							messages={messages}
							setMessages={setMessages}
							scrollToBottom={scrollToBottom}
						/>
						<div className="border-t p-4">
							<ChatInput
								loading={loading}
								setLoading={setLoading}
								setMessages={setMessages}
								scrollToBottom={scrollToBottom}
							/>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50} minSize={40}>
					<EditorContainer />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
