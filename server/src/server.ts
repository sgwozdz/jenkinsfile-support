'use strict';

import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	Hover,
	TextDocumentPositionParams,
} from 'vscode-languageserver';

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments = new TextDocuments();

connection.onInitialize((params: InitializeParams) => {
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			hoverProvider: true
		}
	};
});

connection.onHover(
	(_textDocumentPosition: TextDocumentPositionParams): Hover => {
		let document = documents.get(_textDocumentPosition.textDocument.uri);
		let offset = document.offsetAt(_textDocumentPosition.position);
		let text = document.getText();
		let word = getWordAt(text, offset);
		let docs = null;

		if (word === "stage"){
			docs = "this is stage";
		}
		if (word === "step"){
			docs = "this is step";
		}

		return {
			contents: {
				kind : "plaintext",
				language : "jenkinsfile",
				value : docs
			}
		};
});

function getWordAt (str, pos) {
    str = String(str);
    pos = Number(pos) >>> 0;

    var left = str.slice(0, pos + 1).search(/\w+$/),
        right = str.slice(pos).search(/\W/);

    if (right < 0) {
        return str.slice(left);
    }

    return str.slice(left, right + pos);
}

documents.listen(connection);
connection.listen();
