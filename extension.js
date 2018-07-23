'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});
const vscode = require("vscode"); // подключаем библиотеку vscode

// шаблон для веб-отображения
const getWebviewContent = (uri) => {
  const html = `
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
};

const getURI_of = (item = '') => {

  const lang = (vscode.workspace.getConfiguration().vueDocs.lang) 
  ? vscode.workspace.getConfiguration().vueDocs.lang : (vscode.env.language.includes('ru')) 
                                                                        ? 'ru' : '';
                                                                        
  let URI_of = {
    ['Vue']: (lang !== 'en') ? `https://${lang}.vuejs.org/v2/guide/` : 'https://vuejs.org/v2/guide/',// в англ версии к домену ничего не нужно добавлять
    ['Vuex']: `https://vuex.vuejs.org/${lang}`,
    ['Vue Router']: `https://router.vuejs.org/${lang}`,
    ['Vue SSR']: `https://ssr.vuejs.org/${lang}`,
    ['Vuetify']: 'https://vuetifyjs.com/getting-started/quick-start'
  };

  // TODO: delete logs 
  // console.log('Выбран пункт: ', item);
  // console.log('URI_of: ', URI_of);
  // console.log('URI_of[item]: ', URI_of[item]);
  // console.log("язык интерфейса vs code: ", vscode.env.language);
  // console.log('lang: ', lang);
  // console.log('язык в настройках: ', vscode.workspace.getConfiguration().vueDocs.lang);
  return String(URI_of[item]);
};

// активация расширения
const activate = (context) => {
  context.subscriptions.push(vscode.commands.registerCommand('extension.openVueDocs', () => {
    let menuItems = ['Vue', 'Vuex', 'Vue Router', 'Vue SSR', 'Vuetify']; // возможные опции

    // выбор опции из выпадающего списка
    vscode.window.showQuickPick(menuItems).then((selectedMenuItem) => {
      if(selectedMenuItem) { // если опция выбрана - работаем, (возможна ситуация когда пользователь кликнул мимо и selectedMenuItem === undefined)

        // подготавливаем веб-вью панель
        const panel = vscode.window.createWebviewPanel('webDocs', selectedMenuItem, vscode.ViewColumn.One, {

          // разрешить загруженным сайтам использовать свои скрипты (потенциально опасно)
          // https://code.visualstudio.com/docs/extensions/webview#_scripts-and-message-passing
          enableScripts: true,
          
          // лучше использовать сохранение состояния
          // https://code.visualstudio.com/docs/extensions/webview#_persistence
          retainContextWhenHidden: true
        });

        // получаем URI соответствующий выбранному пункту меню
        const selectedURI = getURI_of(selectedMenuItem);
        panel.webview.html = getWebviewContent(selectedURI); // показываем ранее определённый шаблон с полученым URI
      }
    });
  }));
};

exports.activate = activate;
