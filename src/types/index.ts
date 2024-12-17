export enum StepType {
	CreateFile,
	CreateFolder,
	EditFile,
	DeleteFile,
	RunScript,
}

export interface IStep {
	id: number;
	title: string;
	description: string;
	type: StepType;
	status: "pending" | "in-progress" | "completed" | "failed";
	code?: string;
	path?: string;
}

export interface IFile {
	name: string;
	type: "file" | "folder";
	content?: string;
	children?: IFile[];
}
