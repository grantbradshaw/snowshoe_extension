'use strict';

var cached_exports = [];

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.message === "data_export" ) {
      cached_exports.push(request.data);

      var xhr = createXHRRequest('POST', 'http://localhost:8080/scrapes');
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(cached_exports));
      // chrome.storage.sync.get('jwt', function(res){
      //   xhr.setRequestHeader("Content-Type", "application/json");
      //   xhr.setRequestHeader("Authorization", "Bearer " + res.jwt);
      //   xhr.send(JSON.stringify(cached_exports));
      // });

      xhr.onreadystatechange = function(){
        console.log(xhr.status);
        if (xhr.readyState == 4 && xhr.status == 200){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            cached_exports = [];
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
      };
    }
    // if (request.message === 'check_jwt') {
    //   chrome.storage.sync.set({jwt: ''}); // for manually resetting the jwt
    //   chrome.storage.sync.get('jwt', function(res){
    //     if (!res.jwt) {
    //     var xhr = createXHRRequest('GET', 'http://localhost:8080/token'); // but this will be publicly exposed as the token route :/
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send();

    //     xhr.onreadystatechange = function() {
    //       if (xhr.readyState == 4 && xhr.status == 200) {
    //         var jwt_token = JSON.parse(xhr.responseText).jwt;
    //         chrome.storage.sync.set({jwt: jwt_token});
    //         }
    //       };
    //     }
    //     });
    // }
    // if (request.message === "data_save") {
    //   var selector = request.data.selector;
    //   if (Object.keys(tracks.pages).includes(request.data.url)){
    //     tracks.pages[request.data.url].push(selector)
    //   } else {
    //     tracks.pages[request.data.url] = [selector]
    //   }
    // }
    // if (request.message === "data_delete"){
    //   tracks.pages[request.data.url].forEach(function(scrape, index){
    //     if (scrape.path === request.data.selector.path) {
    //       tracks.pages[request.data.url].splice(index, 1);
    //     }
    //     if (!tracks.pages[request.data.url].length){
    //       delete tracks.pages[request.data.url]
    //     }
    //   });
    // }
  }
);

// Returns whether extension is on http or https site (or other?)
// function getProtocol(){
//   var tab_path = window.location.href;
//   return tab_path.split(':')[0];
// }

function createXHRRequest(method, url){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

// function sendMessage(message){
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": message});
//   });
// }