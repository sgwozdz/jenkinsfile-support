import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  Hover,
  TextDocumentPositionParams,
  CompletionItem,
  Diagnostic,
  DiagnosticSeverity,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { keywords } from './keywords';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      hoverProvider: true,
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
});

connection.onHover(
  (_textDocumentPosition: TextDocumentPositionParams): Hover => {
    const document = documents.get(_textDocumentPosition.textDocument.uri);
    if (document === undefined) {
      return {
        contents: '',
      };
    }
    const offset = document.offsetAt(_textDocumentPosition.position);
    const text = document.getText();
    const word = getWordAt(text, offset);
    const desc = keywords.find(x => x.label === word);
    if (desc == null) {
      return {
        contents: '',
      };
    }
    //TODO: fix
    /*
    const markdown: MarkupContent = {
      kind: MarkupKind.Markdown,
      value: [
        `**Required:** ${desc.required}  `,
        `**Parameters:** ${desc.parameters}  `,
        `**Allowed:** ${desc.allowed}`,
      ].join('\r'),
    };
    */
    return {
      contents: 'test',
    };
  }
);

connection.onCompletion((): CompletionItem[] => {
  return keywords;
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  const keyword = keywords.find(x => x.label === item.label);
  if (keyword === undefined) {
    return item;
  }
  //TODO: fix
  /*
  item.documentation = `Allowed: ${keyword.allowed}`;
  item.detail = [
    `Required: ${keyword.required}  `,
    `Parameters: ${keyword.parameters}`,
  ].join('\r');
*/
  return item;
});

documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

function getWordAt(str: string, pos: number) {
  str = String(str);
  pos = Number(pos) >>> 0;

  const left = str.slice(0, pos + 1).search(/\w+$/),
    right = str.slice(pos).search(/\W/);

  if (right < 0) {
    return str.slice(left);
  }

  return str.slice(left, right + pos);
}

function getAllowOnceDiagnostics(
  allowOncePattern: RegExp,
  text: string,
  textDocument: TextDocument,
  diagnostics: Diagnostic[]
) {
  let n: RegExpExecArray | null = allowOncePattern.exec(text);
  while ((n = allowOncePattern.exec(text))) {
    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Error,
      range: {
        start: textDocument.positionAt(n.index),
        end: textDocument.positionAt(n.index + n[0].length),
      },
      message: `It is not allowed to use ${n[0]} more than once`,
    };
    diagnostics.push(diagnostic);
  }
}

function getBracketsDiagnostics(
  text: string,
  textDocument: TextDocument,
  diagnostics: Diagnostic[]
) {
  const stack = [];
  const openingBrackets = ['(', '{', '['];
  const closingBrackets = [')', '}', ']'];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (openingBrackets.indexOf(char) > -1) {
      stack.push({ char, i });
    }
    if (closingBrackets.indexOf(char) > -1) {
      const top = stack.pop();
      if (
        top === undefined ||
        !matches(top.char, char, openingBrackets, closingBrackets)
      ) {
        addDiagnostic(
          textDocument,
          i,
          i + char.length,
          'Brackets do not match',
          diagnostics
        );
      }
    }
  }

  for (let i = 0; i < stack.length; i++) {
    addDiagnostic(
      textDocument,
      stack[i].i,
      stack[i].i + stack[i].char.length,
      'Brackets do not match',
      diagnostics
    );
  }
}

function addDiagnostic(
  textDocument: TextDocument,
  start: number,
  end: number,
  message: string,
  diagnostics: Diagnostic[]
) {
  const diagnostic: Diagnostic = {
    severity: DiagnosticSeverity.Error,
    range: {
      start: textDocument.positionAt(start),
      end: textDocument.positionAt(end),
    },
    message: message,
  };
  diagnostics.push(diagnostic);
}

function matches(
  top: string | undefined,
  char: string,
  openingBrackets: string[],
  closingBrackets: string[]
) {
  for (let j = 0; j < openingBrackets.length; j++) {
    if (openingBrackets[j] === String(top) && closingBrackets[j] === char) {
      return true;
    }
  }
  return false;
}

function validateTextDocument(textDocument: TextDocument) {
  const diagnostics: Diagnostic[] = [];
  const text = textDocument.getText();
  const textWithoutComments = text.replace(
    /('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|("""[\s\S]*?""")|(\/\/.*)|(\/\*[\s\S]*?\*\/)/g,
    function (selection) {
      return new Array(selection.length + 1).join('~');
    }
  );

  getBracketsDiagnostics(textWithoutComments, textDocument, diagnostics);

  const allowOncePipelinesBlock = /pipeline(| ){/g;
  // let allowOnceStagesBlock = /stages(| ){/g;
  // let allowOnceOptionsBlock = /options(| ){/g;
  const allowOnceParametersBlock = /parameters(| ){/g;
  const allowOnceTriggersBlock = /triggers(| ){/g;

  getAllowOnceDiagnostics(
    allowOncePipelinesBlock,
    textWithoutComments,
    textDocument,
    diagnostics
  );
  // getAllowOnceDiagnostics(allowOnceStagesBlock, textWithoutComments, textDocument, diagnostics);
  // getAllowOnceDiagnostics(allowOnceOptionsBlock, textWithoutComments, textDocument, diagnostics);
  getAllowOnceDiagnostics(
    allowOnceParametersBlock,
    textWithoutComments,
    textDocument,
    diagnostics
  );
  getAllowOnceDiagnostics(
    allowOnceTriggersBlock,
    textWithoutComments,
    textDocument,
    diagnostics
  );

  // Send the computed diagnostics to VSCode.
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

documents.listen(connection);
connection.listen();
