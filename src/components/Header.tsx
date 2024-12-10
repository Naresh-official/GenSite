import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";

export async function Header() {
	const session = await getServerSession();
	return (
		<header className="w-screen p-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-semibold text-2xl">GenSite</span>
					</Link>
				</div>
				{session == null && (
					<div className="flex flex-1 items-center space-x-2 justify-end">
						<Button variant="ghost" asChild>
							<Link href="/login">Sign In</Link>
						</Button>
						<Button asChild>
							<Link href="/signup">Sign Up</Link>
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
