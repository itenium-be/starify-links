import { activateDirectlyOn, serializeDirectActivationConfig, deserializeDirectActivationConfig } from "../directActivation";
import { DirectActivation } from "../types";

export function setupDirectActivationOptions() {
  loadDirectActivationList();
  document.getElementById('saveDaBtn')!.addEventListener('click', () => {
    saveDirectActivationConfig();
    showSaveDaStatus();
  });
  document.getElementById('resetDaBtn')!.addEventListener('click', resetDirectActivationToDefaults);
  document.getElementById('addDaSite')!.addEventListener('click', addNewSite);
}

function loadDirectActivationList() {
  chrome.storage.sync.get(['directActivationConfig'], (result) => {
    const config: DirectActivation[] = deserializeDirectActivationConfig(result.directActivationConfig || activateDirectlyOn);

    const listEl = document.getElementById('directActivationList')!;
    listEl.innerHTML = config.map((activation, index) => {
      const urlValue = typeof activation.url === 'string' ? activation.url : activation.url.source;
      const isRegex = typeof activation.url !== 'string';
      return `
        <div class="accordion-item" data-index="${index}">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}">
              <div class="form-check form-switch me-3" onclick="event.stopPropagation()">
                <input class="form-check-input da-enabled" type="checkbox"
                  ${activation.enabled ? 'checked' : ''} data-index="${index}">
              </div>
              <div>
                <strong class="da-label-display">${escapeHtml(activation.label)}</strong>
                <br>
                <small class="text-muted da-url-display">${escapeHtml(urlValue)}</small>
              </div>
            </button>
          </h2>
          <div id="collapse-${index}" class="accordion-collapse collapse" data-bs-parent="#directActivationList">
            <div class="accordion-body">
              <div class="mb-3">
                <label class="form-label">Label</label>
                <input type="text" class="form-control da-label" value="${escapeAttr(activation.label)}" data-index="${index}">
              </div>
              <div class="mb-3">
                <label class="form-label">URL Pattern</label>
                <div class="input-group">
                  <input type="text" class="form-control da-url" value="${escapeAttr(urlValue)}" data-index="${index}">
                  <div class="form-check form-switch ms-3 d-flex align-items-center">
                    <input class="form-check-input da-url-regex" type="checkbox" ${isRegex ? 'checked' : ''} data-index="${index}">
                    <label class="form-check-label ms-2">RegExp</label>
                  </div>
                </div>
                <small class="form-text text-muted"><b>String</b>: exact prefix match. <b>RegExp</b>: <code>^https:\\/\\/itenium\\.(be|com)</code></small>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Observe Selector <small>(optional)</small></label>
                  <input type="text" class="form-control da-observe" value="${escapeAttr(activation.observe || '')}" data-index="${index}" placeholder="CSS selector to observe for new links">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Extra Badge Selector <small>(optional)</small></label>
                  <input type="text" class="form-control da-extra-badge" value="${escapeAttr(activation.extraBadgeSelector || '')}" data-index="${index}" placeholder="Additional places to show badges">
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <div class="form-check">
                    <input class="form-check-input da-observe-duplicates" type="checkbox" ${activation.observeAllowDuplicates !== false ? 'checked' : ''} data-index="${index}">
                    <label class="form-check-label">Allow Duplicate Badges</label>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="form-check">
                    <input class="form-check-input da-replace-text" type="checkbox" ${activation.replaceText !== false ? 'checked' : ''} data-index="${index}">
                    <label class="form-check-label">Replace Link Text</label>
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                  <div class="form-check">
                    <input class="form-check-input da-observe-nav" type="checkbox" ${activation.observeNavigation === true ? 'checked' : ''} data-index="${index}">
                    <label class="form-check-label">Observe Navigation</label>
                  </div>
                </div>
              </div>
              <button class="btn btn-danger btn-sm da-delete" data-index="${index}">Delete Site</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.da-enabled').forEach(checkbox => {
      checkbox.addEventListener('change', updateLabelDisplay);
    });

    document.querySelectorAll('.da-label').forEach(input => {
      input.addEventListener('input', updateLabelDisplay);
    });

    document.querySelectorAll('.da-url').forEach(input => {
      input.addEventListener('input', updateUrlDisplay);
    });

    document.querySelectorAll('.da-url-regex').forEach(checkbox => {
      checkbox.addEventListener('change', updateUrlDisplay);
    });

    document.querySelectorAll('.da-delete').forEach(btn => {
      btn.addEventListener('click', handleDelete);
    });
  });
}

function updateLabelDisplay(e: Event) {
  const target = e.target as HTMLInputElement;
  const index = target.dataset.index!;
  const item = document.querySelector(`.accordion-item[data-index="${index}"]`) as HTMLElement;
  const labelInput = item.querySelector('.da-label') as HTMLInputElement;
  const labelDisplay = item.querySelector('.da-label-display') as HTMLElement;
  labelDisplay.textContent = labelInput.value;
}

function updateUrlDisplay(e: Event) {
  const target = e.target as HTMLInputElement;
  const index = target.dataset.index!;
  const item = document.querySelector(`.accordion-item[data-index="${index}"]`) as HTMLElement;
  const urlInput = item.querySelector('.da-url') as HTMLInputElement;
  const urlDisplay = item.querySelector('.da-url-display') as HTMLElement;
  urlDisplay.textContent = urlInput.value;
}

function handleDelete(e: Event) {
  const btn = e.target as HTMLButtonElement;
  const index = parseInt(btn.dataset.index!);

  if (!confirm('Are you sure you want to delete this site?')) {
    return;
  }

  chrome.storage.sync.get(['directActivationConfig'], (result) => {
    const config = deserializeDirectActivationConfig(result.directActivationConfig || activateDirectlyOn);
    config.splice(index, 1);
    chrome.storage.sync.set({ directActivationConfig: serializeDirectActivationConfig(config) }, () => {
      loadDirectActivationList();
      showSaveDaStatus();
    });
  });
}

function addNewSite() {
  chrome.storage.sync.get(['directActivationConfig'], (result) => {
    const config = deserializeDirectActivationConfig(result.directActivationConfig || activateDirectlyOn);

    const newSite: DirectActivation = {
      label: '',
      enabled: true,
      url: '',
      observeAllowDuplicates: true,
      replaceText: true
    };

    config.push(newSite);

    chrome.storage.sync.set({ directActivationConfig: serializeDirectActivationConfig(config) }, () => {
      loadDirectActivationList();
      const lastIndex = config.length - 1;
      setTimeout(() => {
        const newItem = document.querySelector(`[data-bs-target="#collapse-${lastIndex}"]`) as HTMLElement;
        if (newItem) {
          newItem.click();
        }
      }, 100);
    });
  });
}

function saveDirectActivationConfig() {
  chrome.storage.sync.get(['directActivationConfig'], (result) => {
    const config = deserializeDirectActivationConfig(result.directActivationConfig || activateDirectlyOn);

    const items = document.querySelectorAll('#directActivationList .accordion-item');
    console.log('Found accordion items:', items.length);

    items.forEach(item => {
      const el = item as HTMLElement;
      const index = parseInt(el.dataset.index!);

      if (isNaN(index) || index >= config.length) {
        console.warn('Invalid or out of bounds index:', index, 'config length:', config.length);
        return;
      }

      const enabledCheckbox = el.querySelector('.da-enabled') as HTMLInputElement;
      const labelInput = el.querySelector('.da-label') as HTMLInputElement;
      const urlInput = el.querySelector('.da-url') as HTMLInputElement;
      const urlRegexCheckbox = el.querySelector('.da-url-regex') as HTMLInputElement;
      const observeInput = el.querySelector('.da-observe') as HTMLInputElement;
      const extraBadgeInput = el.querySelector('.da-extra-badge') as HTMLInputElement;
      const observeDuplicatesCheckbox = el.querySelector('.da-observe-duplicates') as HTMLInputElement;
      const replaceTextCheckbox = el.querySelector('.da-replace-text') as HTMLInputElement;
      const observeNavCheckbox = el.querySelector('.da-observe-nav') as HTMLInputElement;

      config[index].enabled = enabledCheckbox.checked;
      config[index].label = labelInput.value.trim() || 'Unnamed Site';

      try {
        if (urlRegexCheckbox.checked) {
          config[index].url = new RegExp(urlInput.value);
        } else {
          config[index].url = urlInput.value.trim() || 'https://example.com';
        }
      } catch (e) {
        alert(`Invalid RegExp pattern at index ${index}: ${urlInput.value}`);
        return;
      }

      config[index].observe = observeInput.value.trim() || undefined;
      config[index].extraBadgeSelector = extraBadgeInput.value.trim() || undefined;
      config[index].observeAllowDuplicates = observeDuplicatesCheckbox.checked ? true : false;
      config[index].replaceText = replaceTextCheckbox.checked ? true : false;
      config[index].observeNavigation = observeNavCheckbox.checked ? true : undefined;
    });

    console.log('Saving config:', config);
    const serialized = serializeDirectActivationConfig(config);

    chrome.storage.sync.set({ directActivationConfig: serialized }, () => {
      console.log('Direct Activation configuration saved successfully');
    });
  });
}

function resetDirectActivationToDefaults() {
  if (confirm('Are you sure you want to reset Direct Activation settings to their default values?')) {
    chrome.storage.sync.set({ directActivationConfig: serializeDirectActivationConfig(activateDirectlyOn) }, () => {
      loadDirectActivationList();
      showSaveDaStatus();
      console.log('Reset Direct Activation to defaults');
    });
  }
}

function showSaveDaStatus() {
  const statusEl = document.getElementById('saveDaStatus')!;
  statusEl.style.display = 'inline';
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 2000);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
