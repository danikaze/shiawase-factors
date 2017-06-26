((document, window) => {
  const BUTTON_ID = 'shiawase-autoplay';
  let autoPlayEnabled = false;
  let timerHandler;
  let autoPlayButton;

  const buttonStyleOff = {
    position: 'absolute',
    'z-index': 99999,
    background: '#082694',
    width: '30px',
    height: '30px',
    top: '20px',
    left: '10px',
    border: '1px solid #010c31',
    'border-radius': '5px',
    'text-align': 'center',
    cursor: 'pointer',
  };
  const contentStyleOff = {
    color: '#929fc3',
    position: 'relative',
    top: '3px',
  };
  const buttonStyleOn = {
    background: '#3fb543',
    border: '1px solid #19920b',
  };
  const contentStyleOn = {
    color: '#fff5ab',
  };

  function waitFor(condition, timeout) {
    const promise = new Promise((resolve) => {
      evalCondition(resolve);
    });

    timeout = timeout || 1000;

    function evalCondition(resolve) {
      if (condition()) {
        resolve();
      } else {
        setTimeout(evalCondition, timeout, resolve);
      }
    }

    return promise;
  }

  function getOptions() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        urlFilter: '',
        nextPageDelay: 500,
        executionDelay: 3000,
      }, resolve);
    });
  }

  function enableNextPage() {
    const nextButton = document.getElementById('next_btn');
    if (!autoPlayEnabled || !nextButton || nextButton.style.display === 'none') {
      disableNextPage();
      return;
    }

    nextButton.click();
    applyStyle(autoPlayButton, buttonStyleOn);
    applyStyle(autoPlayButton.children[0], contentStyleOn);

    getOptions().then((options) => {
      timerHandler = setTimeout(enableNextPage, options.nextPageDelay);
    });
  }

  function disableNextPage() {
    clearTimeout(timerHandler);
    timerHandler = undefined;
    applyStyle(autoPlayButton, buttonStyleOff);
    applyStyle(autoPlayButton.children[0], contentStyleOff);
  }

  function applyStyle(elem, style) {
    if (!elem) {
      return;
    }

    Object.keys(style).forEach((key, i) => {
      elem.style[key] = style[key];
    });
  }

  function addAutoPlayButton() {
    autoPlayButton = document.createElement('div');
    autoPlayButton.id = BUTTON_ID;
    applyStyle(autoPlayButton, buttonStyleOff);

    const content = document.createElement('span');
    content.innerHTML = '▶︎';
    applyStyle(content, contentStyleOff);

    autoPlayButton.appendChild(content);
    document.body.appendChild(autoPlayButton);

    autoPlayButton.addEventListener('click', onClickHandler);
  }

  function removeAutoPlayButton() {
    const button = document.getElementById(BUTTON_ID);
    if (button) {
      button.parentElement.removeChild(button);
    }
  }

  function onClickHandler(force) {
    autoPlayEnabled = typeof force === 'boolean' ? force : !autoPlayEnabled;
    if (autoPlayEnabled) {
      enableNextPage();
    } else {
      disableNextPage();
    }
  }

  if (!document.location.href.match(/control.html?$/)) {
    return;
  }

  waitFor(() => document.getElementById('next_btn')).then(() => {
    removeAutoPlayButton();
    addAutoPlayButton();
    onClickHandler(false);
  });
})(document, window);
