document.getElementById("add").addEventListener("click", function(){
  var hostname = document.getElementById("domain").value;
  var items = {};
  items[hostname] = hostname;
  chrome.storage.local.set(items);
});


document.getElementById("bookmark").addEventListener("change", (e) => {
    browser.browserSettings.openBookmarksInNewTabs.set({value: e.target.checked});
});

chrome.storage.local.get(null, function(items){
  for(var item in items){
    var listItem = document.createElement("span");
    var text = document.createTextNode(item);
    listItem.appendChild(text);
    var button = document.createElement("button");
    button.value = item;
    button.setAttribute("host", item);
    button.addEventListener('click', function(){
      chrome.storage.local.remove(this.getAttribute('host'));
      window.location.reload();
    });
    var buttonText = document.createTextNode(" remove");
    button.appendChild(buttonText);
    var div = document.createElement("li");
    div.appendChild(listItem);
    div.appendChild(button);
    document.getElementById("list").appendChild(div);
  }
});

