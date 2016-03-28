const invalidTargets = ['body', 'ol', 'ul', 'html', 'img', 'input'];

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  return $.inArray(targetTag, invalidTargets) >= 0;
}

$(document).on('click', '#snowshoe-show-button', function(){
  $('#snowshoe-show-button').css('display', 'none');
  $('.snowshoe-lightbox').css('display', 'block');
  if (!($('.display_table tbody tr')).length){
    var empty_table_message = $('<div>').addClass('empty-table-message-container');
    var message = $('<h2>You have no selections!</h2>');
    $('.snowshoe-title').css('display', 'none');
    $('input[name="track_name"]').prop('disabled', true).css('cursor', 'not-allowed');
    $(empty_table_message).append(message);
    $('.snowshoe-table-container').append(empty_table_message);
    changeState(4);
    $('.export').css('background-color', '#dddddd');
  } else {
    $('.empty-table-message-container').remove();
    $('.snowshoe-title').css('display', 'block');
    $('input[name="track_name"]').prop('disabled', false).css('cursor', '')
    $('.export').css('background-color', '');
    changeState(3);
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
}

function selection_handler(){
  var targeted = $(event.target);
  if ((!$(targeted).parents('.snowshoe').length || $(targeted).hasClass('snowshoe'))){   
    if (targeted.hasClass('snowshoe-active')){
      scrapeResults.selector.name = '';
      scrapeResults.selector.path = '';
      targeted.removeClass('snowshoe-active').removeClass('saved')
      hideSelectionBox();
    }
    else {
      if (invalidClick(targeted)) return false;
      var href = targeted.attr('href');
      if (href && href[0] != '#') event.preventDefault();
      var targeted_text = $(targeted).text();
      if (targeted_text.match(/ {5,}/)) targeted_text = '';
      $('input[name="selection_name"]').val(targeted_text);
    }
  } 
}

$(document).on('mouseenter', 'a.delete', function(){
  var w_trash_img = chrome.extension.getURL('../config/wtrash.png');
  $(this).find('img').attr('src', w_trash_img);
});

$(document).on('mouseleave', 'a.delete', function(){
  var trash_img = chrome.extension.getURL(' ../config/trash.png');
  $(this).find('img').attr('src', trash_img);
});


  