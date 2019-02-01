import { expect } from 'chai';
import * as extension from '../extension';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Client Tests", function () {
    test("getDebugOptions_ReturnsNoLazy", function () {
        const options = extension.getDebugOptions();
        expect(options.execArgv[0]).to.equal('--nolazy');
    });
    test("getDebugOptions_ReturnsInspect", function () {
        const options = extension.getDebugOptions();
        expect(options.execArgv[1]).to.equal('--inspect=6009');
    });
    test("getClientOptions_ReturnsSchemeFile", function () {
        const options = extension.getClientOptions();
        if (options.documentSelector) {
            var schemeValue = (options.documentSelector[0] as any).scheme;
        }
        expect(schemeValue).to.equal("file");
    });
    test("getClientOptions_ReturnsLanguageJenkinsFile", function () {
        const options = extension.getClientOptions();
        if (options.documentSelector) {
            var languageValue = (options.documentSelector[0] as any).language;
        }
        expect(languageValue).to.equal("jenkinsfile");
    });
    test("getServerOptions_ReturnsRunModuleWithCorrectValue", function () {
        var serverModule = "xyz";
        const options = extension.getServerOptions(serverModule);
        var runModuleValue = (options as any).run.module;

        expect(runModuleValue).to.equal(serverModule);
    });
    test("getServerOptions_ReturnsDebugModuleWithCorrectValue", function () {
        var serverModule = "xyz";
        const options = extension.getServerOptions(serverModule);
        var debugModuleValue = (options as any).debug.module;

        expect(debugModuleValue).to.equal(serverModule);
    });
    test("getServerOptions_ReturnsRunTransportWithCorrectValue", function () {
        const options = extension.getServerOptions("xyz");
        var runTransportValue = (options as any).run.transport;

        expect(runTransportValue).to.equal(1); //TransportKind.ipc
    });
    test("getServerOptions_ReturnsDebugTransportWithCorrectValue", function () {
        const options = extension.getServerOptions("xyz");
        var debugTransportValue = (options as any).debug.transport;

        expect(debugTransportValue).to.equal(1); //TransportKind.ipc
    });
});