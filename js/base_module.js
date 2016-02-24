// Main container for scraping results, to be exported to server later
var scrapeResults = {
  'url': window.location.href,
  'selector': {'name': '',
               'path': ''}
}

// Actual scraping function, takes html selector and scrapes all content in those selectors
// function scrapeDetails(path){
//   var details = {
//     'path': path,
//     'elemContents': []
//   }
//   $(path).each(function(i, ele){
//     details.elemContents.push($(ele).text());
//   });
//   scrapeResults.scrapes.push(details);
// }

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
    var className = elem.className.replace(/ +/g, ' ');
    entry += "." + className.replace(/ /g, '.');
  }
  if ($(elem).attr('id')){
    var idName = $(elem).attr('id').replace(/ +/g, ' ');
    entry += "#" + idName.replace(/ /g, '#')
  }
  entry = entry.replace(/\.selected/g, '');
  entry = entry.replace(/\.root/g, '');
  entry = entry.replace(/\.general/g, '');
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
  var first_element = true;
  $(elemPath).addBack().each(function(){
    parentsEles.push(stringifyDirectElement(this, first_element));
    first_element = false;
  });
  parentsEles.push(stringifyDirectElement(this[0]));
  console.log(parentsEles[0]);
  return parentsEles.join(' ');
};

// Provides direct placement of element in DOM
function stringifyDirectElement(elem, first_element){
  var element_tag = elem.tagName.toLowerCase();
  var siblings = $(elem).parent().children();
  var position = $(siblings).index(elem) + 1;
  if (first_element) position -= 1;
  //var position = $(elem).index() + 1;
  if ($(elem).siblings().length > 1){
    return element_tag + ':nth-child(' + position + ')' 
  } else {
    return element_tag;
  }
}