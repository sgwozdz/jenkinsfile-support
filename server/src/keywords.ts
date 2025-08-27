import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';

export const keywords: CompletionItem[] = [
  // Boolean literals
  {
    label: 'true',
    detail: 'Boolean literal',
    kind: CompletionItemKind.Value,
  },
  {
    label: 'false',
    detail: 'Boolean literal',
    kind: CompletionItemKind.Value,
  },
  {
    label: 'null',
    detail: 'Null reference',
    kind: CompletionItemKind.Value,
  },

  // Control flow
  {
    label: 'if',
    detail: 'Conditional statement',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'else',
    detail: 'Alternative conditional branch',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'break',
    detail: 'Exit loop or switch',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'continue',
    detail: 'Skip to next loop iteration',
    kind: CompletionItemKind.Keyword,
  },

  // Loops
  {
    label: 'for',
    detail: 'For loop statement',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'while',
    detail: 'While loop statement',
    kind: CompletionItemKind.Keyword,
  },

  // Exception handling
  {
    label: 'try',
    detail: 'Exception handling block',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'catch',
    detail: 'Exception handler',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'finally',
    detail: 'Always executed block',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'throw',
    detail: 'Raise an exception',
    kind: CompletionItemKind.Keyword,
  },

  // Functions and methods
  {
    label: 'def',
    detail: 'Variable declaration',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'return',
    detail: 'Return from function',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'void',
    detail: 'Void return type',
    kind: CompletionItemKind.Keyword,
  },

  // Jenkins pipeline specific
  {
    label: 'pipeline',
    detail: 'Pipeline definition block',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'agent',
    detail: 'Specify where to execute',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'stages',
    detail: 'Define pipeline stages',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'stage',
    detail: 'Define a pipeline stage',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'steps',
    detail: 'Define stage execution steps',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'post',
    detail: 'Post-build actions',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'always',
    detail: 'Always execute regardless of build result',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'success',
    detail: 'Execute only on successful build',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'failure',
    detail: 'Execute only on failed build',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'unstable',
    detail: 'Execute only on unstable build',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'aborted',
    detail: 'Execute only on aborted build',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'cleanup',
    detail: 'Clean up after build',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'environment',
    detail: 'Define environment variables',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'options',
    detail: 'Pipeline options',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'parameters',
    detail: 'Define pipeline parameters',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'triggers',
    detail: 'Define build triggers',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'tools',
    detail: 'Define tools for the pipeline',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'when',
    detail: 'Conditional stage execution',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'parallel',
    detail: 'Execute steps in parallel',
    kind: CompletionItemKind.Keyword,
  },
  {
    label: 'input',
    detail: 'Wait for user input/approval',
    kind: CompletionItemKind.Keyword,
  },

  // Built-in functions
  {
    label: 'echo',
    detail: 'Print output to console',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'sh',
    detail: 'Execute shell command',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'timeout',
    detail: 'Set timeout for execution',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'retry',
    detail: 'Retry failed steps',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'sleep',
    detail: 'Pause execution for specified time',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'cron',
    detail: 'Schedule builds using cron syntax',
    kind: CompletionItemKind.Function,
  },
  {
    label: 'credentials',
    detail: 'Bind credentials to variables',
    kind: CompletionItemKind.Function,
  },

  // Environment and variables
  {
    label: 'env',
    detail: 'Environment variable reference',
    kind: CompletionItemKind.Variable,
  },
  {
    label: 'params',
    detail: 'Pipeline parameters reference',
    kind: CompletionItemKind.Variable,
  },
  {
    label: 'currentBuild',
    detail: 'Current build object reference',
    kind: CompletionItemKind.Variable,
  },
  {
    label: 'workspace',
    detail: 'Workspace directory path',
    kind: CompletionItemKind.Variable,
  },
];
