'use strict';

import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	Hover,
	TextDocumentPositionParams,
	MarkupKind,
	MarkupContent,
	CompletionItem,
	CompletionItemKind,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity
} from 'vscode-languageserver';

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments = new TextDocuments();
const keywords: { [name: string]: { required: string, parameters: string, allowed: string } } = {
	agent: {
		required: 'Yes',
		parameters: 'any|none|label||node|docker|dockerfile',
		allowed: 'In the top-level pipeline block and each stage block.'
	},
	post: {
		required: 'No',
		parameters: 'None',
		allowed: 'In the top-level pipeline block and each stage block.'
	},
	stages: {
		required: 'Yes',
		parameters: 'None',
		allowed: 'Only once, inside the pipeline block.'
	},
	steps: {
		required: 'Yes',
		parameters: 'None',
		allowed: 'Inside each stage block.'
	},
	environment: {
		required: 'No',
		parameters: 'None',
		allowed: 'Inside the pipeline block, or within stage directives.'
	},
	options: {
		required: 'No',
		parameters: 'None',
		allowed: 'Only once, inside the pipeline block.'
	},
	parameters: {
		required: 'No',
		parameters: 'None',
		allowed: 'Only once, inside the pipeline block.'
	},
	triggers: {
		required: 'No',
		parameters: 'None',
		allowed: 'Only once, inside the pipeline block.'
	},
	stage: {
		required: 'At least one',
		parameters: 'One mandatory parameter, a string for the name of the stage.',
		allowed: 'Inside the stages section.'
	},
	tools: {
		required: 'No',
		parameters: 'None',
		allowed: 'Inside the pipeline block or a stage block.'
	},
	when: {
		required: 'No',
		parameters: 'None',
		allowed: 'Inside a stage directive'
	}

};

connection.onInitialize(() => {
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			hoverProvider: true,
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});

connection.onHover(
	(_textDocumentPosition: TextDocumentPositionParams): Hover => {
		let document = documents.get(_textDocumentPosition.textDocument.uri);
		if (document === undefined) {
			return {
				contents: ""
			};
		}
		let offset = document.offsetAt(_textDocumentPosition.position);
		let text = document.getText();
		let word = getWordAt(text, offset);
		let desc = keywords[word];
		if (desc == null) {
			return {
				contents: ""
			};
		}
		let markdown: MarkupContent = {
			kind: MarkupKind.Markdown,
			value: [`**Required:** ${desc.required}  `,
			`**Parameters:** ${desc.parameters}  `,
			`**Allowed:** ${desc.allowed}`]
				.join('\r')
		};
		return {
			contents: markdown
		};
	});

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		let list : CompletionItem[] = [];

		for(let keyword in keywords){
			list.push({
				label: keyword,
				kind: CompletionItemKind.Keyword
			})
		}

		return list;
	}
);

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		let keyword = keywords[item.label];
		item.documentation = `Allowed: ${keyword.allowed}`;
		item.detail = [`Required: ${ keyword.required}  `,
		`Parameters: ${keyword.parameters}`]
			.join('\r')

		return item;
	}
);

documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

function getWordAt(str: string, pos: number) {
	str = String(str);
	pos = Number(pos) >>> 0;

	var left = str.slice(0, pos + 1).search(/\w+$/),
		right = str.slice(pos).search(/\W/);

	if (right < 0) {
		return str.slice(left);
	}

	return str.slice(left, right + pos);
}

function validateTextDocument(textDocument: TextDocument) {
	let text = textDocument.getText();

	//TODO: apply custom patterns
	let pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let diagnostics: Diagnostic[] = [];
	while ((m = pattern.exec(text))) {
		let diagnosic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length)
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex'
		};
			diagnosic.relatedInformation = [
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Spelling matters'
				},
				{
					location: {
						uri: textDocument.uri,
						range: Object.assign({}, diagnosic.range)
					},
					message: 'Particularly for names'
				}
			];
		diagnostics.push(diagnosic);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

documents.listen(connection);
connection.listen();
