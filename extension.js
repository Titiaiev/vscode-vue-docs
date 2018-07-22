'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});
const vscode = require("vscode");

function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.openVueDocs', () => {
    let opts = ['Vue', 'Vuex', 'Vue Router', 'Vue SSR', 'Node'];

    vscode.window.showQuickPick(opts).then((choicedOption) => {
      const getUriFor = (link) => {
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
        // TODO: delete logs 
        // console.log('Выбран пункт: ', link);
        // console.log('uri: ', uri);
        return uri;
      };
      const choicedUri = getUriFor(choicedOption);
      const panel = vscode.window.createWebviewPanel('webDocs', choicedOption, vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true
      });
      panel.webview.html = getWebviewContent(choicedUri);

    });
  }));
}

exports.activate = activate;


function getWebviewContent(uri) {
  let html = `
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