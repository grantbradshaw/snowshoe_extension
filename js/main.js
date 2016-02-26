(function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.message === "clicked_browser_action" ) {
        if ($('#snowshoe-toolbar-wrapper').length > 0){
          removeToolbar();
          $('.display_table').remove();
        } else {
          var current_url = window.location.href;
          var tracks = request.tracks
          if (tracks.pages[current_url]){
            tracks.pages[current_url].forEach(function(scrape, index) {
              $(scrape.path).addClass('saved');
            });
          }
          var frame = $('<div>').attr('id', 'snowshoe-toolbar-wrapper').addClass('snowshoe');
          $('body').addClass('snowshoe-active-body').append(frame);
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
        var table_container = $('<div class="display_table"><tbody></tbody></table></div>').addClass('snowshoe');
        var table = $('<table></table>');
        $(table_container).append(table);
        $(table).append('<thead><tr><th>Name</th><th>Content</th><th>Source</th><th>Delete</tr></thead>');
        var tbody = $('<tbody></tbody>');
        $(table).append(tbody);

        $.each(request.tracks.pages, function(key, value){ 
          $.each(value, function(index, value){
            var tr = $('<tr></tr>').data({url: key, selector:{'name': '', 'path': value.path}});
            $(tbody).append(tr);
            $(tr).append('<td>'+value.name+'</td>');
            var content = $(value.path).text();
            $(tr).append('<td>'+content+'</td>');
            $(tr).append('<td><a href="'+key+'">'+key+'</td>');
            $(tr).append('<td><button type="button" class="delete">Delete</button></td>');
          })
        });

        $('body').prepend(table_container);
      }
    }
  }
);

  $(document).on('click', '.export', function(){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults});
    removeToolbar();
  });
})();
