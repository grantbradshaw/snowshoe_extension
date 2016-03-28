// main arrow button
function snowshoeHandler(){
  $('#snowshoe-show-button').css('display', 'none');
  $('.snowshoe-lightbox').css('display', 'block');
  hideSelectionBox();
  $('.snowshoe-active').removeClass('snowshoe-active').removeClass('saved');
  if (!($('.display_table tbody tr').length)){
    var empty_table_message = $('<div>').addClass('empty-table-message-container');
    var message = $('<h2>You have no selections!</h2>');
    $(empty_table_message).append(message);
    $('.snowshoe-table-container').append(empty_table_message);
    changeState(4);
  } else {
    $('.empty-table-message-container').remove();
    changeState(3);
  }
}

// general selection of prices
function select_handler(event){
  var targeted = $(event.target);

  if (invalidClick(targeted)) return;

  var href = targeted.attr('href');
  if (href && href[0] != '#') return; 

  if (targeted.hasClass('saved') && event.altKey) {
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
  } else if (event.altKey) {
    var pathToSelected = targeted.getPath();
    $(targeted).addClass('saved').addClass('snowshoe-active');
    scrapeResults.selector.path = pathToSelected;
    scrapeResults.selector.content = $(targeted).text()

    var selection_name = $('<div>').addClass('snowshoe').addClass('selection_name');

    var check_icon = chrome.extension.getURL('../config/check.png');
    var save_image = $('<img src="'+check_icon+'"/>').addClass('check');
    var x_icon = chrome.extension.getURL('../config/x.png');
    var x_icon = $('<img src="'+x_icon+'"/>').addClass('remove');
    
    var selection_input = $('<input type="text" name="selection_name">');
    $(selection_name).append(selection_input).append(x_icon).append(save_image);
    $(targeted).after(selection_name);
    $('input[name="selection_name"]').focus();
    changeState(2);
  }
}

// for naming or deselecting price
function selection_handler(){
  var targeted = $(event.target);
  if (targeted.hasClass('snowshoe-active')){
    targeted.removeClass('snowshoe-active').removeClass('saved');
    hideSelectionBox();
    changeState(1);
  } else {
    if (invalidClick(targeted)) return false;

    var href = targeted.attr('href');
    if (href && href[0] != '#') event.preventDefault();
    
    var targeted_text = $(targeted).text();
    if (targeted_text.match(/ {5,}/)) targeted_text = '';
    $('input[name="selection_name"]').val(targeted_text);
  }
} 

// for accepting selection
function check_handler(){
  scrapeResults.selector.name = $('input[name="selection_name"]').val();
  addLightboxRow(scrapeResults.selector);
  $('.snowshoe-active').removeClass('snowshoe-active');
  chrome.runtime.sendMessage({"message": "data_save", "data": scrapeResults});
  scrapeResults.selector.name = '';
  scrapeResults.selector.path = '';
  hideSelectionBox();
  changeState(1);
}

// for cancelling selection
function remove_handler(){
  $('.snowshoe-active').removeClass('snowshoe-active').removeClass('saved');
  hideSelectionBox();
  changeState(1);
}

function minimizeHandler(){
  $('.snowshoe-lightbox').css('display', 'none');
  $('#snowshoe-show-button').css('display', 'block');
  $('input[name="track_name"]').val('');
  changeState(1);
}

// for deleting selections
function deleteHandler(){
  var tr = $(this).parents('tr');
  tr = tr.first();
  chrome.runtime.sendMessage({"message": "data_delete", "data": $(tr).data()});
  if (window.location.href == $(tr).data().url){
    var path_to_deleted = $(tr).data().selector.path;
    $(path_to_deleted).removeClass('saved');
  }
  $(tr).remove();
  if (!($('.display_table tbody tr').length)) { changeState(4) }
}

function export_handler(){
  var trackName = $('input[name="track_name"]').val();
  if (trackName){
    chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults, "trackName": trackName });
  } else {
    displayMessage('You must name this track')
    setTimeout(function(){
      if ($('#snowshoe-message-box').text() == 'You must name this track'){
        $('#snowshoe-message-box').css('display', 'none');
      }
    }, 2000);
  }
}