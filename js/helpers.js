const invalidTargets = ['body', 'div', 'section', 'article', 'header', 'html', 'ol', 'ul'];

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  return $.inArray(targetTag, invalidTargets) >= 0 || target.hasClass('snowshoe');
}

function removeToolbar(){
  $('#snowshoe-toolbar-wrapper').remove();
  $('.selected').removeClass('selected');
  $('.general').removeClass('general');
  $('.saved').removeClass('saved');
  $(document).off('click', select_handler);
  $('body').removeClass('snowshoe-active-body');
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

$(document).on('click', '.save', function(){
  var rootSelect = $('.root:first');
  if ($('.selected').length > 1) {
    var pathToSelected = selectSame(rootSelect);
  } else {
    var pathToSelected = rootSelect.getPath();
  }
  scrapeResults.selectors.push(pathToSelected);
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
    return false
  } else {
    var pathToSimilar = selectSame(targeted);
    $(pathToSimilar).addClass('general');
    targeted.addClass('selected').addClass('root');
    var button_generalize = $('<button type="button" class="generalize snowshoe">Generalize</button>');
    $(button_generalize).appendTo('#snowshoe-toolbar-wrapper');
    var button_save = $('<button type="button" class="save snowshoe">Save</button>');
    $(button_save).appendTo('#snowshoe-toolbar-wrapper');
  }
}

function removeDetails(path){
  scrapeResults.scrapes.forEach(function(scrape, i){
    if (scrape.path === path) {
      scrapeResults.scrapes.splice(i, 1);
    }
  });
}



  