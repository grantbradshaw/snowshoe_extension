const invalidTargets = ['body', 'ol', 'ul', 'html', 'img', 'input'];

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  return $.inArray(targetTag, invalidTargets) >= 0;
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
    if (targeted.hasClass('snowshoe-active')){3
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


  