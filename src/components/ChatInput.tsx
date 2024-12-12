"use client";

import { SetStateAction, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { handleError } from "@/lib/ErrorHandler";
import axios from "axios";
import { useParams } from "next/navigation";

function ChatInput({
	loading,
	setLoading,
	setMessages,
	scrollToBottom,
}: {
	loading: boolean;
	setLoading: React.Dispatch<SetStateAction<boolean>>;
	setMessages: React.Dispatch<
		SetStateAction<
			{
				id: string;
				content: string;
				role: "USER" | "MODEL";
				createdAt: string;
			}[]
		>
	>;
	scrollToBottom: () => void;
}) {
	const { chatId } = useParams();
	const [inputPrompt, setInputPrompt] = useState<string>("");

	const sendMessage = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		try {
			if (inputPrompt === "" || !inputPrompt || loading) {
				throw new Error("Please enter a message");
			}
			setMessages((messages) => [
				...messages,
				{
					id: crypto.randomUUID() as string,
					content: inputPrompt as string,
					role: "USER",
					createdAt: new Date().toISOString(),
				},
			]);
			scrollToBottom();
			const { data } = await axios.post(`/api/chat?id=${chatId}`, {
				prompt: inputPrompt,
			});
			setMessages((messages) => [
				...messages,
				{
					id: crypto.randomUUID() as string,
					content: data as string,
					role: "MODEL",
					createdAt: new Date().toISOString(),
				},
			]);
			scrollToBottom();
		} catch (error: unknown) {
			handleError(error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="mx-auto max-w-3xl">
			<div className="relative">
				<form onSubmit={sendMessage}>
					<Input
						className="h-12 rounded-lg pl-10 pr-20"
						placeholder="Ask GenSite a question..."
						disabled={loading}
						value={inputPrompt}
						onChange={(e) => setInputPrompt(e.target.value)}
					/>
					<div className="absolute inset-y-0 right-3 flex items-center space-x-2">
						<Button
							size="icon"
							variant="ghost"
							className="h-8 w-8"
							type="submit"
							disabled={loading || !inputPrompt}
						>
							<ArrowUp className="h-6 w-6" />
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ChatInput;
