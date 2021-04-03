import puppeteer from 'puppeteer';
import { markdownTable } from 'markdown-table';
import { dirname, join } from 'path';
import { writeFile, readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const [width, height] = [1360, 795];
const output = {
  name: 'DiscordCanary',
  appIcon:
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABRhJREFUWIXll0mIXEUYx39fvdevu2emJzOTzKommURioiBOTIyiiPEgGkPigqDgyVvwoggiHjwGQXJzJ3hwkGDEJS6gQRRFXAKiCAnjlsk2E2OI9KTT4/RS9Xl4r7vfe90ZJYoeLCi6urb/v/7fUvXg/17kAscupOhfAvng6fsLG9f27/CNuwa1GdSBOlSthm1Lo6/xX8/T3xrXWl3NgQOHef72xz4unZfA27vuKty8fuwTT9xEcoP4pjYFFo279v5wzIIqqMXif/3RFJvvfOKLJgkTJ7Bp3dIHQ3AXLqJRSbVTgmpa3Y5q42nl6mvH7Y54nx9Xw2A3oSbasCG9RifQiIO2yKmG4x1BtWPbaPU6QuU1rYCos1nUJcGJyCR+06DaoXYgoYpzGhAzfUKBpk2JnzKyqcnC0quwfi/VXw6Qq51EYoC2exwzcj1ybhpOfQ71chO0qV4HpeIEUHWhQ4V/ohMLXLKFemEt1eJRVB2Zyx5AeoYhKIT71ebwyrPM/3YE0ztBsPJezMn9cPjVaI+4SsmSImBBvRZzFF2+HR25EaPQNbCO5HwNxcwug+wyugauBMDNn0LH78NJHvn+xZhS7QokokASoeZQ8WD0JkzQi8n2toOfp5iuYcTPIcu3Uq4HLUfuoEKCQDLGLQxchWR62gAWA4/PkUw3ZvRGypWYX6WWmuSiVMIZ3HhB4PESXHwTzikLVReSWNwEEbBzKAb6Lk+C2xq/T+9n4finCSLq6ixMv0/12IeRI7fG/KEJjOfjVKnVGqZolZQTRmEH0LMS8fOJU5cO7eHs1JuA0l8r07XqNgB+n9pD+dArGBw9lSLBpXe3NvVy+P1r0DPfoTjq1sUh23xAQwUsdC9HE5kOKsUjOOdQZ6kVp5v99bmjoQPjqBd/Jl38vkvxBAyKWdwJXSShRXNDbRv1rL4NYzy8IE/X+C3N/vyqLRg/wPh5gvGtbetM9xgiDiOKSd2/CROEp49mBIVWtzpEDLnRDYxun0SMh3jZ5nhmeD39W19DAfFz0RqLiAeABL14oql80EEBbV6vNjmvMkflyAfYczOYTFcCPFyn4OcQP4fOn8ROvwFzP6HOhhNcrQmuJH0gpYADjRT46WW0dzXSsxyCAsHStVSO7Wd+7hh+4WK83hWYXH+4rHoWPTuNlqYxQQHvos2QGwSto8UfYeoFWvfKIlEgEQFB0YXT6JcPU7noDjIrbsF0jZIZ2kD5h31UT3yGiGLEISgGh4ji+Xn8DY+jhXGk8hv8PAmH94JdIPnGOA+BuPSCInaezJFXKB6aRLID4OpotYRII55DYGl4d72E/WZn2K4VEWJPNBrX/CIEwsmJDjyBvrxSLJ8O02sT0EVhRagALnS0ahGJlBHVVvZr5JhFUrFaWy9p5IQavfXUWQyOJXnFNw5Ri8FiGmGFRcThoQiuaZaz8+6oph+qfxIF+uNM+T1V1eTrNqyeOArZkETj9BIR8XDNOJfI2Q6esLvPlOpfJUwQz7SdCGx+/OBbU8fPPeectW03Y3Ty7kDxjEOwIXADPGo3AK+4xLvsnl2z9/06V/skCZ4kkP4uEKDw0LbhiRvW9UwYEb/93QfOKXWrzROHfkHL1igZ38xse3Jm75pRf+SdRwd3j/WZW1FHqaLvje34ZVsbk1QxQAYI/kZtOLgZXmJGDj419HrppWGdfXb4XdJXwL9QpDvL4Lc7ByZnnxn8TwgAiAgD+x7pu5N//rvzr5MglXv+ANNZT+AVaZNqAAAAAElFTkSuQmCC',
};

try {
  const browser = await puppeteer.launch({
    defaultViewport: { height, width },
  });
  const page = await browser.newPage();

  // console output
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', error => {
    console.error(error.message);
  });
  page.on('requestfailed', request => {
    console.error(request.failure().errorText, request.url());
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
      localVolume: 0.5,
      remoteVolume: 1.0,
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
    return [
      {
        name: 'Firefox',
        appIcon:
          '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',
      },
      {
        name: 'Spotify',
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
    await commit('setDarkTheme', false);
    await ss(`${name}-light`, element);
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
}`,
  });
  await page.waitForTimeout(500);

  // screenshot home
  await ssThemed('home');

  // screenshot grid view
  await commit('setGridView', true);
  await ssThemed('grid-view');
  await commit('setGridView', false);

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
