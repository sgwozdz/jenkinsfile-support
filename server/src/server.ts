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
const simpleKeywords =  ['true', 'false', 'env', 'if', 'else', 'try', 'catch', 'finally', 'throw', 'echo', 'always',
'changed','fixed','regression','aborted','failure','success','unstable','unsuccessful','cleanup', 'step', 'matrix', 'parallel'];
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
		let list: CompletionItem[] = [];

		for (let keyword of simpleKeywords) {
			list.push({
				label: keyword,
				kind: CompletionItemKind.Keyword
			})
		}

		for (let keyword in keywords) {
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
		if (keyword === undefined) {
			return item;
		}

		item.documentation = `Allowed: ${keyword.allowed}`;
		item.detail = [`Required: ${keyword.required}  `,
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

function getAllowOnceDiagnostics(allowOncePattern: RegExp, text: string, textDocument: TextDocument, diagnostics: Diagnostic[]) {
	let n: RegExpExecArray | null = allowOncePattern.exec(text);
	while (n = allowOncePattern.exec(text)) {
		let diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: textDocument.positionAt(n.index),
				end: textDocument.positionAt(n.index + n[0].length)
			},
			message: `It is not allowed to use ${n[0]} more than once`
		};
		diagnostics.push(diagnostic);
	}
}

function getBracketsDiagnostics(text: string, textDocument: TextDocument, diagnostics: Diagnostic[]) {
	var stack = [];
	var openingBrackets = ['(', '{', '['];
	var closingBrackets = [')', '}', ']'];

	for (let i = 0; i < text.length; i++) {
		var char = text[i];
		if (openingBrackets.indexOf(char) > -1) {
			stack.push({char, i});
		}
		if (closingBrackets.indexOf(char) > -1) {
			var top = stack.pop();
			if (top === undefined || !matches(top.char, char, openingBrackets, closingBrackets)) {
				addDiagnostic(textDocument, i, i + char.length, "Brackets do not match", diagnostics);
			}
		}
	}

	for (let i = 0; i < stack.length; i++) {
		addDiagnostic(textDocument, stack[i].i, stack[i].i + stack[i].char.length, "Brackets do not match", diagnostics);
	}
}

function addDiagnostic(textDocument: TextDocument, start: number, end: number, message: string, diagnostics: Diagnostic[]) {
	let diagnostic: Diagnostic = {
		severity: DiagnosticSeverity.Error,
		range: {
			start: textDocument.positionAt(start),
			end: textDocument.positionAt(end)
		},
		message: message
	};
	diagnostics.push(diagnostic);
}

function matches(top: string | undefined, char: string, openingBrackets: string[], closingBrackets: string[]) {
	for (let j = 0; j < openingBrackets.length; j++) {
		if (openingBrackets[j] === String(top) &&
			closingBrackets[j] === char) {
			return true;
		}
	}
	return false;
}

function validateTextDocument(textDocument: TextDocument) {
	let diagnostics: Diagnostic[] = [];
	let text = textDocument.getText();
	var textWithoutComments = text.replace(/(".*")|(\/\/.*)|(\/\*[^*]*(\*\/|$))/g, function (selection) {
		return new Array(selection.length + 1).join("~");
	});
	
	getBracketsDiagnostics(textWithoutComments, textDocument, diagnostics);

	let allowOncePipelinesBlock = /pipeline(| ){/g;
	// let allowOnceStagesBlock = /stages(| ){/g;
	let allowOnceOptionsBlock = /options(| ){/g;
	let allowOnceParametersBlock = /parameters(| ){/g;
	let allowOnceTriggersBlock = /triggers(| ){/g;
  
	getAllowOnceDiagnostics(allowOncePipelinesBlock, textWithoutComments, textDocument, diagnostics);
	// getAllowOnceDiagnostics(allowOnceStagesBlock, textWithoutComments, textDocument, diagnostics);
	getAllowOnceDiagnostics(allowOnceOptionsBlock, textWithoutComments, textDocument, diagnostics);
	getAllowOnceDiagnostics(allowOnceParametersBlock, textWithoutComments, textDocument, diagnostics);
	getAllowOnceDiagnostics(allowOnceTriggersBlock, textWithoutComments, textDocument, diagnostics);

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

documents.listen(connection);
connection.listen();
