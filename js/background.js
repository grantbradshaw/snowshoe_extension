var tracks = {'trackName': '',
              'pages': {}}

var extension_active = false;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (extension_active){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "tracks": tracks});
    }
  });
});

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    if (extension_active){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "tracks": tracks});
      extension_active = false;
    } else {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "tracks": tracks});
      extension_active = true;
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      if (request.message === "data_index"){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "display_index", "tracks": tracks});
      }
    })
  })

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "data_export" ) {
      if (Object.keys(tracks.pages).length == 0){
        alert('You have tracks, please add one to export!')
        return false
      }

      tracks.trackName = prompt('What is the name of this track?');

      var xhr = createCORSRequest('POST', 'http://localhost:3000/testing');
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(tracks));

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
          alert('success');
          tracks.trackName = '';
          tracks.pages = {};
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
    if (request.message === "data_delete"){
      tracks.pages[request.data.url].forEach(function(scrape, index){
        if (scrape.path === request.data.selector.path) {
          tracks.pages[request.data.url].splice(index, 1);
        }
        if (!!tracks.pages[request.data.url]){
          delete tracks.pages[request.data.url]
        }
      })
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