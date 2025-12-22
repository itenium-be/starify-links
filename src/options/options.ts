import { setupBadgesOptions } from './badgesOptions';
import { setupDirectActivationOptions } from './directActivationOptions';

function displayVersion() {
  const manifest = chrome.runtime.getManifest();
  const versionEl = document.getElementById('versionInfo');
  if (versionEl) {
    versionEl.textContent = `v${manifest.version}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupBadgesOptions();
  setupDirectActivationOptions();
  displayVersion();
});
