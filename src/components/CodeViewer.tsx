"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeViewerProps {
	files: {
		name: string;
		content: string;
		language: string;
	}[];
}

export function CodeViewer({ files }: CodeViewerProps) {
	return (
		<Tabs defaultValue={files[0]?.name} className="w-full h-full">
			<TabsList className="w-full justify-start">
				{files.map((file) => (
					<TabsTrigger
						key={file.name}
						value={file.name}
						className="text-xs"
					>
						{file.name}
					</TabsTrigger>
				))}
			</TabsList>
			{files.map((file) => (
				<TabsContent
					key={file.name}
					value={file.name}
					className="mt-0 border-t p-4"
				>
					<pre className="overflow-auto text-sm">
						<code>{file.content}</code>
					</pre>
				</TabsContent>
			))}
		</Tabs>
	);
}
