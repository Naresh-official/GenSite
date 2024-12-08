import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="w-full p-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-semibold text-2xl">GenSite</span>
					</Link>
				</div>
				<div className="flex flex-1 items-center space-x-2 justify-end">
					<Button variant="ghost" asChild>
						<Link href="/sign-in">Sign In</Link>
					</Button>
					<Button asChild>
						<Link href="/sign-up">Sign Up</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
