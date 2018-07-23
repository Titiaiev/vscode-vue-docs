'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    class BrowserContentProvider {
        provideTextDocumentContent(uri, token) {
            var html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <style>
                    body, html
                    {
                        margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
                    }
                </style>
            </head>
            <body>
                <iframe width="100%" height="100%" src="${uri}" frameborder="0">
                    <p>can't display ${uri}</p>
                </iframe>
            </body>
            </html>
            `;
            return html;
        }
    }
    let provider = new BrowserContentProvider();
    let registrationHTTPS = vscode.workspace.registerTextDocumentContentProvider('https', provider);
    let disposable = vscode.commands.registerCommand('extension.openVueDocs', () => {
        //Version Options
        let opts = ['Vue', 'Vuex', 'Vue Router', 'Vue SSR', 'Node'];
        vscode.window.showQuickPick(opts).then((choicedOpt) => {
            const getUri = (link) => {
                let uri = '';

                switch (link) {
                    case 'Vue':
                        uri = 'https://ru.vuejs.org/v2/guide/';
                        break;
                    case 'Vuex':
                        uri = 'https://vuex.vuejs.org/ru/';
                        break;
                    case 'Vue Router':
                        uri = 'https://router.vuejs.org/ru/';
                        break;
                    case 'Vue SSR':
                        uri = 'https://ssr.vuejs.org/ru/';
                        break;
                    case 'Node':
                        uri = "https://nodejs.org/docs/latest-v8.x/api/"
                        break;
                    default:
                        uri = 'https://ru.vuejs.org/v2/guide/';
                        break;
                }
                console.log('Выбран пункт: ', link);
                console.log('uri: ', uri);
                return uri;
            };

            let uri = vscode.Uri.parse(getUri(choicedOpt));
            console.log(uri);
            // Determine column to place browser in.
            let col;
            let ae = vscode.window.activeTextEditor;
            if (ae != undefined) {
                col = ae.viewColumn || vscode.ViewColumn.One;
            }
            else {
                col = vscode.ViewColumn.One;
            }
            // show nodejs docs
            return vscode.commands.executeCommand('vscode.previewHtml', uri, col).then((success) => {
            }, (reason) => {
                vscode.window.showErrorMessage(reason);
            });
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;