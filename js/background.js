var tracks = {'trackName': '',
              'pages': {}}

var extension_active = false;

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "tracks": tracks});
    extension_active = !extension_active;
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
     if (extension_active){
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "tracks": tracks});
     }
   });
 });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "data_export" ) {
      if (Object.keys(tracks.pages).length == 0){
        sendMessage("export_fail");
        return false
      }
      Object.keys(tracks.pages).forEach(function(key){
        tracks.pages[key].forEach(function(scrape){
          delete scrape.content
        });
      });
      tracks.trackName = request.trackName;
      var xhr = createCORSRequest('POST', 'http://localhost:3000/tracks');
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(tracks));

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
          alert('here');
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "export_success", trackURL: JSON.parse(xhr.responseText).trackURL});
          });
          alert('there')
          tracks.trackName = '';
          tracks.pages = {};
        }
      }
    }
    if (request.message === "data_save") {
      var selector = request.data.selector;
      if (Object.keys(tracks.pages).includes(request.data.url)){
        tracks.pages[request.data.url].push(selector)
      } else {
        tracks.pages[request.data.url] = [selector]
      }
    }
    if (request.message === "data_delete"){
      tracks.pages[request.data.url].forEach(function(scrape, index){
        if (scrape.path === request.data.selector.path) {
          tracks.pages[request.data.url].splice(index, 1);
        }
        if (!tracks.pages[request.data.url].length){
          delete tracks.pages[request.data.url]
        }
      });
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

function sendMessage(message){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": message});
  });
}