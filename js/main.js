(function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.message === "clicked_browser_action" ) {
        $('#snowshoe-show-button').remove();
        if (($('#snowshoe-show-button').length || $('.snowshoe-lightbox').length) && !request.force){
          removeToolbar();
        } else {
          var current_url = window.location.href;
          var tracks = request.tracks
          if (tracks.pages[current_url]){
            tracks.pages[current_url].forEach(function(scrape, index) {
              $(scrape.path).addClass('saved');
            });
          }
          var show_button = $('<button>').attr('id', 'snowshoe-show-button').addClass('snowshoe');
          var arrow_img = chrome.extension.getURL('../config/rarrow.png')
          var show_img = $('<img src="'+arrow_img+'"/>');
          var trash_img = chrome.extension.getURL('../config/trash.png');
          var lightbox = $('<div>').addClass('snowshoe-lightbox snowshoe');
          var lightbox_window = $('<div>').addClass('snowshoe-window showshoe');
          $(lightbox).append(lightbox_window);
          $(show_button).append(show_img);
          var table = $('<table></table>').addClass('snowshoe').addClass('display_table');
          $(table).append('<thead><tr><th>Name</th><th>Content</th><th>Source</th><th>Delete</tr></thead>');
          var tbody = $('<tbody></tbody>');
          $(table).append(tbody);

          $.each(request.tracks.pages, function(key, value){ 
            $.each(value, function(index, value){
              var tr = $('<tr></tr>').data({url: key, selector:{'name': '', 'path': value.path}});
              $(tbody).append(tr);
              $(tr).append('<td>'+shorten(value.name, 20)+'</td>');
              $(tr).append('<td>'+shorten(value.content, 20)+'</td>');
              $(tr).append('<td><a href="'+key+'">'+shorten(key, 30)+'</a></td>');
              $(tr).append('<td><a class="snowshoe delete"><img src="'+trash_img+'"/></a></td>');
            })
          });
          var table_container = $('<div>').addClass('snowshoe-table-container').append(table);
          var lightbox_header = $('<div><button class="minimize">Minimize</button><h3 class="snowshoe-title">My Selections</h3></div>').addClass('snowshoe-lightbox-header');
          var lightbox_footer = $('<div><div id="snowshoe-message-box"></div><div class="grouping"><input type="text" name="track_name" placeholder="Please name this track"><button class="export snowshoe">Export</button></div></div>').addClass('snowshoe-lightbox-footer');
          $(lightbox_window).append(lightbox_header);
          $(lightbox_window).append(table_container);
          $(lightbox_window).append(lightbox_footer);
          $('body').append(show_button).append(lightbox);
          $(document).on('click', select_handler); 
        }
      }
    if (request.message == "export_fail"){
      $('#snowshoe-message-box').text('You have no tracks, please add one to export!');
      $('#snowshoe-message-box').css('display', 'block');
      $(document).on('click', '.export', export_handler);
        setTimeout(function(){
          $('#snowshoe-message-box').css('display', 'none');
        }, 2000);
    }
    if (request.message == "export_success"){
      $(document).off('click', '.minimize', minimizeHandler);
      $(document).off('click', '.delete', deleteHandler)
      $('.grouping').css('display', 'none');
      $('#snowshoe-message-box').text('');
      $('#snowshoe-message-box').append('<a class="end-session">Close</a>');
      $('#snowshoe-message-box').append('<a class="see-selections" href="'+request.trackURL+'">See your selections!</a>');
      $('#snowshoe-message-box').css('display', 'block');
    }
  }
);
})();
