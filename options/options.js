document.getElementById("add").addEventListener("click", function(){
  var hostname = document.getElementById("domain").value;
  console.log(hostname);
  var items = {};
  items[hostname] = hostname;
  chrome.storage.local.set(items);
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
      console.log(this);
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

