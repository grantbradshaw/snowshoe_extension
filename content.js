(function(){
  const invalidTargets = ['body', 'div', 'section', 'article', 'header', 'html', 'ol', 'ul'];

  $(document).on('click', function(event){
    var targeted = $(event.target);
    if (invalidClick(targeted)) return false;

    if (targeted.hasClass('selected')){
      // Need to define a pathToSelected that accounts for specificity and generalizability
      $(pathToSelected).removeClass('selected');
      removeDetails(pathToSelected);
      console.log(scrapeResults);
    } else {
      var generalize = prompt("Should we select all elements like this one?");
      
      if (generalize === 'yes'){
        var pathToSelected = selectSame(targeted);
      } else {
        var pathToSelected = targeted.getPath();
      }

      $(pathToSelected).addClass('selected');
      scrapeDetails(pathToSelected);
      console.log(scrapeResults);
    }
  });

  function invalidClick(target){
    var targetTag = target.prop("tagName").toLowerCase();
    return $.inArray(targetTag, invalidTargets) >= 0 || target.hasClass('snowshoe');
  }

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

  function removeDetails(path){
    scrapeResults.scrapes.forEach(function(scrape, i){
      if (scrape.path === path) {
        scrapeResults.scrapes.splice(i, 1);
      }
    });
  }

  function selectSame(elem){
    var parentsEles = [];
    elemPath = filterEles(elem.parents());
    $(elemPath).addBack().each(function() {
      var entry = this.tagName.toLowerCase();
      if (this.className) {
        entry += "." + this.className.replace(/ /g, '.');
      }
      parentsEles.push(entry);
    });
    return parentsEles.join(" ") + ' ' + elem.prop("tagName").toLowerCase();
  }

  function filterEles(elemArray){
    return elemArray.not('body').not('html');
  } 

  jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var siblings = parent.children(name);
        if (siblings.length > 1) { 
            name += ':eq(' + siblings.index(realNode) + ')';
        }

        path = name + (path ? '>' + path : '');
        node = parent;
    }
    return path;
  };

})();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {
      if ($('.toolbar').length > 0){
          $('.toolbar').remove();
      } else {
        var frame = $('<div>').addClass('toolbar');
        $('body').prepend(frame);
      }
      var button_export = $('<button type="button" class="export snowshoe">Export</button>');
      frame.append(button_export)
    }
  }
);



var scrapeResults = {
  'url': window.location.href,
  'protocol': getProtocol(),
  'track_name': '',
  'scrapes': []
}

$(document).on('click', '.export', function(){
  scrapeResults.track_name = prompt('What is the name of this track?');

  var xhr = createCORSRequest('POST', 'http://localhost:3000/testing');
  console.log(getProtocol());
  //var token = 'token';
  //xhr.setRequestHeader('X-CSRF-Token', token);
  //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(scrapeResults));

  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200){
      $('.toolbar').remove();
      scrapeResults.track_name = '';
      scrapeResults.scrapes = [];
    }
  }
});

function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

function getProtocol(){
  var tab_path = window.location.href;
  return tab_path.split(':')[0]
}
