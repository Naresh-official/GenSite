import { IFile } from "@/types";

export function parseFiles(
	response: string,
	existingTree: IFile[] = []
): IFile[] {
	const fileRegex =
		/<genSiteAction\s+type="file"\s+filePath="([^"]*)">([\s\S]*?)<\/genSiteAction>/g;
	const fileTree = JSON.parse(JSON.stringify(existingTree));

	let match;
	while ((match = fileRegex.exec(response)) !== null) {
		const [, filePath, content] = match;

		const pathParts = filePath.split("/");
		let currentNode = fileTree;

		for (let i = 0; i < pathParts.length; i++) {
			const part = pathParts[i];
			let existingNode = currentNode.find(
				(node: IFile) => node.name === part
			);

			if (!existingNode) {
				// Create a new node if it doesn't exist
				if (i === pathParts.length - 1) {
					existingNode = {
						name: part,
						type: "file",
						content: content.trim(),
					};
				} else {
					existingNode = {
						name: part,
						type: "folder",
						children: [],
					};
				}
				currentNode.push(existingNode);
			} else if (
				i === pathParts.length - 1 &&
				existingNode.type === "file"
			) {
				existingNode.content = content.trim();
			}

			if (existingNode.type === "folder") {
				currentNode = existingNode.children!;
			}
		}
	}
	return fileTree;
}
