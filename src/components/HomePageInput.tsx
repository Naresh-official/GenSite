"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setInput } from "@/store/features/inputSlice";
import { handleError } from "@/lib/ErrorHandler";

function HomePageInput() {
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();
	const dispatch = useDispatch();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			setLoading(true);
			const inputMessage = (
				document.getElementById("inputMessage") as HTMLInputElement
			).value;
			if (!inputMessage) {
				throw new Error("Please enter a message");
			}
			dispatch(setInput(inputMessage));
			const { data } = await axios.post("/api/conversation");
			(
				document.getElementById("inputMessage") as HTMLInputElement
			).value = "";
			if (data?.id) {
				router.push(`/chat/${data.id}`);
			}
		} catch (error: unknown) {
			handleError(error);
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
