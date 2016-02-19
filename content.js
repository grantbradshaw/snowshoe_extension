function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {
      var xhr = createCORSRequest('POST', 'http://localhost:3000/testing');
      //var token = 'token';
      //xhr.setRequestHeader('X-CSRF-Token', token);
      //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({test: 'kitten'}));
      // //xhr.send('message');
      // $.ajax({
      //   type: "POST",
      //   url: "http://localhost:3000/testing",
      //   contentType: 'application/json',
      //   dataType: 'jsonp',
      //   data: {test: "Did it work?"},
      //   success: function(data) {
      //     console.log('it worked');
      //   }
      // });
      // var firstHref = $("a[href^='http']").eq(0).attr("href");
      // console.log(firstHref);
      // chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref})
    }
  }
);






