'use strict';

(function(){
  helpers.changeState(1);
  chrome.runtime.sendMessage({"message": "check_jwt"});
  chrome.runtime.onMessage.addListener(
    function(request) {
      if (request.message == "export_fail"){
        console.log('fail');
        $('input[name="selection_name"]').val("We're sorry, could not send this.");
      }
      if (request.message == "export_success"){
        // scrapeResults.selector.name = '';
        // scrapeResults.selector.path = '';
        // hideSelectionBox();
        // changeState(1);
      }
  }
);
})();
