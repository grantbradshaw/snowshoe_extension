const invalidTargets = ['body', 'ol', 'ul', '.display_table'];

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  return $.inArray(targetTag, invalidTargets) >= 0 || target.hasClass('snowshoe') || target.parents('.snowshoe').length;
}

function removeToolbar(){
  $('#snowshoe-toolbar-wrapper').remove();
  $('.selected').removeClass('selected');
  $('.general').removeClass('general');
  $('.saved').removeClass('saved');
  $(document).off('click', select_handler);
  $('body').removeClass('snowshoe-active-body');
}

function addToolbar(){
  var frame = $('<div>').attr('id', 'snowshoe-toolbar-wrapper');
  $('body').addClass('snowshoe-active-body').prepend(frame);
  $(document).on('click', select_handler);
}

function removeDetails(path){
  scrapeResults.scrapes.forEach(function(scrape, i){
    if (scrape.path === path) {
      scrapeResults.scrapes.splice(i, 1);
    }
  });
}

$(document).on('click', '.generalize', function(){
  if ($('.selected').length > 1){
    $('.selected').removeClass('selected').addClass('general');
    $('.root').addClass('selected');
  } else {
    $('.general').removeClass('general').addClass('selected');
  }
});

$(document).on('click', '.display', function(){
  chrome.runtime.sendMessage({"message": "data_index"});
  // output is handled in main.js with listener
})

$(document).on('click', '.save', function(){
  var rootSelect = $('.root:first');
  if ($('.selected').length > 1) {
    var pathToSelected = selectSame(rootSelect);
  } else {
    var pathToSelected = rootSelect.getPath();
  }
  scrapeResults.selector.path = pathToSelected;
  scrapeResults.selector.name = prompt("What is the name of this selection?")
  chrome.runtime.sendMessage({"message": "data_save", "data": scrapeResults});
  $('.save').remove();
  $('.generalize').remove();
  $('.root').removeClass('root');
  $('.selected').removeClass('selected').addClass('saved');
  $('.general').removeClass('general');
});

function select_handler(event){
  var targeted = $(event.target);
  if (invalidClick(targeted)) return false;

  if ($('#snowshoe-toolbar-wrapper .generalize').length > 0 && !targeted.hasClass('generalize')){
    return false
  } else if (targeted.hasClass('saved')) {
    var pathToSelected = targeted.getPath();
    $(targeted).removeClass('saved');
    scrapeResults.selector.path = pathToSelected;
    chrome.runtime.sendMessage({"message": "data_delete", "data": scrapeResults});
    scrapeResults.selector.name = '';
    scrapeResults.selector.path = '';
  } else {
    var pathToSelected = targeted.getPath();
    $(targeted).addClass('saved');
    scrapeResults.selector.path = pathToSelected;
    scrapeResults.selector.name = prompt('What is the name of this selector?');
    chrome.runtime.sendMessage({"message": "data_save", "data": scrapeResults});
    scrapeResults.selector.name = '';
    scrapeResults.selector.path = '';
    // targeted.addClass('selected').addClass('root');
    // var button_generalize = $('<button type="button" class="generalize snowshoe">Generalize</button>');
    //$(button_generalize).appendTo('#snowshoe-toolbar-wrapper');
    // var button_save = $('<button type="button" class="save snowshoe">Save</button>');
    //$(button_save).appendTo('#snowshoe-toolbar-wrapper');
  }
}

function removeDetails(path){
  scrapeResults.scrapes.forEach(function(scrape, i){
    if (scrape.path === path) {
      scrapeResults.scrapes.splice(i, 1);
    }
  });
}



  