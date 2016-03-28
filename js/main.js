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
          var lightbox = $('<div>').addClass('snowshoe-lightbox snowshoe');
          var lightbox_window = $('<div>').addClass('snowshoe-window showshoe');
          $(lightbox).append(lightbox_window);
          $(show_button).append(show_img);
          var table = $('<table></table>').addClass('snowshoe').addClass('display_table');
          $(table).append('<thead><tr><th>Name</th><th>Content</th><th>Source</th><th>Delete</tr></thead>');
          var tbody = $('<tbody></tbody>');
          $(table).append(tbody);
          var table_container = $('<div>').addClass('snowshoe-table-container').append(table);
          var lightbox_header = $('<div><button class="minimize">Minimize</button><h3 class="snowshoe-title">My Selections</h3></div>').addClass('snowshoe-lightbox-header');
          var lightbox_footer = $('<div><div id="snowshoe-message-box"></div><div class="grouping"><input type="text" name="track_name" placeholder="Please name this track"><button class="export snowshoe">Export</button></div></div>').addClass('snowshoe-lightbox-footer');
          $(lightbox_window).append(lightbox_header);
          $(lightbox_window).append(table_container);
          $(lightbox_window).append(lightbox_footer);
          $('body').append(show_button).append(lightbox);

          $.each(request.tracks.pages, function(key, value){ 
            $.each(value, function(index, value){
              addLightboxRow(value, key);
            })
          });
          changeState(1);
        }
      }
    if (request.message == "export_fail"){
      changeState(3);
      displayMessage("We're sorry, something went wrong.");
      setTimeout(function(){
        if ($('#snowshoe-message-box').text() == "We're sorry, something went wrong."){
          $('#snowshoe-message-box').css('display', 'none');
        }
      }, 2000);
    }
    if (request.message == "export_success"){
      changeState(5);
      displayMessage('');
      $('.grouping').css('display', 'none');
      $('#snowshoe-message-box').append('<a class="end-session">Close</a>');
      $('#snowshoe-message-box').append('<a class="see-selections" href="'+request.trackURL+'">See your selections!</a>');
    }
  }
);
})();
