import React from "react";

function Message({
	message,
}: {
	message: {
		id: string;
		content: string;
		role: "USER" | "MODEL";
		createdAt: string;
	};
}) {
	return (
		<div
			key={message.id}
			className={`p-4 rounded-xl text-sm ${
				message.role === "USER"
					? "w-[70%] self-end bg-zinc-900"
					: "px-12 mb-10"
			}`}
		>
			<div className="flex items-center justify-start">
				<span className="text-sm font-medium text-muted-foreground bg-zinc-700 px-4 py-1 rounded-full">
					{message.role === "USER" ? "You" : "GenSite"}
				</span>
			</div>
			<div className="mt-2">{message.content}</div>
		</div>
	);
}

export default Message;
