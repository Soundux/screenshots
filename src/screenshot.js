const path = require('path');
const puppeteer = require('puppeteer');

const [width, height] = [1360, 795];
const output = { name: 'Discord', application: 'Discord' };

const start = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { height, width },
  });
  const page = await browser.newPage();

  // console output
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', error => {
    console.log(error.message);
  });
  page.on('requestfailed', request => {
    console.log(request.failure().errorText, request.url());
  });

  // mock backend functions
  await page.exposeFunction('isYoutubeDLAvailable', () => true);
  await page.exposeFunction('getSettings', () => {
    return {
      output: output.name,
      selectedTab: 0,
      allowOverlapping: true,
      darkTheme: true,
      stopHotkey: [],
      pushToTalkKeys: [],
      sortMode: 1,
      tabHotkeysOnly: false,
      launchPadMode: false,
      gridView: false,
      minimizeToTray: false,
      localVolume: 50,
      remoteVolume: 100,
      useAsDefaultDevice: false,
      muteDuringPlayback: false,
    };
  });
  await page.exposeFunction('changeSettings', () => {});
  await page.exposeFunction('isLinux', () => true);
  await page.exposeFunction('getTabs', () => {
    const tabs = [];
    for (let i = 1; i < 6; i++) {
      const tab = { id: i, name: `Tab ${i}`, sounds: [] };
      for (let j = 1; j < 20; j++) {
        tab.sounds.push({
          id: j,
          name: `Example Sound ${j}`,
          path: '',
          modifiedDate: 0,
          hotkeys: [],
          hotkeySequence: '',
        });
      }
      tabs.push(tab);
    }
    return tabs;
  });
  await page.exposeFunction('updateCheck', () => null);
  await page.exposeFunction('getPlayback', () => {
    return [{ name: 'Firefox' }, { name: 'Spotify' }];
  });
  // TODO: switch on connect modal screenshot?
  await page.exposeFunction('isSwitchOnConnectLoaded', () => false);
  await page.exposeFunction('unloadSwitchOnConnect', () => {});
  await page.exposeFunction('stopSounds', () => {});
  await page.exposeFunction('getOutputs', () => {
    return [output];
  });
  await page.exposeFunction('getHotkeySequence', () => '');
  await page.exposeFunction('getFavorites', () => []);
  await page.exposeFunction('playSound', id => {
    return {
      id,
      lengthInMs: 500,
      readInMs: 250,
      paused: false,
      repeat: false,
      sound: {
        id,
        name: `Example Sound ${id}`,
        path: '',
        modifiedDate: 0,
        hotkeys: [],
        hotkeySequence: '',
      },
    };
  });

  // load ui
  await page.goto(`file:${path.join(__dirname, '../dist/index.html')}`);

  // convenience functions
  const ss = async name => {
    console.debug(`Taking screenshot ${name}...`);
    await page.screenshot({
      path: `./screenshots/${name}.png`,
    });
  };

  const clickButton = async text => {
    const settingsButton = await page.waitForXPath(`//button[contains(span, '${text}')]`);
    await settingsButton.click();
  };

  const commit = async (action, ...args) => {
    await page.evaluate(
      (action, args) => {
        const { $store } = document.getElementById('app').__vue__;
        $store.commit(action, ...args);
      },
      action,
      args
    );
  };

  const ssThemed = async name => {
    await ss(`${name}-dark`);
    await commit('setDarkTheme', false);
    await ss(`${name}-light`);
    await commit('setDarkTheme', true);
  };

  // disable animations for screenshots
  await page.addStyleTag({
    content: `*,
*::after,
*::before {
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    animation-delay: -0.0001s !important;
    animation-duration: 0s !important;
    animation-play-state: paused !important;
    caret-color: transparent !important;
    color-adjust: exact !important;
    transition: none !important;
}`,
  });
  await page.waitForTimeout(1000);

  // screenshot home
  await ssThemed('home');

  // screenshot settings
  await clickButton('Settings');
  await ssThemed('settings');
  await page.keyboard.press('Escape');

  // screenshot help
  await clickButton('Help');
  await ssThemed('help');
  await page.keyboard.press('Escape');

  // screenshot search
  await clickButton('Search');
  const searchField = await page.waitForSelector('#searchField');
  await searchField.type('Example');
  await ssThemed('search');
  await page.keyboard.press('Escape');

  // screenshot playing sound
  await commit('addToCurrentlyPlaying', {
    id: 1,
    lengthInMs: 500,
    readInMs: 250,
    paused: false,
    repeat: false,
    sound: {
      id: 1,
      name: `Example Sound 1`,
      path: '',
      modifiedDate: 0,
      hotkeys: [],
      hotkeySequence: '',
    },
  });
  await ssThemed('playing');

  await page.close();
  await browser.close();
};

start()
  .then(() => console.log('Successfully generated screenshots'))
  .catch(error => console.error(error));
