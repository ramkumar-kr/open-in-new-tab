var React = require("react");
var ReactDom = require("react-dom");
var propTypes = React.propTypes;

var Popup = function (props) {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <table><tbody>
          <tr>
            <td className="description">Domain</td>
            <td className="data"><h3>{getHostname(props.url)}</h3></td>
          </tr></tbody>
        </table>
        <input type="hidden" id="tabId" value={props.tabId} />
        <input type="hidden" id="hostname" value={getHostname(props.url)} />
        <div id="buttonholder"></div>
      </form>
    </div>
  );
}

var Button = function (props) {
  return (
    <div>
      <input type="hidden" id="domainEnabled" value={props.checked} />
      <table>
        <tbody>
          <tr>
            <td className="description">Enabled</td>
            <td className="data"><span className={props.checked.toString()}>{props.checked.toString()}</span></td>
          </tr></tbody>
        </table>
      <button id="toggle" className="toggle-button" onClick={props.onClick}> Toggle </button>
    </div>
  )
};

var getHostname = function (url) {
  var url = new URL(url);
  return url.hostname;
};


var onSubmit = function (e) {
  var hostname = document.getElementById("hostname").value;
  var tabId = parseInt(document.getElementById("tabId").value);
  var enabled = document.getElementById("domainEnabled").value;
  if (enabled === "true") {
    chrome.storage.local.remove(hostname);
  } else {
    var items = {};
    items[hostname] = hostname;
    chrome.storage.local.set(items);
  }
  chrome.tabs.reload(tabId, init);
}

function showPopup(tab) {
  var url = new URL(tab.url);
  if(url.protocol == "http:" || url.protocol == "https:"){
    ReactDom.render(<Popup url={tab.url} tabId={tab.id} />, document.getElementById("container"));
  }

  var hostname = getHostname(tab.url);
  chrome.storage.local.get(null, function (items) {
    var preferred = false;
    if (items[hostname] == hostname) {
      preferred = true;
    }
    ReactDom.render(<Button onClick={onSubmit} checked={preferred} />, document.getElementById("buttonholder"));
  });
}

function init() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { showPopup(tabs[0]); });
}

document.addEventListener('DOMContentLoaded', init);