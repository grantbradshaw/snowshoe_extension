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
              $(scrape.path).addClass('saved');
            });
          }
          var frame = $('<div>').attr('id', 'snowshoe-toolbar-wrapper').addClass('snowshoe');
          $('body').addClass('snowshoe-active-body').append(frame);
          $(document).on('click', select_handler); 
        }
        //var button_export = $('<button type="button" class="export snowshoe">Export</button>');
        var button_export = $('<img src="http://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/export-icon.png" class="export snowshoe"/>')
        $(button_export).appendTo(frame);
        // var button_show = $('<button type="button" class="display snowshoe">Display Selections</button>')
        var button_show = $('<img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-down-b-128.png" class="display snowshoe"/>')
        $(button_show).appendTo(frame);
        //var button_hide = $('<button type="button" class="hide snowshoe">Hide</button>');
        var button_hide = $('<img src="http://icons.iconarchive.com/icons/icons8/windows-8/512/Programming-Minimize-Window-icon.png" class="hide snowshoe"/>')
        $(button_hide).appendTo(frame);
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
            $(tr).append('<td>'+shorten(value.name, 20)+'</td>');
            $(tr).append('<td>'+shorten(value.content, 50)+'</td>');
            $(tr).append('<td><a href="'+key+'">'+shorten(key, 20)+'</td>');
            $(tr).append('<td><button type="button" class="delete snowshoe">Delete</button></td>');
          })
        });

        $('body').append(table_container);
      }
    }
  }
);

  $(document).on('click', '.export', function(){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults});
    removeToolbar();
  });
})();
