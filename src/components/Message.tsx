"use client";
import { parseFiles } from "@/lib/parse/parseFiles";
import { parseGenSiteArtifact } from "@/lib/parse/parseGenSiteXML";
import { setFiles } from "@/store/features/filesSlice";
import { IStep } from "@/types";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function Message({
	message,
}: {
	message: {
		id: string;
		content: string;
		role: "USER" | "MODEL";
		createdAt: string;
	};
}) {
	const dispatch = useDispatch();
	const fileTree = useSelector((state: any) => state.files.files);
	const steps: IStep[] = parseGenSiteArtifact(message.content);
	const didRun = useRef(false);
	useEffect(() => {
		if (didRun.current) return;
		didRun.current = true;
		if (message.role === "MODEL") {
			const files = parseFiles(message.content, [...fileTree]);
			dispatch(setFiles(files));
		}
	}, [message, dispatch]);
	return (
		<div
			className={`p-4 rounded-xl text-sm ${
				message.role === "USER"
					? "w-[70%] self-end bg-zinc-900"
					: "px-12 mb-10"
			}`}
		>
			<div className="flex items-center justify-start">
				<span className="text-sm font-medium text-muted-foreground bg-zinc-700 px-4 py-1 rounded-full">
					{message.role === "USER" ? "You" : "GenSite"}
				</span>
			</div>
			{message.role === "MODEL" ? (
				<div className="mt-2 text-xs text-muted-foreground font-medium bg-zinc-900/20 px-4 py-2 rounded-xl">
					{steps.map((step) => (
						<div key={step.id}>
							<div>
								<p
									className={`${
										step.id == 1
											? "my-2 text-xl text-white"
											: ""
									}`}
								>
									{step.title}
								</p>
								<p>{step.code}</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div id={message.id} className="mt-2">
					{message.content}
				</div>
			)}
		</div>
	);
}

export default Message;
