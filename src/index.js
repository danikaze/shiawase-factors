const activeTabs = [];
const cachedXmls = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  getOptions().then((options) => {
    const currentTabIndex = activeTabs.indexOf(tabId);
    const isActive = options.urlFilter.length
      && tab.url
      && tab.url.match(options.urlFilter) != null;

    if (isActive) {
      if (currentTabIndex === -1) {
        activeTabs.push(tabId);
      }

      start(tabId, options);
    } else if (currentTabIndex !== -1) {
      activeTabs.splice(currentTabIndex, 1);
    }
  });
});

function sniffRequests(tabId) {
  function processXml(xml) {
    chrome.tabs.executeScript(tabId, {
      file: 'src/action-questions.js',
      runAt: 'document_end',
      allFrames: true,
    }, () => {
      chrome.tabs.executeScript(tabId, {
        code: `typeof shiawaseSetData !== 'undefined' && shiawaseSetData('${JSON.stringify(xml)}')`,
        runAt: 'document_end',
        allFrames: true,
      });
    });
  }

  function requestListener(r) {
    if (!r.url || r.url.indexOf('imsmanifest.xml') !== -1) {
      return;
    }

    const cachedXml = cachedXmls[r.url];
    if (cachedXml) {
      processXml(cachedXml);
    } else {
      getXmlAsJson(r.url).then((xml) => {
        cachedXmls[r.url] = xml;
        processXml(xml);
      });
    }
  }

  const filter = {
    urls: ['http://*/*.xml', 'https://*/*.xml'],
  };
  chrome.webRequest.onCompleted.addListener(requestListener, filter);
}

function start(tabId, options) {
  setTimeout(() => {
    chrome.tabs.executeScript(tabId, {
      file: 'src/xml2json.min.js',
      runAt: 'document_end',
      allFrames: true,
    });
    chrome.tabs.executeScript(tabId, {
      file: 'src/action-enable.js',
      runAt: 'document_end',
      allFrames: true,
    });
  }, options.executionDelay);
  sniffRequests(tabId);
}
