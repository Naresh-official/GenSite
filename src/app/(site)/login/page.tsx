"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { ZodError } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/ErrorHandler";

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { data: sessionData } = useSession();
	const router = useRouter();

	const handleCredentialLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			if (sessionData && sessionData.user) {
				throw new Error("You are already signed in. Please sign out.");
			}
			const formdata = {
				email,
				password,
			};
			signInSchema.parse(formdata);
			const response = await signIn("credentials", {
				...formdata,
				redirect: false,
			});
			if (response?.ok) {
				router.push("/");
			} else {
				setError("Invalid email or password");
			}
		} catch (error: unknown) {
			setError(handleError(error));
		} finally {
			setIsLoading(false);
		}
	};

	const handleSocialSignIn = async (provider: string) => {
		setIsLoading(true);
		try {
			if (sessionData && sessionData.user) {
				throw new Error("You are already signed in. Please sign out.");
			}
			await signIn(provider, {
				callbackUrl: "/",
			});
		} catch (error: unknown) {
			setError(handleError(error));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container flex h-screen w-screen items-center justify-center">
			<div className="mx-auto flex w-[90%] flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Welcome back
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email to sign in to your account
					</p>
				</div>
				<div className="grid gap-6">
					<form onSubmit={handleCredentialLogin}>
						<div className="grid gap-2">
							<div className="grid gap-1">
								<Label className="sr-only" htmlFor="email">
									Email
								</Label>
								<Input
									id="email"
									placeholder="name@example.com"
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									disabled={isLoading}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-1">
								<Label className="sr-only" htmlFor="password">
									Password
								</Label>
								<Input
									id="password"
									placeholder="Password"
									type="password"
									autoCapitalize="none"
									autoCorrect="off"
									disabled={isLoading}
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
							<Button type="submit" disabled={isLoading}>
								{isLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Sign In
							</Button>
						</div>
					</form>
					{error && (
						<div className="text-red-600 text-sm bg-yellow-900/20 p-3 text-center border-2 border-red-600 rounded-xl">
							{error}
						</div>
					)}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Button
							variant="outline"
							disabled={isLoading}
							onClick={() => handleSocialSignIn("google")}
						>
							<Image
								src="/google.svg"
								width={20}
								height={20}
								alt="Google"
							/>
							Google
						</Button>
						<Button
							variant="outline"
							disabled={isLoading}
							onClick={() => handleSocialSignIn("github")}
						>
							<Image
								src="/github.svg"
								width={25}
								height={25}
								alt="GitHub"
							/>
							GitHub
						</Button>
					</div>
				</div>
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/signup"
						className="hover:text-brand underline underline-offset-4"
					>
						Don&apos;t have an account? Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
