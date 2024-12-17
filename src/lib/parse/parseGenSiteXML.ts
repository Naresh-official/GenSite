import { addFile } from "@/store/features/filesSlice";
import { IStep, StepType } from "@/types";
import { useDispatch } from "react-redux";

export function parseGenSiteArtifact(response: string): IStep[] {
	// Extract the artifact title
	const dispatch = useDispatch();
	const titleMatch = response.match(/title="([^"]*)"/);
	const artifactTitle = titleMatch ? titleMatch[1] : "Project Artifact";

	const steps: IStep[] = [];
	let stepId = 1;

	steps.push({
		id: stepId++,
		title: artifactTitle,
		description: "",
		type: StepType.CreateFolder,
		status: "pending",
	});

	const actionRegex =
		/<genSiteAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/genSiteAction>/g;

	let match;
	while ((match = actionRegex.exec(response)) !== null) {
		const [, actionType, filePath, content] = match;

		if (actionType === "file") {
			steps.push({
				id: stepId++,
				title: `Create ${filePath || "file"}`,
				description: "",
				type: StepType.CreateFile,
				status: "pending",
				code: content.trim(),
				path: filePath,
			});
		} else if (actionType === "shell") {
			steps.push({
				id: stepId++,
				title: "Run command",
				description: "",
				type: StepType.RunScript,
				status: "pending",
				code: content.trim(),
			});
		}
	}

	return steps;
}
