// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'selector': {'name': '',
               'path': '',
               'content': ''}
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