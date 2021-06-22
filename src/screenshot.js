import puppeteer from 'puppeteer';
import { markdownTable } from 'markdown-table';
import { dirname, join } from 'path';
import { writeFile, readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const [width, height] = [1360, 795];
const output = {
  application: 'DiscordCanary',
  appIcon:
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABNtJREFUWIWtl11sVFUQgL+5u3tZSMvSPwgVYUPaEksDRSCGPzWFoKUS8QFSTUiMIb6R+CYk+KIkakw0kUej8YEoiH9oKQloiQYBY5AqUuK2CQvyE9sulLbQ7f7c8eFuu/fu3ls2lUkm956ZOTNzZs6ZM0coEdLHN0eANqAFaAaJAnNy7CHQONANdAHHQq0n7paiVx4kkOrcVC8ie4F2IFyiv0ngEPBOqPVkbFoOpDo3zgT2C7IbCJZoeBLUVp4BDgD7Qlt+GCvZgVRnS73AN0BjgcLJ7wStUIkXDegBtoW2dPU90IH0sadXKHJCoMqp0DnB6Uwh3am0gJ8ANofaTl3wdSDV8VSdCGdVbeOekLMkAurliVM0x9P83IQoa0PP/dRb5ECq48mZwG8CjT76Hhb0oKw2t/48BmBMklX3o9qoatlL88RC3lSyvvKNoG+5IpD6bl0Dwl9MsdvFrEDmrUMql6M3f8QaOOfiG3PXILUtaOIPtP8MOn57qihkgKXm1l96cwZ1D+ptXEJlGM37kLlrRYyALV2zCiOZUELlgArpUQhXI+FqWNCKWlm0/6xa3W+i6XteaoPAXuAVSR19IoLILXyKTGDZ6xiLtj2wYHmBFf9asxff82MngfkG0IZq2CuHUhZFFm6dlnEAWfS8SFnUb4+EUW0zUKvF3hwOxEajbicigenaRySAUbczr9P5tbHFAG22T6oDVZFgGVK7cdqrn3SidpMQKs8VDc1/bWw2UCvqPib20ZF565HADJcyTQ5qtu+gWoO/F5UKK9GtVt9B1eSA24GAiTFvHUVRtjEaBJ1TXMoUqV7lpqhF9vSr6GgcxEA2fKpS2SQAeueSZk/vArWQ+Fca2PilOFMnNavgnw6vAM0x/IqIRBrcoskB1ZErNt/KYiXO550bPA9WFlTRkTgkB10rktkNvsXKAGtoYtO5cNZ8d/7DNSLlUZsnIFUr8waqV+YKv4WULYRwjXvurPniaQNrKIhqHKgsCk6o3DUUMQis/wjr+nGkogkjF34AqVgqgQ2fKLcvIo8+KyJGsS71vGHiQbAuAI97cQtBwtUSqNvpyTOqmoWqZp+Zir3iInK3geopz/yM9btlR66ode171cyY72WpmXtqXT2qOnrNzRjrV08baJekjjwWAS0uxTPnEli+F+ORZ8TOr33Usmd3I+WLkdl1MCOXufHb6HAfOhonuOYAUrnMPh2q6PVOzf75LowNFPYOY0Bt0Nx++W7qyJJDwMtur/8le+41rIomNZbssovS/ZuQHECTA+jAr95RuH8LIktUb5zEin2MDl12htwJh83tf9+1r+MvGuqBS7iuY2f3B5gR0CykR4t5TvlQmT1MjxTIuLrJDEiTuSMWMwDMHbFesD50HxHFNU7dgfSwN89JSw/n5AplnGM9YO6IxcDdEb2Bas/UHc5DwR7QfRNm3U3p4cX1oGdgiqa0FPDKkA0JlDVm+5XJ9rxIbPxQdIXAif/thJdx2Gy2x/3b8rwTi+oE/Ral0fc1UqhFPf7zAj0IL5jtV3sLOUYhAWBG+9U+VVaDfoBqZvIed9/leVSffzQD+r6iq72M+0bACanPFzSoskfQ3OPU7yXiCoP9OBXeNl+87mm4ZAcmYPyz2oi4nudEcT3PiQPdIF1Ah/nSjeFS9P4HpTPX9LwQ4pMAAAAASUVORK5CYII=',
};

try {
  const browser = await puppeteer.launch({
    defaultViewport: { height, width },
  });
  const page = await browser.newPage();

  // console output
  page.on('console', msg => console.log('console:', msg.text()));
  page.on('pageerror', error => {
    console.error('pageerror:', error);
  });
  page.on('requestfailed', request => {
    console.error('requestfailed:', request.failure().errorText, request.url());
  });

  // mock backend functions
  await page.exposeFunction('isYoutubeDLAvailable', () => true);
  await page.exposeFunction('getSettings', () => {
    return {
      output: [output.name],
      selectedTab: 0,
      allowOverlapping: true,
      deleteToTrash: true,
      syncVolumes: false,
      theme: 1,
      audioBackend: 1,
      viewMode: 0,
      stopHotkey: [],
      pushToTalkKeys: [],
      localVolumeKnob: null,
      remoteVolumeKnob: null,
      tabHotkeysOnly: false,
      minimizeToTray: false,
      localVolume: 50,
      remoteVolume: 100,
      allowMultipleOutputs: true,
      useAsDefaultDevice: false,
      muteDuringPlayback: false,
    };
  });
  await page.exposeFunction('changeSettings', () => {});
  await page.exposeFunction('getKeyName', () => '');
  await page.exposeFunction('isLinux', () => true);
  await page.exposeFunction('getTabs', () => {
    const tabs = [];
    for (let i = 1; i < 6; i++) {
      const tab = { id: i, name: `Tab ${i}`, sounds: [], sortMode: 1 };
      for (let j = 1; j < 29; j++) {
        tab.sounds.push({
          id: j,
          name: `Example Sound ${j}`,
          path: '',
          modifiedDate: 0,
          hotkeys: [],
          hotkeySequence: '',
          localVolume: null,
          remoteVolume: null,
        });
      }
      tabs.push(tab);
    }
    return tabs;
  });
  await page.exposeFunction('updateCheck', () => null);
  await page.exposeFunction('getPlayback', () => {
    return [
      {
        application: 'Firefox',
        appIcon:
          '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',
      },
      {
        application: 'Spotify',
        appIcon:
          'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABWBJREFUWIXFl2lsVFUUx3/nvTcznc5Ma3fpBrJKRSMuAaK4kWiMjUaNIS6hojEmfkBD+KrRxPjBL2pM3NDEin5BDYmigWiCaFzjQiuUlGILHehCF5ml01nee8cP00Kn7Qxt0Xg+vZx77v3/7/+ce8998D+bLHRi49FHBQioqoDEw03v639KoPHoo17gLqAZWK+qy0TENzGcBv4Cfga+APb2rn4/+a8QaOhoKRJkG7AdoWZObJUhRV8VeKW3qXV8wQQaOlrWAbtEZMWcgGcQ0W6FLeGm1u/zhRgFwB8BDi4YHEBkqSAHGjpaHssbUgC8VUTyEpyXqarCE+Gm1vcuSGBC9oNTCuzf4pABNoWbWr/LS6ChfUsRlrRflOyFSZzA0TXhKz8Ym/RZORGWPD0dXGMZtCuChsdgOAmxDJpyQUC8JpR4kMoiqCtGloaQsvzCicgSNdkBvHDON/lR/9ODPinxnhSRGgC3fRTntSNwPArzuWJqi5FrKzA2XopcV4lYuWWkqqOasBtOXfdRIkcBCXiaJ8EB3N090BWdB/KE9SXQvgTO52Go8GHctwTj/iVIcRZKRMopMu8FPsohgNA8dR3jnkac/gSyOIisKUMuCyE1fijxgM/MBqUciKTRM0m0N44ei6CHRiE8keKRFO7OTtw9J7DevhGpKpoEa56FgKzPIXB9Fcb1VYV36zEg6EHqArC24pxbw3HcfadxP+uFSBqGU2h37DwBYd35fQP+OxZbla/cMiYi3ukYOpRE20fR41G0P5FdMO2CKVnwqiJoDCKXlyKrSnNyruM27p6ToGA8uBQxsiWnqk7iy57gyI5vkxZA6OHVodnAnZ2duLuOFxQhpz4DFrKhGuPO+mwB+i3Mh5bNmCMipveqqkrglAWgCXvWG1GHJxpahS+7u/oAlHnBa4LtZo/kwDjaE4OeGIzZ6Nd9OF/3wdIQ5pOXY2yonp15yjFgIgXeNRW+mt3N0ekqqO3CmSQs8iNSuHFqPIP+MoT7VR/64yC4Wb/56jqMaypzY1XdyOuHSqNvtsUtgPThERtbe/HI8hypLANqi89PHLfhbBqSTpZ60ANlPsQUJOhBbqvFuK0WPTWG824n2hlBqv0z2Tp6OvpmWxLOnwJXU/Zv4vHmEFBHcT/oQttGszL/nZ65mMeAJUGMqyuQm2qQq8qR+gDW89fkVyvl/A44Uwmoeza13wh6N+dEjiRxW7uylbaoGFleAuU+xG+Bq2gsA/0JtDuG2xWFj3tgcRCzZTmyqTZv2txIah8T9XsuIvDAysry59YfE8soy2Hbn8je9wFP/h2lHfTQKO7+U+iBfrAV4/GVmC0ze5o6bjTy2h+rojv/HAAwJwcyHSPJ4AMryo2Q94apEyTkyTadAiamgdQFMG5ehHF7HdiK3FCTvTmnmTOUeGd424FPJxWYurK60fQR/8a6zWIaJQURC5EJeTA2VM8KrhlnIPL6oa3p9uHIpC+nVY3tOd6f/Kn/GVW1F0ogn6mqk/p1cHv8w6Onp/pnaJvY291dfGtD2qjy3yoXOvxzB9dM598vDj705U4gU5AA4MR3H/vdf1N9yqwu3nix70JVdTIdoy8N3P/5y0Bi+ni+6sqMfdL1q2fZJcc8jSUbxDJCCwJPO4PjB8JPn9m6/21gbLaYQuWdGd9/8mi6bWivp6nCNEp9K8WY20NVbTdm90R2jTz7w1PRt9q/AfL+Jc01x0Hv2urFl2xbe7d1WcktRqnvCvGZiybTo6ouaWfQOZs+bJ+IHIy80fZZ6peBE0CcCzzo5ltkXiAIBM26YNB/Y20FCMkf+0bt3liMrMxxIDXPdRdswkX8YQP8A9c2JZ4wXbh1AAAAAElFTkSuQmCC',
      },
    ];
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
  await page.goto(`file:${join(__dirname, '../dist/index.html')}`);

  // convenience functions
  const ss = async (name, element) => {
    const toScreenshot = element || page;
    console.debug(`Taking screenshot ${name}...`);
    await toScreenshot.screenshot({
      path: `./screenshots/${name}.png`,
    });
  };

  const clickButton = async text => {
    const button = await page.waitForXPath(`//button[contains(span, '${text}')]`);
    await button.click();
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

  const addPlaying = async (id, readInMs) => {
    await commit('addToCurrentlyPlaying', {
      id,
      lengthInMs: 10000,
      readInMs,
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
    });
  };

  const ssThemed = async (name, element) => {
    await ss(`${name}-dark`, element);
    await commit('setTheme', 2);
    await ss(`${name}-light`, element);
    await commit('setTheme', 1);
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
}`,
  });
  await page.waitForTimeout(500);

  // screenshot home
  await ssThemed('home');

  // screenshot grid view
  await commit('setViewMode', 1);
  await ssThemed('grid-view');
  await commit('setViewMode', 0);

  // screenshot launchpad view
  await commit('setViewMode', 2);
  await ssThemed('launchpad-view');
  await commit('setViewMode', 0);

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
  await page.waitForTimeout(500);

  // screenshot pass through
  await clickButton('Pass through');
  await ssThemed('pass-through');
  const passThroughDrawer = await page.waitForSelector('aside');
  await ssThemed('pass-through-drawer', passThroughDrawer);
  await page.keyboard.press('Escape');
  await clickButton('Pass through');

  // screenshot playing sound
  await addPlaying(1, 5000);
  await ssThemed('playing');

  // screenshot bottom drawer
  await addPlaying(2, 8000);
  await addPlaying(3, 3000);
  const openDrawerButton = await page.waitForSelector('footer > button');
  await openDrawerButton.click();
  await ssThemed('multiple-playing');
  const bottomSheet = await page.waitForSelector('.v-bottom-sheet');
  await ssThemed('media-controls', bottomSheet);

  // generate readme
  console.debug('Generating screenshot overview readme...');
  const table = [['Name', 'Preview (direct link)']];

  const screenshotsDir = join(__dirname, '../screenshots');
  const dir = await readdir(screenshotsDir);
  dir.forEach(file => {
    if (file.endsWith('.png')) {
      const link = `https://raw.githubusercontent.com/Soundux/screenshots/screenshots/${file}`;
      table.push([file.substring(0, file.length - 4), `[![${file}](${link})](${link})`]);
    }
  });

  const screenshotsTable = markdownTable(table);
  const readmeFile = `# Screenshots overview\n` + screenshotsTable;
  await writeFile(join(screenshotsDir, 'README.md'), readmeFile);

  // close browser
  await page.close();
  await browser.close();
} catch (error) {
  console.error(error);
}

console.log('Successfully generated screenshots');
