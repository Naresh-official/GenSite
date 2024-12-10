import { MoveUpRight } from "lucide-react";
import HomePageInput from "@/components/HomePageInput";
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
					<HomePageInput />
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
