((window) => {
  function getOptions() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        urlFilter: 'plateau.com',
        nextPageDelay: 500,
        executionDelay: 3000,
      }, resolve);
    });
  }

  /**
   * Check if an object is a string
   *
   * @param   {*}       obj Object to check
   * @returns {Boolean}     true if {@link obj} is a string, false otherwise
   */
  function isString(obj) {
    return typeof obj === 'string' || obj instanceof String;
  }

  /**
   * Request a URL and return the content as plain text
   *
   * @param   {String}  url       url to open
   * @param   {Object}  [options]
   * @returns {Promise}           Promise resolved to a String
   */
  function request(url, options) {
    return new Promise((resolve, reject) => {
      if (options.mockData) {
        resolve(options.mockData);
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            resolve([xhr.responseText, xhr]);
          } else {
            reject(xhr);
          }
        }
      };

      try {
        xhr.send();
      } catch (e) {
        reject(xhr, e);
      }
    });
  }

  /**
   * Opens a URL and load a JSON object
   *
   * @param   {String}  url URL to open
   * @returns {Promise}     Promise resolved to the JSON object
   */
  function getJson(url, options) {
    return new Promise((resolve, reject) => {
      function resolveJson([data, xhr]) {
        if (!isString(data)) {
          data = JSON.stringify(data);
        }
        try {
          const json = JSON.parse(data);
          resolve(json, xhr);
        } catch (error) {
          reject(xhr, error);
        }
      }

      request(url, options || {}).then(resolveJson, reject);
    });
  }

  function getXmlAsJson(url, options) {
    return new Promise((resolve, reject) => {
      function resolveXml([data, xhr]) {
        try {
          const xml = new window.X2JS();
          resolve(xml.xml_str2json(data));
        } catch (error) {
          reject(xhr, error);
        }
      }

      request(url, options || {}).then(resolveXml, reject);
    });
  }

  // export public functions
  Object.assign(window, {
    getOptions,
    isString,
    request,
    getJson,
    getXmlAsJson,
  });
})(window);
