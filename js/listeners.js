(function(){
  changeState(1);
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "export_fail"){
        // Need something to handle failing export
      }
      if (request.message == "export_success"){
        changeState(1);
      }
  }
);
})();
