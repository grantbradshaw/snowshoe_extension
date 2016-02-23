(function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.message === "clicked_browser_action" ) {
        if ($('#snowshoe-toolbar-wrapper').length > 0){
          removeToolbar();
        } else {
          var frame = $('<div>').attr('id', 'snowshoe-toolbar-wrapper');
          $('body').addClass('snowshoe-active-body').prepend(frame);
          $(document).on('click', select_handler);
        }
        var button_export = $('<button type="button" class="export snowshoe">Export</button>');
        $(button_export).appendTo(frame);
      }
    }
  );

  $(document).on('click', '.export', function(){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults});
    removeToolbar();
  });
})();
