var React = require("react");
var ReactDom = require("react-dom");
var propTypes = React.propTypes;

var Popup = function (props) {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2 className="centered">{getHostname(props.url)}</h2>
        <hr/>
        <input type="hidden" id="tabId" value={props.tabId} />
        <input type="hidden" id="hostname" value={getHostname(props.url)} />
        <div id="buttonholder"></div>
      </form>
    </div>
  );
}

var Explanation = function (props) {
  return(
    <div className="centered" >
      <p> The extension is active on this page due to a wildcard option.</p>
      <p> The wildcard option active is <b>{props.regex}</b></p>
      <p> Please use the options page to manage wildcards </p>
      <button onClick={props.onClick}> Open Options page </button>
    </div>
  )
}

var openOptions = function () {
  chrome.runtime.openOptionsPage()
}

var SwitchButton = function (props) {
  return (
    <div>
      <input type="hidden" id="domainEnabled" value={props.checked} />
      <table>
        <tbody>
          <tr>
            <td>
              <label className="switch">
                <input id="toggle" type="checkbox" onChange={props.onClick} checked={props.checked} />
                <div className="slider round"></div>
              </label>
            </td>
          </tr></tbody>
      </table>
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
  if (url.protocol == "http:" || url.protocol == "https:") {
    ReactDom.render(<Popup url={tab.url} tabId={tab.id} />, document.getElementById("container"));
  }

  var hostname = getHostname(tab.url);
  chrome.storage.local.get(null, function (items) {
    var preferred = false;
    if (items[hostname] == hostname) {
      preferred = true;
    }
    else {
      for (var item in items) {
        var re = new RegExp('^'+item.replace('*','.*')+'$');
        if (re.test(hostname)){
          ReactDom.render(<Explanation regex={item} onClick={openOptions}/>, document.getElementById("buttonholder"));
          return(true);
        }
      }
    }

    ReactDom.render(<SwitchButton onClick={onSubmit} checked={preferred} />, document.getElementById("buttonholder"));
  });
}

function init() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { 
    showPopup(tabs[0]); 
  });
}

document.addEventListener('DOMContentLoaded', init);