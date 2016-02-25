(function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.message === "clicked_browser_action" ) {
        if ($('#snowshoe-toolbar-wrapper').length > 0){
          removeToolbar();
        } else {
          var current_url = window.location.href;
          var tracks = request.tracks
          if (tracks.pages[current_url]){
            tracks.pages[current_url].forEach(function(scrape, index) {
              console.log(scrape.path)
              $(scrape.path).addClass('saved');
            });
          }
          var frame = $('<div>').attr('id', 'snowshoe-toolbar-wrapper');
          $('body').addClass('snowshoe-active-body').prepend(frame);
          $(document).on('click', select_handler);  
        }
        var button_export = $('<button type="button" class="export snowshoe">Export</button>');
        $(button_export).appendTo(frame);
        var button_show = $('<button type="button" class="display snowshoe">Display Selections</button>')
        $(button_show).appendTo(frame);
      }
    if ( request.message === "display_index") {
      if ($('.display_table').length > 0){
        $('.display_table').remove();
      } else {
        var table_container = $('<div class="display_table"><table><thead><tr><th>Site</th></tr></thead><tbody></tbody></table></div>')
        $('#snowshoe-toolbar-wrapper').after(table_container)
      }
    }
  }
);

  $(document).on('click', '.export', function(){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults});
    removeToolbar();
  });
})();
