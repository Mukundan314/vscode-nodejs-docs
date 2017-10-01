'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    class BrowserContentProvider implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
            var html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body, html
                    {
                        margin: 0; padding: 0; height: 100%; overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <iframe width="100%" height="100%" src="${uri}" frameborder="0">
                    <p>can't display ${uri}</p>
                </iframe>
            </body>
            </html>
            `
            return html;
        }
    }

    let provider = new BrowserContentProvider();
    let registrationHTTPS = vscode.workspace.registerTextDocumentContentProvider('https', provider);

    let disposable = vscode.commands.registerCommand('extension.openNodejsDocs', () => {
        //Version Options
        let opts = ['8.x', '6.x', '5.x', '4.x', '0.12.x', '0.10.x']
        vscode.window.showQuickPick(opts).then(
            (version) => {
                let uri = vscode.Uri.parse("https://nodejs.org/docs/latest-v" + version + "/api/");

                // Determine column to place browser in.
                let col: vscode.ViewColumn;
                let ae = vscode.window.activeTextEditor;
                if (ae != undefined) {
                    col = ae.viewColumn || vscode.ViewColumn.One;
                } else {
                    col = vscode.ViewColumn.One;
                }

                // show nodejs docs
                return vscode.commands.executeCommand('vscode.previewHtml', uri, col).then((success) => {
                }, (reason) => {
                    vscode.window.showErrorMessage(reason);
                }
                );
            }
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
