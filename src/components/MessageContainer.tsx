"use client";
import React, { SetStateAction, useEffect } from "react";
import Message from "./Message";

interface MessageType {
	id: string;
	content: string;
	role: "USER" | "MODEL";
	createdAt: string;
}

interface MessageContainerProps {
	messages: MessageType[];
	setMessages: React.Dispatch<SetStateAction<MessageType[]>>;
	scrollToBottom: () => void;
}

const MessageContainer = React.forwardRef<
	HTMLDivElement,
	MessageContainerProps
>(({ messages, setMessages, scrollToBottom }, ref) => {
	useEffect(() => {
		scrollToBottom();
	}, [messages]);
	return (
		<div
			ref={ref}
			className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thumb-rounded-full"
		>
			<div className="flex flex-col gap-6">
				{messages.slice(2).map((message) => (
					<Message key={message.id} message={message} />
				))}
			</div>
		</div>
	);
});

export default MessageContainer;
