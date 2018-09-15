Object.defineProperty(exports, '__esModule', {
  value: true,
});
// eslint-disable-next-line
const vscode = require('vscode'); // подключаем библиотеку vscode
const customLinksObject = vscode.workspace.getConfiguration().vueDocs.links;

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
  /* eslint "no-nested-ternary": 0 */
  const interfaceLang = vscode.env.language.includes('ru')
    ? 'ru'
    : vscode.env.language.includes('en')
      ? 'en'
      : vscode.env.language.includes('zh')
        ? 'zh'
        : null;

  // console.log(interfaceLang);
  if (configLang !== '') {
    return configLang;
  }
  // @ts-ignore
  if (supportedLangs.includes(interfaceLang)) {
    return interfaceLang;
  }
  return 'en';
};

const getURIof = (item = '', lang = 'en') => {
  if (typeof customLinksObject[item] === 'string') {
    // console.log(customLinksObject[item]);
    return String(customLinksObject[item]);
  }

  const URIof = {
    Vue: {
      en: 'https://vuejs.org/v2/guide/',
      ru: 'https://ru.vuejs.org/v2/guide/',
      zh: 'https://cn.vuejs.org/v2/guide/',
    },
    Vuex: {
      en: 'https://vuex.vuejs.org/en/',
      ru: 'https://vuex.vuejs.org/ru/',
      zh: 'https://vuex.vuejs.org/zh/',
    },
    'Vue Router': {
      en: 'https://router.vuejs.org/en/',
      ru: 'https://router.vuejs.org/ru/',
      zh: 'https://router.vuejs.org/zh/',
    },
    'Vue SSR': {
      en: 'https://ssr.vuejs.org/en/',
      ru: 'https://ssr.vuejs.org/ru/',
      zh: 'https://ssr.vuejs.org/zh/',
    },
    'Nuxt.js': {
      en: 'https://nuxtjs.org/guide',
      ru: 'https://ru.nuxtjs.org/guide',
      zh: 'https://zh.nuxtjs.org/guide',
    },
    VuePress: {
      en: 'https://vuepress.vuejs.org/guide/',
      ru: 'https://vuepress-lrouuhpdsl.now.sh/ru/guide/', // FIXME: когда выйдет перевод на оф сайте
      zh: 'https://vuepress.vuejs.org/zh/guide/',
    },
  };

  // TODO: delete logs
  // console.log('Выбран пункт: ', item);
  // console.log('URIof: ', URIof);
  // console.log('URIof[item][lang]: ', URIof[item][lang]);
  // console.log("язык интерфейса vs code: ", vscode.env.language);
  // console.log('lang: ', lang);
  // console.log('язык в настройках: ', vscode.workspace.getConfiguration().vueDocs.lang);
  return String(URIof[item][lang]);
};

// активация расширения
const activate = (context) => {
  const openVueDocs = vscode.commands.registerCommand('extension.openVueDocs', () => {
    const customMenuItems = Object.getOwnPropertyNames(customLinksObject);

    const defaultMenuItems = ['Vue', 'Vuex', 'Vue Router', 'Vue SSR', 'Nuxt.js', 'VuePress']; // возможные опции
    const menuItems = [].concat(defaultMenuItems, customMenuItems);
    // console.log(menuItems);

    // выбор опции из выпадающего списка
    vscode.window.showQuickPick(menuItems).then((selectedMenuItem) => {
      if (selectedMenuItem) {
        // если опция выбрана - работаем, (возможна ситуация когда пользователь кликнул мимо и selectedMenuItem === undefined)

        // подготавливаем веб-вью панель
        const panel = vscode.window.createWebviewPanel(
          'webDocs',
          selectedMenuItem,
          vscode.ViewColumn.One,
          {
            // разрешить загруженным сайтам использовать свои скрипты (потенциально опасно)
            // https://code.visualstudio.com/docs/extensions/webview#_scripts-and-message-passing
            enableScripts: true,

            // лучше использовать сохранение состояния
            // https://code.visualstudio.com/docs/extensions/webview#_persistence
            retainContextWhenHidden: true,
          }
        );

        const lang = getLang();
        // получаем URI соответствующий выбранному пункту меню
        const selectedURI = getURIof(selectedMenuItem, lang);
        panel.webview.html = getWebviewContent(selectedURI); // показываем ранее определённый шаблон с полученым URI
      }
    });
  });

  context.subscriptions.push(openVueDocs);
};

exports.activate = activate;
