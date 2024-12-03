"use client";

import React, { useState } from "react";

const ChatPage = () => {
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const fetchChatResponse = async () => {
		setIsLoading(true);
		setResponse(""); // Clear previous response

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

			if (!res.body) throw new Error("No response body from server.");

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let fullResponse = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				fullResponse += chunk;
				setResponse((prev) => prev + chunk); // Update the response state incrementally
			}

			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching chat response:", error);
			setIsLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Chat with Gemini AI</h1>
			<textarea
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				rows={5}
				cols={50}
				placeholder="Type your prompt here..."
			/>
			<button onClick={fetchChatResponse} disabled={isLoading}>
				{isLoading ? "Fetching..." : "Submit"}
			</button>
			<div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
				<strong>Response:</strong>
				<p>{response}</p>
			</div>
		</div>
	);
};

export default ChatPage;
