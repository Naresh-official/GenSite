import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";

function ChatInput({ loading }: { loading: boolean }) {
	return (
		<div className="mx-auto max-w-3xl">
			<div className="relative">
				<Input
					className="h-12 rounded-lg pl-10 pr-20"
					placeholder="Ask GenSite a question..."
					disabled={loading}
				/>
				<div className="absolute inset-y-0 right-3 flex items-center space-x-2">
					<Button
						size="icon"
						variant="ghost"
						className="h-8 w-8"
						disabled={loading}
					>
						<ArrowUp className="h-6 w-6" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ChatInput;
