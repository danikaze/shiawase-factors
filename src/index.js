const activeTabs = [];
const cachedXmls = {};
const requestedXmls = [];

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

function sniffRequests() {
  function processXml(tabId, xml) {
    console.log('xml');
    setTimeout(() => {
      chrome.tabs.executeScript(tabId, {
        file: 'src/action-questions.js',
        runAt: 'document_end',
        allFrames: true,
      }, () => {
        const escapedXml = JSON.stringify(xml).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        chrome.tabs.executeScript(tabId, {
          code: `typeof shiawaseSetData !== 'undefined' && shiawaseSetData('${escapedXml}')`,
          runAt: 'document_end',
          allFrames: true,
        });
      });
    }, 5000);
  }

  function requestListener(r) {
    const url = r.url;
    if (!url || url.indexOf('imsmanifest.xml') !== -1) {
      return;
    }

    const cachedXml = cachedXmls[url];
    if (cachedXml) {
      processXml(r.tabId, cachedXml);
    } else if (requestedXmls.indexOf(url) === -1) {
      requestedXmls.push(url);
      getXmlAsJson(url).then((xml) => {
        cachedXmls[url] = xml;
        processXml(r.tabId, xml);
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
  sniffRequests();
}
