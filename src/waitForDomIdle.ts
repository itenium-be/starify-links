export function waitForDomIdle(run: () => void, debounceMs = 400, maxWaitMs = 5000) {
  const start = () => {
    let ran = false;
    let quiet: ReturnType<typeof setTimeout>;

    const done = () => {
      if (ran) {
        return;
      }
      ran = true;
      observer.disconnect();
      clearTimeout(quiet);
      clearTimeout(hardStop);
      run();
    };

    const observer = new MutationObserver(() => {
      clearTimeout(quiet);
      quiet = setTimeout(done, debounceMs);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    quiet = setTimeout(done, debounceMs);
    const hardStop = setTimeout(done, maxWaitMs);
  };

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }
}
