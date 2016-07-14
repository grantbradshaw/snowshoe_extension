'use strict';

// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'selector': {'name': '',
               'path': '',
               'content': '',
               'comparator': 0}
};

var helpers = {};

helpers.shorten = function shorten(str, limit){
  if (str.length >= limit) {str = str.substring(0,limit) + '...';}
  return str;
};

helpers.elemId = function elemId(elem){
  if ($(elem).attr('id')) return '#' + $(elem).attr('id').replace(/ +/g, ' ').replace(/ /g, '#');
};

// Removes html and body from elements in jQuery object
helpers.filterEles = function filterEles(elemArray){
  return elemArray.not('body').not('html');
};

// Return direct selector for element (using direct descendent specification)
jQuery.fn.getPath = function () {
  if (this.length != 1) throw 'Requires one element.';

  // if targeted element has id, returns id
  var root_id = helpers.elemId(this[0]);
  if (root_id) return root_id;

  var parentsEles = [];
  var elemPath = helpers.filterEles(this.parents());

  $(elemPath).each(function(index){
    var element_tag = helpers.stringifyElement(this);
    parentsEles.push(element_tag);
    if (element_tag.indexOf('#') >= 0) return false;
  });
  
  parentsEles = parentsEles.reverse();
  parentsEles.push(helpers.stringifyElement(this[0]));
  return parentsEles.join('>');
};

// Provides direct placement of element in DOM
helpers.stringifyElement = function stringifyElement(elem){
  var root_id = helpers.elemId(elem);
  if (root_id) return root_id;

  var element_tag = elem.tagName.toLowerCase();
  var all_children = $(elem).parent().children();
  var position = $(all_children).index(elem) + 1;

  if (all_children.length > 1) {element_tag += ':nth-child(' + position + ')';}
  return element_tag;
};

helpers.displayMessage = function displayMessage(message){
  $('#snowshoe-message-box').text(message);
  $('#snowshoe-message-box').css('display', 'block');
};

helpers.hideSelectionBox = function hideSelectionBox(){
  $('.selection_form').remove();
  scrapeResults.selector.name = '';
  scrapeResults.selector.path = '';
};

helpers.keySelectionSubmit = function keySelectionSubmit(e){
  if (e.keyCode == 13 && $('.check').length){
    handlers.check_handler(e);
  }
};

helpers.removeToolbar = function removeToolbar(){
  $('.saved').removeClass('saved');
  $('.selection_name').remove();
  $('#snowshoe-show-button').remove();
  $('.snowshoe-lightbox').remove();
  helpers.changeState(6);
};

helpers.invalidClick = function invalidClick(target){
  var targetTag = target.prop("tagName").toLowerCase();
  var invalidTargets = ['body', 'ol', 'ul', 'html', 'img', 'input'];
  return $.inArray(targetTag, invalidTargets) >= 0 || $(target).parents('.snowshoe').length || $(target).hasClass('snowshoe');
};

helpers.addLightboxRow = function addLightboxRow(target, url){
  if (!url) {url = scrapeResults.url;}
  var tr = $('<tr></tr>').data({url: url, selector:{'name': '', 'path': target.path}});
  var trash_img = chrome.extension.getURL('../config/trash.png');
  $('.display_table tbody').append(tr);
  $(tr).append('<td>'+helpers.shorten(target.name, 30)+'</td>');
  $(tr).append('<td>'+helpers.shorten(target.content, 20)+'</td>');
  $(tr).append('<td><a href="'+url+'">'+helpers.shorten(url, 30)+'</a></td>');
  $(tr).append('<td><a class="snowshoe delete"><img src="'+trash_img+'"/></a></td>');
};

helpers.enterTrashImg = function enterTrashImg(){
  var w_trash_img = chrome.extension.getURL('../config/wtrash.png');
  $(this).find('img').attr('src', w_trash_img);
};

helpers.exitTrashImg = function exitTrashImg(){
  var trash_img = chrome.extension.getURL('../config/trash.png');
  $(this).find('img').attr('src', trash_img);
};

helpers.getPrice = function getPrice(string) {
  return Number(string.replace(/[^0-9.]/g, ''));
};


helpers.changeState = function changeState(state){
  // 1 -> Initialization (no lightbox, no selection box)
  // 2 -> Selection Box 

  $(document).off('click', handlers.selection_handler);
  $(document).off('click', handlers.select_handler);
  $(document).off('click', '.check', handlers.check_handler);
  $(document).off('submit', '.selection_name', handlers.check_handler);
  $(document).off('click', '.remove', handlers.remove_handler);
  $(document).off('keypress', helpers.keySelectionSubmit);
  $(document).off('mouseenter', 'a.delete', helpers.enterTrashImg);
  $(document).off('mouseleave', 'a.delete', helpers.exitTrashImg);

  if (state == 1) {
    $(document).on('click', handlers.select_handler);
  }
  if (state == 2){
    $(document).on('click', handlers.selection_handler);
    $(document).on('click', '.check', handlers.check_handler);
    $(document).on('submit', '.selection_name', handlers.check_handler);
    $(document).on('click', '.remove', handlers.remove_handler);
    $(document).on('keypress', helpers.keySelectionSubmit);
  }
};