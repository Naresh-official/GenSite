"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";

interface CodeViewerProps {
	files: {
		name: string;
		content: string;
		language: string;
	}[];
}

export function CodeViewer({ files }: CodeViewerProps) {
	const codeRef = useRef(null);
	const codeString = files[0].content;

	useEffect(() => {
		if (codeRef.current) {
			Prism.highlightElement(codeRef.current);
		}
	}, [codeString]);
	return (
		<div className="h-[93%]">
			<pre
				className={`overflow-auto text-sm text-white h-full language-${files[0].language}`}
			>
				<code ref={codeRef} style={{ color: "white" }}>
					{codeString}
				</code>
			</pre>
		</div>
	);
}
