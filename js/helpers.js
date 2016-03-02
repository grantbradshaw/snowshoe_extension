const invalidTargets = ['body', 'ol', 'ul', 'html', 'img', 'input'];

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

$(document).on('click', '.delete', function(){
  var tr = $(this).parents('tr');
  tr = tr.first();
  chrome.runtime.sendMessage({"message": "data_delete", "data": $(tr).data()});
  if (window.location.href == $(tr).data().url){
    var path_to_deleted = $(tr).data().selector.path;
    $(path_to_deleted).removeClass('saved');
  }
  $(tr).remove();
  if (!($('.display_table tbody tr').length)){
    $(document).off('click', '.export', export_handler);
    $('.export').css('background-color', '#dddddd');
    $('input[name="track_name"]').css('display', 'none');
  }
});

$(document).on('click', '.minimize', function(){
  $('.snowshoe-lightbox').css('display', 'none');
  $('#snowshoe-show-button').css('display', 'block');
  $('input[name="track_name"]').val('');
  $(document).off('mousewheel', stopBodyScroll);
});


$(document).on('click', '#snowshoe-show-button', function(){
  $('#snowshoe-show-button').css('display', 'none');
  $('.snowshoe-lightbox').css('display', 'block');
  $(document).on('mousewheel', stopBodyScroll);
  if (!($('.display_table tbody tr')).length){
    var empty_table_message = $('<div>').addClass('empty-table-message-container');
    var message = $('<h2>You have no selections!</h2>');
    $('.snowshoe-title').css('display', 'none');
    $('input[name="track_name"]').css('display', 'none');
    $(empty_table_message).append(message);
    $('.snowshoe-table-container').append(empty_table_message);
    $(document).off('click', '.export', export_handler);
    $('.export').css('background-color', '#dddddd');
  } else {
    $('.empty-table-message-container').remove();
    $('.snowshoe-title').css('display', 'block');
    $('input[name="track_name"]').css('display', 'block');
    $('.export').css('background-color', '');
    $(document).on('click', '.export', export_handler);
  }
});

function stopBodyScroll(event) {
  if (!($(event.target).hasClass('snowshoe-table-container'))) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function select_handler(event){
  var targeted = $(event.target);
  if ($(targeted).parents('.snowshoe').length || $(targeted).hasClass('snowshoe')){
    
  } else {
    if (invalidClick(targeted)) return;
    var href = targeted.attr('href');
    if (href && href[0] != '#') return; 

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

      var check_icon = chrome.extension.getURL('../config/check.png');
      var save_image = $('<img src="'+check_icon+'"/>').addClass('check');
      
      var selection_input = $('<input type="text" name="selection_name">');
      $(selection_name).append(selection_input).append(save_image);
      $(targeted).after(selection_name);
      $('input[name="selection_name"]').focus();
      $(document).off('click', select_handler);
      $(document).on('click', selection_handler);
      $(document).on('click', '.check', check_handler);
    }
  } 
}

$(document).on('keypress', function(e){
  if (e.keyCode == 13 && $('.check').length){
    check_handler(e);
  }
});

function selection_handler(){
  var targeted = $(event.target);
  if ((!$(targeted).parents('.snowshoe').length || $(targeted).hasClass('snowshoe'))){   
    if (invalidClick(targeted)) return false;
    var href = targeted.attr('href');
    if (href && href[0] != '#') event.preventDefault();
    var targeted_text = $(targeted).text();
    $('input[name="selection_name"]').val(targeted_text);
  } 
}

function check_handler(){
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

function export_handler(){
  var trackName = $('input[name="track_name"]').val();
  if (trackName){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults, "trackName": trackName });
  } else {
    $('#snowshoe-message-box').text('You must name this track');
    $('#snowshoe-message-box').css('display', 'block');
    setTimeout(function(){
      $('#snowshoe-message-box').css('display', 'none');
    }, 2000);
  }
}


  