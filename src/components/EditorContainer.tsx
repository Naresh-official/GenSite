"use client";
import React from "react";
import { FileTree } from "@/components/FileTree";
import { CodeViewer } from "@/components/CodeViewer";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSelector } from "react-redux";

function EditorContainer() {
	const files = useSelector((state: any) => state.files.files);
	const [selectedFiles, setSelectedFiles] = React.useState<
		Array<{
			name: string;
			content: string;
			language: string;
		}>
	>([]);

	const handleFileSelect = (file: any) => {
		if (file.type === "file") {
			setSelectedFiles([
				{
					name: file.name,
					content: file.content || "",
					language: file.name.split(".").pop() || "txt",
				},
			]);
		}
	};
	return (
		<main className="h-full bg-background rounded-2xl">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={30} minSize={25}>
					<div className="h-full border-r">
						<div className="p-4 font-medium">Files</div>
						<FileTree
							data={files}
							onSelectFile={handleFileSelect}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={70} minSize={40}>
					<div className="h-full border-l">
						<div className="p-2 font-medium">Code</div>
						{selectedFiles.length > 0 ? (
							<CodeViewer files={selectedFiles} />
						) : (
							<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
								Select a file to view its contents
							</div>
						)}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</main>
	);
}

export default EditorContainer;
