(function(){
  const invalidTargets = ['body', 'div', 'section', 'article', 'header', 'html'];

  $(document).on('click', function(event){
    var targeted = $(event.target);
    var pathToSelected = selectSame(targeted);
    if (targeted.hasClass('selected')){
      $(pathToSelected).removeClass('selected');
      removeDetails(pathToSelected);
      console.log(scrapeResults);
    } else {
      if (invalidClick(targeted)) return false;
      $(pathToSelected).addClass('selected');
      scrapeDetails(pathToSelected);
      console.log(scrapeResults);
    }
  });

  function invalidClick(target){
    var targetTag = target.prop("tagName").toLowerCase();
    return $.inArray(targetTag, invalidTargets) >= 0;
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

})();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ( request.message === "clicked_browser_action" ) {
      var xhr = createCORSRequest('POST', 'http://localhost:3000/testing');
      console.log(getProtocol());
      //var token = 'token';
      //xhr.setRequestHeader('X-CSRF-Token', token);
      //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(scrapeResults));

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
          console.log('did it work?', xhr.responseText);
        }
      }
    }
  }
);

var scrapeResults = {
  'url': window.location.href,
  'protocol': getProtocol(),
  'scrapes': []
}


function createCORSRequest(method, url){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  return xhr;
}

function getProtocol(){
  var tab_path = window.location.href;
  return tab_path.split(':')[0]
}
