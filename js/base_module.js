// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'protocol': getProtocol(),
  'track_name': '',
  'scrapes': []
}

// Returns whether extension is on http or https site (or other?)
function getProtocol(){
  var tab_path = window.location.href;
  return tab_path.split(':')[0]
}

// Actual scraping function, takes html selector and scrapes all content in those selectors
function scrapeDetails(path){
  var details = {
    'path': path,
    'elemContents': []
  }
  $(path).each(function(i, ele){
    details.elemContents.push($(ele).text());
  });
  scrapeResults.scrapes.push(details);
}

// Returns selector for all similar elements 
function selectSame(elem){
  var parentsEles = [];
  var elemPath = filterEles(elem.parents());
  $(elemPath).addBack().each(function() {
    var entry = stringifyElement(this);
    parentsEles.push(entry);
  });
  parentsEles.push(stringifyElement(elem[0]));
  return parentsEles.join(" ");
}

// Converts jQuery representation of element to stringified version 
function stringifyElement(elem){
  var entry = elem.tagName.toLowerCase();
  if (elem.className) {
    entry += "." + elem.className.replace(/ /g, '.');
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
  var parentsEles = [];
  var elemPath = filterEles(this.parents());
  $(elemPath).addBack().each(function(){
    parentsEles.push(stringifyDirectElement(this));
  });
  parentsEles.push(stringifyDirectElement(this[0]));
  return parentsEles.join('>');
};

// Provides direct placement of element in DOM
function stringifyDirectElement(elem){
  var position = $(elem).index();
  if ($(elem).siblings().length > 1){
    return stringifyElement(elem) + ':eq(' + position + ')' 
  } else {
    return stringifyElement(elem);
  }
}