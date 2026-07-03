import { BrowserContext, Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

let scriptContent = '';

const consoleBuffers = new WeakMap<Page, string[]>();
const shieldsBuffers = new WeakMap<Page, string[]>();


export async function goToWhitelistedPage(context: BrowserContext, url: string) {
  const page = await context.newPage();

  const logs: string[] = [];
  const shields: string[] = [];
  consoleBuffers.set(page, logs);
  shieldsBuffers.set(page, shields);
  page.on('console', m => logs.push(`${m.type()}: ${m.text()}`));
  page.on('response', r => {
    if (r.url().includes('shields.io')) {
      shields.push(`${r.status()} ${r.url()}`);
    }
  });

  await page.goto(url);
  await page.waitForTimeout(3000);
  return page;
}

export function getBadgeLocator(page: Page, repo: string) {
  return page.locator(`img[src*="https://img.shields.io/github/stars/${repo}.svg"]`);
}

export async function attachDiagnostics(page: Page, testInfo: TestInfo) {
  const logs = consoleBuffers.get(page) ?? [];
  const shields = shieldsBuffers.get(page) ?? [];

  let dom: any;
  try {
    dom = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      cloudflareChallenge: /just a moment|checking your browser|security verification/i.test(document.body?.innerText || ''),
      shieldsBadgesRendered: Array.from(document.querySelectorAll('img[src*="shields.io/github/stars"]'))
        .map(b => (b.getAttribute('src') || '').match(/github\/stars\/([^.?]+)/)?.[1])
        .filter(Boolean),
      githubAnchors: [...new Set(Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href') || '')
        .filter(h => h.includes('github.com')))].slice(0, 20),
    }));
  } catch (e) {
    dom = { error: `could not read page (crashed/closed?): ${e}` };
  }

  const shields429 = shields.filter(s => s.startsWith('429')).length;
  const report = [
    `title: ${dom.title}`,
    `url: ${dom.url}`,
    `cloudflareChallenge: ${dom.cloudflareChallenge}`,
    `shieldsBadgesRendered: ${JSON.stringify(dom.shieldsBadgesRendered)}`,
    `githubAnchors: ${JSON.stringify(dom.githubAnchors, null, 2)}`,
    `shields.io 429 responses: ${shields429}`,
    `shields.io responses:`,
    ...shields,
    ``,
    `browser console (last 25):`,
    ...logs.slice(-25),
    dom.error ? `\n${dom.error}` : ``,
  ].join('\n');

  const file = testInfo.outputPath('failure-diagnostics.txt');
  fs.writeFileSync(file, report);
  await testInfo.attach('failure-diagnostics', { path: file, contentType: 'text/plain' });
}



/** Set up a page with Chrome API mock and inject the userscript */
export async function setupTestPage(page: Page, fixtureName: string) {
  // Load our static HTML page
  const fixturePath = path.join(__dirname, `./fixtures/${fixtureName}`);
  await page.goto(`file://${fixturePath}`);


  // Make sure we don't crash on "chrome.runtime"
  await mockChromeAPI(page);


  // Add our content script
  if (!scriptContent) {
    const scriptPath = path.join(__dirname, '../dist/starify-links.user.js');
    scriptContent = fs.readFileSync(scriptPath, 'utf-8');
  }
  await page.addScriptTag({ content: scriptContent });


  // Trigger the starifying
  await triggerStarify(page);
}


export async function triggerStarify(page: Page) {
  await page.evaluate(() => {
    const callback = (window as any).__chromeMessageCallback;
    if (callback) {
      callback({ action: 'activate-github-stars' });
    }
  });

  // Wait for badges to be processed
  await page.waitForTimeout(2000);
}


/** Mock the Chrome Extension API */
async function mockChromeAPI(page: Page) {
  await page.addScriptTag({
    content: `
      window.chrome = {
        runtime: {
          onMessage: {
            addListener: function(callback) {
              console.log('Chrome runtime mock: message listener registered');
              // Store the callback so tests can trigger it if needed
              window.__chromeMessageCallback = callback;
            }
          }
        },
        storage: {
          sync: {
            get: function(keys, callback) {
              console.log('Chrome storage mock: get called with keys', keys);
              // Return empty object so defaults are used
              callback({});
            },
            set: function(items, callback) {
              console.log('Chrome storage mock: set called with items', items);
              if (callback) callback();
            }
          }
        }
      };
    `
  });
}
