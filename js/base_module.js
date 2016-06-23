// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'selector': {'name': '',
               'path': '',
               'content': '',
               'comparator': 0}
}

function shorten(str, limit){
  if (str.length >= limit) {str = str.substring(0,limit) + '...'};
  return str
}

function elemId(elem){
  if ($(elem).attr('id')) return '#' + $(elem).attr('id').replace(/ +/g, ' ').replace(/ /g, '#');
}

// Removes html and body from elements in jQuery object
function filterEles(elemArray){
  return elemArray.not('body').not('html');
} 

// Return direct selector for element (using direct descendent specification)
jQuery.fn.getPath = function () {
  if (this.length != 1) throw 'Requires one element.';

  // if targeted element has id, returns id
  var root_id = elemId(this[0]);
  if (root_id) return root_id;

  var parentsEles = [];
  var elemPath = filterEles(this.parents());

  $(elemPath).each(function(index){
    var element_tag = stringifyElement(this);
    parentsEles.push(element_tag);
    if (element_tag.indexOf('#') >= 0) return false;
  });
  
  parentsEles = parentsEles.reverse();
  parentsEles.push(stringifyElement(this[0]));
  return parentsEles.join('>');
};

// Provides direct placement of element in DOM
function stringifyElement(elem){
  var root_id = elemId(elem);
  if (root_id) return root_id;

  var element_tag = elem.tagName.toLowerCase();
  var all_children = $(elem).parent().children();
  var position = $(all_children).index(elem) + 1;

  if (all_children.length > 1) {element_tag += ':nth-child(' + position + ')'}
  return element_tag;
}

function displayMessage(message){
  $('#snowshoe-message-box').text(message);
  $('#snowshoe-message-box').css('display', 'block');
}

function hideSelectionBox(){
  $('.selection_form').remove();
  scrapeResults.selector.name = '';
  scrapeResults.selector.path = '';
}

function keySelectionSubmit(e){
  if (e.keyCode == 13 && $('.check').length){
    check_handler(e);
  }
}

function removeToolbar(){
  $('.saved').removeClass('saved');
  $('.selection_name').remove();
  $('#snowshoe-show-button').remove();
  $('.snowshoe-lightbox').remove();
  changeState(6);
}

function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  var invalidTargets = ['body', 'ol', 'ul', 'html', 'img', 'input'];
  return $.inArray(targetTag, invalidTargets) >= 0 || $(target).parents('.snowshoe').length || $(target).hasClass('snowshoe') // || !$(target).text().match(/[0-9]/);
}

function addLightboxRow(target, url){
  if (!url) {var url = scrapeResults.url}
  var tr = $('<tr></tr>').data({url: url, selector:{'name': '', 'path': target.path}});
  var trash_img = chrome.extension.getURL('../config/trash.png');
  $('.display_table tbody').append(tr);
  $(tr).append('<td>'+shorten(target.name, 30)+'</td>');
  $(tr).append('<td>'+shorten(target.content, 20)+'</td>');
  $(tr).append('<td><a href="'+url+'">'+shorten(url, 30)+'</a></td>');
  $(tr).append('<td><a class="snowshoe delete"><img src="'+trash_img+'"/></a></td>');
}

function enterTrashImg(){
  var w_trash_img = chrome.extension.getURL('../config/wtrash.png');
  $(this).find('img').attr('src', w_trash_img);
}

function exitTrashImg(){
  var trash_img = chrome.extension.getURL('../config/trash.png');
  $(this).find('img').attr('src', trash_img);
}

function getPrice(string) {
  return Number(string.replace(/[^0-9.]/g, ''));
}


function changeState(state){
  // 1 -> Initialization (no lightbox, no selection box)
  // 2 -> Selection Box 

  $(document).off('click', selection_handler);
  $(document).off('click', select_handler);
  $(document).off('click', '.check', check_handler);
  $(document).off('submit', '.selection_name', check_handler);
  $(document).off('click', '.remove', remove_handler);
  $(document).off('keypress', keySelectionSubmit);
  $(document).off('mouseenter', 'a.delete', enterTrashImg);
  $(document).off('mouseleave', 'a.delete', exitTrashImg);

  if (state == 1) {
    $(document).on('click', select_handler);
  }
  if (state == 2){
    $(document).on('click', selection_handler);
    $(document).on('click', '.check', check_handler);
    $(document).on('submit', '.selection_name', check_handler);
    $(document).on('click', '.remove', remove_handler);
    $(document).on('keypress', keySelectionSubmit);
  }
}