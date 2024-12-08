import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, ArrowUp, MoveUpRight } from "lucide-react";
import { Header } from "@/components/Header";

export default function Home() {
	return (
		<div className="flex h-screen w-screen flex-col">
			<Header />
			<main className="flex-1 flex justify-center items-center px-2 md:px-4">
				<div className="flex  max-w-screen-2xl flex-col items-center justify-center py-20">
					<h1 className="mb-10 text-center text-4xl font-bold">
						What can I help you ship?
					</h1>
					<div className="max-w-2xl w-full flex items-center border border-muted-foreground py-3 px-5 rounded-[--radius]">
						<div className="inset-y-0 left-3 flex items-center">
							<Paperclip className="h-5 w-5 text-muted-foreground" />
						</div>
						<Input
							className="h-12 w-full outline-none border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-10"
							placeholder="Ask GenSite a question..."
						/>
						<div className="inset-y-0 right-3 flex items-center space-x-2">
							<Button
								size="icon"
								variant="ghost"
								className="bg-muted-foreground/20 hover:bg-muted-foreground/40"
							>
								<ArrowUp className="h-10 w-10" />
							</Button>
						</div>
					</div>
					<div className="flex flex-wrap max-w-2xl w-full gap-2 mt-4 text-sm">
						{[
							"Generate an onboarding form",
							"How can I schedule cron jobs?",
							"Write code to implement a min heap",
						].map((suggestion) => (
							<button
								key={suggestion}
								className="inline-flex items-center rounded-lg border px-4 py-1 text-sm text-muted-foreground hover:bg-accent"
							>
								{suggestion}
								<MoveUpRight className="ml-2 h-4 w-4" />
							</button>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
