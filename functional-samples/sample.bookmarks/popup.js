// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// FETCH FEATURE -------------------------------------------------------  
const myDummyURL = 'https://jsonplaceholder.typicode.com/posts/1';

$("#fetch").click(() => {
  //document.getElementById("resultWhenClick").innerText = "WOW!";

  //TODO: is there more straight-fwd approach than using chrome.runtime?
  chrome.runtime.sendMessage({name: "fetchDummy"}, (response) => {
    //Wait for Response
    document.getElementById("resultDate").innerHTML = response.day; 
    document.getElementById("result").innerHTML = response.desc;
  });
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