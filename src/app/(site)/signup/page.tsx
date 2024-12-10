"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ZodError } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function SignUpPage() {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { data: sessionData } = useSession();

	const handleCredentialSignUp = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			if (sessionData && sessionData.user) {
				throw new Error("You are already signed in. Please sign out.");
			}
			const formdata = {
				name,
				email,
				password,
			};
			signUpSchema.parse(formdata);
			const { data } = await axios.post("/api/signup", formdata);
			if (data?.id) {
				setError(null);
				setIsLoading(false);
				setName("");
				setEmail("");
				setPassword("");
				router.push("/login");
			}
		} catch (error: unknown) {
			if (error instanceof ZodError) {
				console.log(error.errors);
				setError(error.errors[0].message);
			} else if (axios.isAxiosError(error)) {
				console.log(error.response?.data);
				setError(
					error.response?.data?.error || "An HTTP error occurred"
				);
			} else if (error instanceof Error) {
				console.log(error.message);
				setError(error.message || "Something went wrong");
			} else {
				console.log("Unknown error type", error);
				setError("An unknown error occurred");
			}
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
			if (error instanceof ZodError) {
				console.log(error.errors);
				setError(error.errors[0].message);
			} else if (axios.isAxiosError(error)) {
				console.log(error.response?.data);
				setError(
					error.response?.data?.error || "An HTTP error occurred"
				);
			} else if (error instanceof Error) {
				console.log(error.message);
				setError(error.message || "Something went wrong");
			} else {
				console.log("Unknown error type", error);
				setError("An unknown error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container flex flex-col h-screen w-screen items-center justify-center">
			<div className="mx-auto flex w-[90%] flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Create an account
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email below to create your account
					</p>
				</div>
				<div className="grid gap-6">
					<form onSubmit={handleCredentialSignUp}>
						<div className="grid gap-2">
							<div className="grid gap-1">
								<Label className="sr-only" htmlFor="name">
									Name
								</Label>
								<Input
									id="name"
									placeholder="John Doe"
									type="text"
									autoCapitalize="words"
									autoComplete="name"
									autoCorrect="off"
									disabled={isLoading}
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
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
							<Button disabled={isLoading}>
								{isLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Sign Up
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
								alt="Google"
								width={20}
								height={20}
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
								alt="GitHub"
								width={25}
								height={25}
							/>
							GitHub
						</Button>
					</div>
				</div>
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/login"
						className="hover:text-brand underline underline-offset-4"
					>
						Already have an account? Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
