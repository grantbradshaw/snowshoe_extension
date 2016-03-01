(function(){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.message === "clicked_browser_action" ) {
        if ($('#snowshoe-show-button').length || $('.snowshoe-lightbox').length){
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
          var show_img = $('<img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-arrow-right-b-128.png"/>');
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
              $(tr).append('<td><p class="delete snowshoe">X</p></td>');
            })
          });
          var table_container = $('<div>').addClass('snowshoe-table-container').append(table);
          var lightbox_header = $('<div><h3>My Selections</h3><button class="minimize">Minimize</button></div>').addClass('snowshoe-lightbox-header');
          var lightbox_footer = $('<div><input type="text" name="track_name" placeholder="Please name this track"><button class="export snowshoe">Export</button></div>').addClass('snowshoe-lightbox-footer');
          $(lightbox_window).append(lightbox_header);
          $(lightbox_window).append(table_container);
          $(lightbox_window).append(lightbox_footer);
          $('body').append(show_button).append(lightbox);
          $(document).on('click', select_handler); 
          $(document).on('click', '.export', export_handler);
        }
      }
    if (request.message == "export_fail"){
      //$('#snowshoe-message-box').text('You have no tracks, please add one to export!');
      alert("You have no tracks, please add one to export!");
      $(document).on('click', select_handler);
      $(document).on('click', '.display', display_handler);
    }
    if (request.message == "export_success"){
      $('#snowshoe-message-box').text('Success!');
      $('input[name="track_name"]').remove();
      $('button.send').remove();
      setTimeout(function(){
        removeToolbar();
      }, 2000);
    }
  }
);
})();
