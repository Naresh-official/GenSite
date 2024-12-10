"use client";

import * as React from "react";
import {
	ChevronDown,
	ChevronRight,
	Folder,
	FileCode,
	File,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FileNode = {
	name: string;
	type: "file" | "folder";
	children?: FileNode[];
	content?: string;
};

interface FileTreeProps {
	data: FileNode[];
	onSelectFile?: (file: FileNode) => void;
}

export function FileTree({ data, onSelectFile }: FileTreeProps) {
	return (
		<div className="w-full overflow-auto h-full">
			<TreeNode nodes={data} level={0} onSelectFile={onSelectFile} />
		</div>
	);
}

interface TreeNodeProps {
	nodes: FileNode[];
	level: number;
	onSelectFile?: (file: FileNode) => void;
}

function TreeNode({ nodes, level, onSelectFile }: TreeNodeProps) {
	const [expandedFolders, setExpandedFolders] = React.useState<
		Record<string, boolean>
	>({});

	const toggleFolder = (folderName: string) => {
		setExpandedFolders((prev) => ({
			...prev,
			[folderName]: !prev[folderName],
		}));
	};

	return (
		<ul className="select-none ">
			{nodes.map((node, index) => (
				<li key={`${node.name}-${index}`} className="relative">
					<div
						className={cn(
							"flex items-center gap-2 px-2 py-1 hover:bg-muted/50",
							node.type === "file" && "cursor-pointer"
						)}
						style={{ paddingLeft: `${level * 12 + 8}px` }}
						onClick={() => {
							if (node.type === "folder") {
								toggleFolder(node.name);
							} else if (onSelectFile) {
								onSelectFile(node);
							}
						}}
					>
						{node.type === "folder" &&
							(expandedFolders[node.name] ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							))}
						{node.type === "folder" && (
							<Folder className="h-4 w-4 text-muted-foreground" />
						)}
						{node.type === "file" &&
							(node.name.endsWith(".tsx") ||
							node.name.endsWith(".jsx") ? (
								<FileCode className="h-4 w-4 text-muted-foreground" />
							) : (
								<File className="h-4 w-4 text-muted-foreground" />
							))}
						<span className="text-sm">{node.name}</span>
					</div>
					{node.type === "folder" &&
						node.children &&
						expandedFolders[node.name] && (
							<TreeNode
								nodes={node.children}
								level={level + 1}
								onSelectFile={onSelectFile}
							/>
						)}
				</li>
			))}
		</ul>
	);
}
