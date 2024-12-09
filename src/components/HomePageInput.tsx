"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

function HomePageInput() {
	const [loading, setLoading] = useState<boolean>(false);
	const [filePrompts, setFilePrompts] = useState<string[]>([]);
	const [prompts, setPrompts] = useState<string[]>([]);
	const [title, setTitle] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = (
			document.getElementById("inputMessage") as HTMLInputElement
		).value;
		try {
			setLoading(true);
			const { data } = await axios.post("/api/template", {
				message: input,
			});
			setFilePrompts(data?.filePrompts as string[]);
			setPrompts(data?.prompts as string[]);
			setTitle(data?.title as string);
			await handleCreateConversation(data?.title as string);
		} catch (error) {
			console.error(error);
		} finally {
			(
				document.getElementById("inputMessage") as HTMLInputElement
			).value = "";
			setLoading(false);
		}
	};

	const handleCreateConversation = async (title: string) => {
		try {
			setLoading(true);
			const { data } = await axios.post("/api/conversation", {
				title,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl w-full flex items-center border border-muted-foreground py-3 px-5 rounded-[--radius]">
			<form
				onSubmit={handleSubmit}
				autoComplete="off"
				className="w-full flex"
			>
				<Input
					placeholder="Ask GenSite a question..."
					disabled={loading}
					id="inputMessage"
					autoComplete="off"
					className="h-12 w-full outline-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-10"
				/>
				<div className="inset-y-0 right-3 flex items-center space-x-2">
					<Button
						size="icon"
						type="submit"
						variant="ghost"
						disabled={loading}
						className="bg-muted-foreground/20 hover:bg-muted-foreground/40 disabled:bg-muted-foreground/10"
					>
						<ArrowUp className="h-10 w-10" />
					</Button>
				</div>
			</form>
		</div>
	);
}

export default HomePageInput;
