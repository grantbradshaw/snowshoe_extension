chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "data_export" ) {

      var xhr = createCORSRequest('POST', 'http://localhost:3000/scrapes');
      // var xhr = createCORSRequest('POST', 'https://rocky-castle-99294.herokuapp.com/scrapes');
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(request.data));

      xhr.onreadystatechange = function(){
        console.log(xhr.status);
        if (xhr.readyState == 4 && xhr.status == 200){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "export_success"});
          });
        } else if (xhr.status == 404) {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ 
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "export_fail"});
          });
        }
        else {
          // handle edge cases
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