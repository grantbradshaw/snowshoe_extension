const invalidTargets = ['body', 'ol', 'ul', 'html'];

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  return $.inArray(targetTag, invalidTargets) >= 0;
}

function removeToolbar(){
  $('.saved').removeClass('saved');
  $(document).off('click', selection_handler);
  $(document).off('click', select_handler);
  $(document).off('click', '.export', export_handler);
  $('.selection_name').remove();
  $('#snowshoe-show-button').remove();
  $('.snowshoe-lightbox').remove();
}

function display_handler(){
  chrome.runtime.sendMessage({"message": "data_index"});
  // output is handled in main.js with listener
}

$(document).on('click', '.delete', function(){
  var tr = $(this).parents('tr');
  tr = tr.first();
  chrome.runtime.sendMessage({"message": "data_delete", "data": $(tr).data()});
  if (window.location.href == $(tr).data().url){
    var path_to_deleted = $(tr).data().selector.path;
    $(path_to_deleted).removeClass('saved');
  }
  $(tr).remove();
});

$(document).on('click', '.minimize', function(){
  $('.snowshoe-lightbox').css('display', 'none');
  $('#snowshoe-show-button').css('display', 'block');
});


$(document).on('click', '#snowshoe-show-button', function(){
  $('#snowshoe-show-button').css('display', 'none');
  $('.snowshoe-lightbox').css('display', 'block');
});

function select_handler(event){
  var targeted = $(event.target);
  if ($(targeted).parents('.snowshoe').length || $(targeted).hasClass('snowshoe')){
    
  } else {
    if (invalidClick(targeted)) return false;
    if (targeted.prop("tagName").toLowerCase() === 'a') event.preventDefault(); 

    if (targeted.hasClass('saved')) {
      var pathToSelected = targeted.getPath();
      $(targeted).removeClass('saved');
      scrapeResults.selector.path = pathToSelected;
      chrome.runtime.sendMessage({"message": "data_delete", "data": scrapeResults});

      var trs = $('.display_table tbody tr');
      $.each(trs, function(index, tr){
        if (scrapeResults.selector.path == $(tr).data().selector.path){
          $(tr).remove();
        }
      });

      scrapeResults.selector.name = '';
      scrapeResults.selector.path = '';
    } else {
      var pathToSelected = targeted.getPath();
      $(targeted).addClass('saved');
      scrapeResults.selector.path = pathToSelected;
      scrapeResults.selector.content = $(targeted).text()

      var selection_name = $('<div>').addClass('snowshoe').addClass('selection_name');
      var save_image = $('<img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/011_yes-128.png"/>').addClass('check');
      var selection_input = $('<input type="text" name="selection_name">');
      $(selection_name).append(selection_input).append(save_image);
      $(targeted).after(selection_name);
      $(document).off('click', select_handler);
      $(document).on('click', selection_handler);
      $(document).on('click', '.check', check_handler);
    }
  } 
}

function selection_handler(){
  var targeted = $(event.target);
  if ($(targeted).parents('.snowshoe').length || $(targeted).hasClass('snowshoe')){
    
  } else {
    if (invalidClick(targeted)) return false;
    if (targeted.prop("tagName").toLowerCase() === 'a') event.preventDefault();
    var targeted_text = $(targeted).text();
    $('input[name="selection_name"]').val(targeted_text);
  }
}

function check_handler(){
  console.log($('input[name="selection_name]"'))
  scrapeResults.selector.name = $('input[name="selection_name"]').val();
  var tr = $('<tr></tr>').data({url: scrapeResults.url, selector:{'name': '', 'path': scrapeResults.selector.path}});
  $('.display_table tbody').append(tr);
  $(tr).append('<td>'+shorten(scrapeResults.selector.name, 30)+'</td>');
  $(tr).append('<td>'+shorten(scrapeResults.selector.content, 20)+'</td>');
  $(tr).append('<td><a href="'+scrapeResults.url+'">'+shorten(scrapeResults.url, 30)+'</a></td>');
  $(tr).append('<td><span class="delete snowshoe">X</span></td>');
  $('.selection_name').remove();

  chrome.runtime.sendMessage({"message": "data_save", "data": scrapeResults});
  scrapeResults.selector.name = '';
  scrapeResults.selector.path = '';
  $(document).off('click', selection_handler);
  $(document).off('click', '.check', check_handler);
  $(document).on('click', select_handler);
}

// function export_handler(){
//   if ($('button.send').length){
//     $('input[name="track_name"]').remove();
//     $('button.send').remove();
//     $('#snowshoe-message-box').text('');
//     $(document).on('click', select_handler);
//     $(document).on('click', '.display', display_handler);
//   } else {
//     $('.display_table').remove();
//     $('.selection_name').remove();
//     $(scrapeResults.selector.path).removeClass('saved');
//     var track_name = $('<input type="text" name="track_name">').addClass('snowshoe');
//     var send_button = $('<button type="button" class="send snowshoe">Export</button>');
//     $('body').append(track_name).append(send_button);
//     $('#snowshoe-message-box').text('Please name this track!');
//     $(document).off('click', selection_handler);
//     $(document).off('click', select_handler);
//     $(document).off('click', '.display', display_handler);
//   }
// }

// $(document).on('click', '.send', function(){
//   var trackName = $('input[name="track_name"]').val();
//   if (trackName){
//     $("#snowshoe-message-box").text('');
//     $('input[name="track_name"]').remove();
//     $('button.send').remove();
//     chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults, "trackName": trackName });
//   } else {
//     $("#snowshoe-message-box").text("You must name this track");
//   }
// });

function export_handler(){
  var trackName = $('input[name="track_name"]').val();
  if (trackName){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults, "trackName": trackName });
  } else {
    alert("You must name this track");
  }
}


  