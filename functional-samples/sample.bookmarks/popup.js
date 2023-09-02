// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd


// ALICE MODIF -------------èèèèèè------------------------------------------------

// FETCH FEATURE (XHR FOR NOW) -------------------------------------------------------  
// Using dummy JSON PlaceHolder API https://jsonplaceholder.typicode.com/posts/1
const myDummyURL = 'https://jsonplaceholder.typicode.com/posts/1';

/*
$("#fetch1").click(function() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", myDummyURL, true);
  xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // innerText does not let the attacker inject HTML elements.
    document.getElementById("result").innerText = xhr.responseText;
    }
  }
  xhr.send();
});
*/

//TODO: instead of at runtime, trigger ONLY at clicking
// API call: version with service worker in the background 
// Send Message To Background
chrome.runtime.sendMessage({name: "fetchDummy"}, (response) => {
  //Wait for Response

  //console.log(response);
  //would show "" if innerText
  document.getElementById("resultDate").innerHTML = response.day; 
  document.getElementById("result").innerHTML = response.desc;


});


// TRAVERSING + DISPLAYING JSTREE ---------------------------------------------

//GET A SUBTREE - getSubTree('4922') - for Folder Test only:
const startNodeUlSub = document.getElementById('startNodeUlSub');
const targetId = '4922';

chrome.bookmarks.getSubTree(targetId)
.then( (res) => displayBookmarks(res, startNodeUlSub) )
.then( () => $("#bookmarkContainerSub").jstree() )
.catch( (err) => console.log(err) );


//GET ENTIRE TREE - TODO
const startNodeUlFull = document.getElementById('startNodeUlFull');

chrome.bookmarks.getTree()
.then( (res) => displayBookmarks(res, startNodeUlFull) )
.then( () => $("#bookmarkContainerFull").jstree() )
.catch( (err) => console.log(err) );


// Recursively display the bookmarks
function displayBookmarks(nodes, parentNode) {

  for (const node of nodes) {

    const li = document.createElement('li');
    li.textContent = node.title;
    
    // If the node has children (=> is a folder), recursively display them
    // Fixed DOM manip to have nesting of <ul><li>... as needed for a tree
    if (node.children) {
      const ul = document.createElement("ul");
      li.append(ul);
      parentNode.append(li);

      displayBookmarks(node.children, ul);

    } else {
      parentNode.append(li)
    }
  }

}

/*
document.addEventListener('DOMContentLoaded', function () {
  displayBookmarks();
});
*/