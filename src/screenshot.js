const path = require('path');
const puppeteer = require('puppeteer');

const [width, height] = [1360, 795];
const output = {
  name: 'Discord',
  application: 'Discord',
  appIcon:
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAABRhJREFUWIXll0mIXEUYx39fvdevu2emJzOTzKommURioiBOTIyiiPEgGkPigqDgyVvwoggiHjwGQXJzJ3hwkGDEJS6gQRRFXAKiCAnjlsk2E2OI9KTT4/RS9Xl4r7vfe90ZJYoeLCi6urb/v/7fUvXg/17kAscupOhfAvng6fsLG9f27/CNuwa1GdSBOlSthm1Lo6/xX8/T3xrXWl3NgQOHef72xz4unZfA27vuKty8fuwTT9xEcoP4pjYFFo279v5wzIIqqMXif/3RFJvvfOKLJgkTJ7Bp3dIHQ3AXLqJRSbVTgmpa3Y5q42nl6mvH7Y54nx9Xw2A3oSbasCG9RifQiIO2yKmG4x1BtWPbaPU6QuU1rYCos1nUJcGJyCR+06DaoXYgoYpzGhAzfUKBpk2JnzKyqcnC0quwfi/VXw6Qq51EYoC2exwzcj1ybhpOfQ71chO0qV4HpeIEUHWhQ4V/ohMLXLKFemEt1eJRVB2Zyx5AeoYhKIT71ebwyrPM/3YE0ztBsPJezMn9cPjVaI+4SsmSImBBvRZzFF2+HR25EaPQNbCO5HwNxcwug+wyugauBMDNn0LH78NJHvn+xZhS7QokokASoeZQ8WD0JkzQi8n2toOfp5iuYcTPIcu3Uq4HLUfuoEKCQDLGLQxchWR62gAWA4/PkUw3ZvRGypWYX6WWmuSiVMIZ3HhB4PESXHwTzikLVReSWNwEEbBzKAb6Lk+C2xq/T+9n4finCSLq6ixMv0/12IeRI7fG/KEJjOfjVKnVGqZolZQTRmEH0LMS8fOJU5cO7eHs1JuA0l8r07XqNgB+n9pD+dArGBw9lSLBpXe3NvVy+P1r0DPfoTjq1sUh23xAQwUsdC9HE5kOKsUjOOdQZ6kVp5v99bmjoQPjqBd/Jl38vkvxBAyKWdwJXSShRXNDbRv1rL4NYzy8IE/X+C3N/vyqLRg/wPh5gvGtbetM9xgiDiOKSd2/CROEp49mBIVWtzpEDLnRDYxun0SMh3jZ5nhmeD39W19DAfFz0RqLiAeABL14oql80EEBbV6vNjmvMkflyAfYczOYTFcCPFyn4OcQP4fOn8ROvwFzP6HOhhNcrQmuJH0gpYADjRT46WW0dzXSsxyCAsHStVSO7Wd+7hh+4WK83hWYXH+4rHoWPTuNlqYxQQHvos2QGwSto8UfYeoFWvfKIlEgEQFB0YXT6JcPU7noDjIrbsF0jZIZ2kD5h31UT3yGiGLEISgGh4ji+Xn8DY+jhXGk8hv8PAmH94JdIPnGOA+BuPSCInaezJFXKB6aRLID4OpotYRII55DYGl4d72E/WZn2K4VEWJPNBrX/CIEwsmJDjyBvrxSLJ8O02sT0EVhRagALnS0ahGJlBHVVvZr5JhFUrFaWy9p5IQavfXUWQyOJXnFNw5Ri8FiGmGFRcThoQiuaZaz8+6oph+qfxIF+uNM+T1V1eTrNqyeOArZkETj9BIR8XDNOJfI2Q6esLvPlOpfJUwQz7SdCGx+/OBbU8fPPeectW03Y3Ty7kDxjEOwIXADPGo3AK+4xLvsnl2z9/06V/skCZ4kkP4uEKDw0LbhiRvW9UwYEb/93QfOKXWrzROHfkHL1igZ38xse3Jm75pRf+SdRwd3j/WZW1FHqaLvje34ZVsbk1QxQAYI/kZtOLgZXmJGDj419HrppWGdfXb4XdJXwL9QpDvL4Lc7ByZnnxn8TwgAiAgD+x7pu5N//rvzr5MglXv+ANNZT+AVaZNqAAAAAElFTkSuQmCC',
};

const start = async () => {
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
}`,
  });
  await page.waitForTimeout(500);

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
  await page.waitForTimeout(500);

  // screenshot playing sound
  await commit('addToCurrentlyPlaying', {
    id: 1,
    lengthInMs: 5000,
    readInMs: 2500,
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
