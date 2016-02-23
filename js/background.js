var tracks = {'track_name': '',
              'pages': {}}

var extension_active = false;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (extension_active){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    }
  });
});

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (extension_active){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
      extension_active = false;
      tracks.pages = [];
    } else {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
      extension_active = true;
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "data_export" ) {
    tracks.track_name = prompt('What is the name of this track?');

    var xhr = createCORSRequest('POST', 'http://localhost:3000/testing');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(tracks));

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
        alert('success');
        removeToolbar();
        scrapeResults.track_name = '';
        scrapeResults.scrapes = [];
        extension_active = false;
      }
    }
    }
    if (request.message === "data_save") {
      if (Object.keys(tracks.pages).includes(request.data.url)){
        tracks.pages[request.data.url].push(request.data.selector)
      } else {
        tracks.pages[request.data.url] = [request.data.selector]
      }
    }
  }
);

// Returns whether extension is on http or https site (or other?)
function getProtocol(){
  var tab_path = window.location.href;
  return tab_path.split(':')[0]
}

function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}