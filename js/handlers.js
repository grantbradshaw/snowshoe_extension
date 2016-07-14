'use strict';

var handlers = {};
// general selection of prices
handlers.select_handler = function select_handler(event){
  var targeted = $(event.target);
  var pathToSelected;

  if (helpers.invalidClick(targeted)) return;

  var href = targeted.attr('href');
  if (href && href[0] != '#') return; 

  if (targeted.hasClass('saved') && event.altKey) {
    pathToSelected = targeted.getPath();
    $(targeted).removeClass('saved');
    scrapeResults.selector.path = pathToSelected;
    // chrome.runtime.sendMessage({"message": "data_delete", "data": scrapeResults});

    var trs = $('.display_table tbody tr');
    $.each(trs, function(index, tr){
      if (scrapeResults.selector.path == $(tr).data().selector.path){
        $(tr).remove();
      }
    });
    scrapeResults.selector.name = '';
    scrapeResults.selector.path = '';
  } else if (event.altKey) {
    // inhibit selection of non-price containing element
    pathToSelected = targeted.getPath();
    $(targeted).addClass('saved').addClass('snowshoe-active');
    scrapeResults.selector.path = pathToSelected;
    scrapeResults.selector.content = $(targeted).text();

    var selection_form = $('<form>').addClass('snowshoe').addClass('selection_form'); 

    var selection_field = $('<p>').addClass('snowshoe-p-tag');
    var selection_label = $('<label>').text('Name').addClass('snowshoe-label');
    var selection_input = $('<input type="text" name="selection_name" placeholder="Click the name of this item">');
    $(selection_field).append(selection_label).append(selection_input);

    var comparator_field = $('<p>').addClass('snowshoe-p-tag');
    var comparator_label = $('<label>').text('Target $').addClass('snowshoe-label');
    var comparator_input = $('<input type="number" name="comparator" min="0">');
    $(comparator_field).append(comparator_label).append(comparator_input);

    var image_container = $('<p>').addClass('snowshoe-p-tag');
    var x_icon = chrome.extension.getURL('../config/x.png');
    var x_image = $('<img src="'+x_icon+'"/>').addClass('remove');
    var check_icon = chrome.extension.getURL('../config/check.png');
    var check_image = $('<input type="image" src="'+check_icon+'" alt="Submit"/>').addClass('check');
    $(image_container).append(x_image).append(check_image);
    
    $(selection_form).append(selection_field).append(comparator_field).append(image_container);
    // $(targeted).after(selection_form);
    $('body').append(selection_form);
    $('input[name="selection_name"]').focus();
    helpers.changeState(2);
  }
};

// for naming or deselecting price
handlers.selection_handler = function selection_handler(){
  var targeted = $(event.target);
  // console.log(targeted);
  if (targeted.hasClass('snowshoe-active')){
    targeted.removeClass('snowshoe-active').removeClass('saved');
    helpers.hideSelectionBox();
    helpers.changeState(1);
  } else {
    if (helpers.invalidClick(targeted)) return false;

    var href = targeted.attr('href');
    if (href && href[0] != '#') event.preventDefault();
    
    var targeted_text = $(targeted).text();
    // if (targeted_text.match(/ {5,}/)) targeted_text = ''; 
    targeted_text = targeted_text.replace(/^\s+|\s+$/g, '');
    if (targeted_text) $('input[name="selection_name"]').val(targeted_text);
  }
};

// for accepting selection
handlers.check_handler = function check_handler(e){
  e.preventDefault();
  var comparison_price = $('input[name="comparator"]').val();
  $('input[name="comparator"]').css('border', '2px solid #2C3E50');
  $('input[name="selection_name"]').css('border', '2px solid #2C3E50');
  var error = false;

  if (!comparison_price) {
    $('input[name="comparator"]').css('border', '2px solid red').attr('placeholder', 'Field is required');
    error = true;
  }

  if (!($('input[name="selection_name"]').val())) {
    $('input[name="selection_name"]').css('border', '2px solid red').attr('placeholder', 'Field is required');
    error = true;
  }

  if (comparison_price >= helpers.getPrice(scrapeResults.selector.content)) {
    $('input[name="comparator"]').val('');
    $('input[name="comparator"]').css('border', '2px solid red').attr('placeholder', 'Must be less than item price');
    error = true;
  }

  if (comparison_price <= 0) {
    $('input[name="comparator"]').val('');
    $('input[name="comparator"]').css('border', '2px solid red').attr('placeholder', 'Must be greater than 0');
    error = true;
  }

  if (error) {
    return false;
  }
  scrapeResults.selector.name = $('input[name="selection_name"]').val();
  scrapeResults.selector.comparator = comparison_price;
  helpers.addLightboxRow(scrapeResults.selector);
  $('.snowshoe-active').removeClass('snowshoe-active');
  chrome.runtime.sendMessage({"message": "data_export", "data": scrapeResults});

  scrapeResults.selector.name = '';
  scrapeResults.selector.path = '';
  helpers.hideSelectionBox();
  helpers.changeState(1);
};

// for cancelling selection
handlers.remove_handler = function remove_handler(){
  $('.snowshoe-active').removeClass('snowshoe-active').removeClass('saved');
  helpers.hideSelectionBox();
  helpers.changeState(1);
};