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

const getLang = () => {
  const supportedLangs = ['ru', 'en', 'zh'];
  const configLang = vscode.workspace.getConfiguration().vueDocs.lang;
  const interfaceLang = (vscode.env.language.includes('ru')) ? 'ru' : 
                          (vscode.env.language.includes('en')) ? 'en' :
                            (vscode.env.language.includes('zh')) ? 'zh' : null;

  // console.log(interfaceLang);
  if(configLang !== '') { return configLang; }
  if(supportedLangs.includes(interfaceLang)) { return interfaceLang }
  return 'en';
};

const getURI_of = (item = '', lang = 'en') => {
  let URI_of = {
    ['Vue']: (lang !== 'en') ? ((lang === 'zh') ? 'https://cn.vuejs.org/v2/guide/' : `https://${lang}.vuejs.org/v2/guide/`) : 'https://vuejs.org/v2/guide/',// в англ версии к домену ничего не нужно добавлять
    ['Vuex']: `https://vuex.vuejs.org/${lang}`,
    ['Vue Router']: `https://router.vuejs.org/${lang}`,
    ['Vue SSR']: `https://ssr.vuejs.org/${lang}`,
    ['Vuetify']: 'https://vuetifyjs.com/getting-started/quick-start',
    ['Nuxt.js']: (lang !== 'en') ? `https://${lang}.nuxtjs.org/guide` : 'https://nuxtjs.org/guide'
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
  const openVueDocs = vscode.commands.registerCommand('extension.openVueDocs', () => {
    let menuItems = ['Vue', 'Vuex', 'Vue Router', 'Vue SSR', 'Vuetify', 'Nuxt.js']; // возможные опции

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

        const lang = getLang();
        // получаем URI соответствующий выбранному пункту меню
        const selectedURI = getURI_of(selectedMenuItem, lang);
        panel.webview.html = getWebviewContent(selectedURI); // показываем ранее определённый шаблон с полученым URI
      }
    });
  });

  context.subscriptions.push(openVueDocs);
};

exports.activate = activate;
