'use strict';

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	client = new LanguageClient(
		'lsp-client',
		'Jenkinsfile lsp client',
		getServerOptions(serverModule),
		getClientOptions()
	);

	client.start();
}

export function getDebugOptions() {
	return {
		execArgv: ['--nolazy', '--inspect=6009']
	};
}

export function getServerOptions(serverModule: string): ServerOptions {
	let debugOptions = getDebugOptions();

	return {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};
}

export function getClientOptions(): LanguageClientOptions {
	return {
		documentSelector: [{ scheme: 'file', language: 'jenkinsfile' }],
		synchronize: {
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
