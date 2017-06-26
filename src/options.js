// Saves options to chrome.storage
function saveOptions() {
  const urlFilter = document.getElementById('url-filter').value;
  const nextPageDelay = document.getElementById('next-page-delay').value;
  const executionDelay = document.getElementById('execution-delay').value;
  let banishTimer;
  let hideTimer;

  chrome.storage.sync.set({
    urlFilter,
    nextPageDelay,
    executionDelay,
  }, () => {
    // Update status to let user know options were saved.
    clearTimeout(banishTimer);
    clearTimeout(hideTimer);

    const status = document.getElementById('status');
    status.classList.add('show');
    banishTimer = setTimeout(() => {
      status.classList.add('banish');
      hideTimer = setTimeout(() => {
        status.classList.remove('show');
        status.classList.remove('banish');
      }, 2000);
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  getOptions().then((items) => {
    document.getElementById('url-filter').value = items.urlFilter;
    document.getElementById('next-page-delay').value = items.nextPageDelay;
    document.getElementById('execution-delay').value = items.executionDelay;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
