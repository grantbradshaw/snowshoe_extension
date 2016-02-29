// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'selector': {'name': '',
               'path': '',
               'content': ''}
}

function shorten(str, limit){
  if (str.length > limit) {str = str.substring(0,limit) + '...'};
  return str
}

function stringifyElement(elem){
  var entry = elem.tagName.toLowerCase();
  if ($(elem).attr('id')){
    var idName = $(elem).attr('id').replace(/ +/g, ' ');
    return "#" + idName.replace(/ /g, '#')
  }
  return entry
}

// Removes html and body from elements in jQuery object
function filterEles(elemArray){
  return elemArray.not('body').not('html');
} 

// Return direct selector for element (using direct descendent specification)
jQuery.fn.getPath = function () {
  if (this.length != 1) throw 'Requires one element.';
  if (stringifyElement(this[0]).indexOf('#') >= 0) return stringifyElement(this[0]);
  var parentsEles = [];
  var elemPath = filterEles(this.parents());
  var parents_length = elemPath.length;
  $(elemPath).each(function(index){
    var element_tag = stringifyDirectElement(this);
    parentsEles.push(element_tag);
    if (element_tag.indexOf('#') >= 0) return false;
  });
  parentsEles = parentsEles.reverse();
  parentsEles.push(stringifyDirectElement(this[0]));
  return parentsEles.join('>');
};

// Provides direct placement of element in DOM
function stringifyDirectElement(elem){
  var id_ele = stringifyElement(elem)
  if (id_ele.indexOf('#') >= 0){
    return id_ele
  }
  var element_tag = elem.tagName.toLowerCase();
  var siblings = $(elem).parent().children();
  var position = $(siblings).index(elem) + 1;
  if (siblings.length > 1){
    return element_tag + ':nth-child(' + position + ')' 
  } else {
    return element_tag;
  }
}