import { IFile } from "@/types";

export function parseFiles(response: string): IFile[] {
	const fileRegex =
		/<genSiteAction\s+type="file"\s+filePath="([^"]*)">([\s\S]*?)<\/genSiteAction>/g;

	let match;
	const fileTree: IFile[] = [];

	while ((match = fileRegex.exec(response)) !== null) {
		const [, filePath, content] = match;

		const pathParts = filePath.split("/");
		let currentNode = fileTree;

		// Traverse or create nodes in the file tree
		for (let i = 0; i < pathParts.length; i++) {
			const part = pathParts[i];
			let existingNode = currentNode.find((node) => node.name === part);

			if (!existingNode) {
				if (i === pathParts.length - 1) {
					// Last part: create a file node
					existingNode = {
						name: part,
						type: "file",
						content: content.trim(),
					};
				} else {
					// Intermediate part: create a folder node
					existingNode = {
						name: part,
						type: "folder",
						children: [],
					};
				}
				currentNode.push(existingNode);
			}

			// Traverse to the next level
			if (existingNode.type === "folder") {
				currentNode = existingNode.children!;
			}
		}
	}

	return fileTree;
}
