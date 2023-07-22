// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd


// PERSO ALICE --------------------------------------------------------------------------
// FETCH FEATURE (XHR FOR NOW) -------------------------------------------------------  
// Using dummy JSON PlaceHolder API https://jsonplaceholder.typicode.com/posts/1
//TODO: try with jQuery AJAX instead? / fetch() + scripting?
const myDummyURL = 'https://jsonplaceholder.typicode.com/posts/1';
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


// JSTREE TRYOUTS ---------------------------------------------------------------------
$(function () { 
  //create an instance when the DOM is ready 
  $('#jstree_demo_div').jstree();
  
  // bind to events triggered on the tree
  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });
});
// interact with demo tree - either way is OK (uncomment not used)
$('#button1').on('click', function() {
  $('#jstree_demo_div').jstree(true).select_node('child_node_1');
  //$(function () { $('#jstree_demo_div').jstree(); });
  //$.jstree.reference('#jstree').select_node('child_node_1');
});



// TRAVERSAL TEST ALICE - REDUCED TO 1 FOLDER ------------------------
// Chrome API samples
// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup

//GET ENTIRE TREE
/*
chrome.bookmarks.getTree((tree) => {
  const bookmarkList = document.getElementById('bookmarkList');
  displayBookmarks(tree[0].children, bookmarkList);
});
*/

//const injectTreeHere = document.getElementById('injectTreeHere');
//WRAPPING IN FUNCTION TRIGGERS TREE SHAPING
$(function () { 
  $("#mytree").jstree();
});

//GET A SUBTREE - getSubTree('4922') - for Folder Test only:
const targetId = '4922';
const bookmarkList = document.getElementById('bookmarkList');

chrome.bookmarks.getSubTree(targetId)
.then( (res) => displayBookmarks(res, bookmarkList) )
.then( () => $("#bookmarkList").jstree() )
.catch( (err) => console.log(err) );

/*
$(function () {
  $("#bookmarkList").jstree();
});
*/



//TOTRY rewrite with other async/await or arrow func?
/*
//use this to rewrite chrome bookmarks
const convertStringToHTML = htmlString => {
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlString, 'text/html');

  return html.body;
}
*/



//TODO: try to wrap all children within subtree with jsTree...

// Recursively display the bookmarks
function displayBookmarks(nodes, parentNode) {
  for (const node of nodes) {
    // If the node is a bookmark, create a list item and append it to the parent node
    if (node.url) {
      const listItem = document.createElement('li');
      listItem.textContent = node.title;
      parentNode.appendChild(listItem);
    }
    
    // If the node has children (=> is a folder), recursively display them
    // Problem with 1st case: using node.url property doesn't capture 
    // subfolders title! and neither does the original "has children" case below
    // TODO report fix sugggestion:
    // append both a li element, 
    // then an ul elmeent right underneath
    if (node.children) {

      const subFolderTitle = node.title //+ node.id;
      const listItem = document.createElement('li');
      listItem.textContent = subFolderTitle;
      parentNode.appendChild(listItem);

      const sublist = document.createElement('ul');
      parentNode.appendChild(sublist);

      displayBookmarks(node.children, sublist);
    }
  }

}

// TODOS --------------------------------------------------------------------------
// Objective with jsTree:
// USE IT INSTEAD OF NESTED BULLET POINTS FROM ORIGINAL TEMPLATE/CSS
// Traverse the bookmark tree, and print the folder and nodes.
// chrome bookmarks GET Notions vs. bookmarks.getTree:
// tbd if do a tree comparison (breadth/depth?) and then sync only the changes?

// Show add and edit links when hover over.
// delete, add, edit <=> Our C(R)UD operations to make happen in Notion!
// END OF PERSO ALICE ----------------------------------------------------------------











































// Original samples.bookmark code ----------------------------------------------------

/*
// Search the bookmarks when entering the search keyword.
$('#search').change(function () {
  $('#bookmarks').empty();
  dumpBookmarks($('#search').val());
});

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  const bookmarkTreeNodes = chrome.bookmarks.getTree(function (
    bookmarkTreeNodes
  ) {
    $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
  });
}

function dumpTreeNodes(bookmarkNodes, query) {
  const list = $('<ul>');
  for (let i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }

  return list;
}

*/

/*
function dumpNode(bookmarkNode, query) {
  let span = '';
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (
        String(bookmarkNode.title.toLowerCase()).indexOf(query.toLowerCase()) ==
        -1
      ) {
        return $('<span></span>');
      }
    }

    const anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);

    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    /*
    anchor.click(function () {
      chrome.tabs.create({ url: bookmarkNode.url });
    });

    span = $('<span>');
    const options = bookmarkNode.children
      ? $('<span>[<a href="#" id="addlink">Add</a>]</span>')
      : $(
          '<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
            'href="#">Delete</a>]</span>'
        );
    const edit = bookmarkNode.children
      ? $(
          '<table><tr><td>Name</td><td>' +
            '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
            '</td></tr></table>'
        )
      : $('<input>');

    // Show add and edit links when hover over.
    span
      .hover(
        function () {
          span.append(options);
          $('#deletelink').click(function (event) {
            console.log(event);
            $('#deletedialog')
              .empty()
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Confirm Deletion',
                modal: true,
                show: 'slide',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  'Yes, Delete It!': function () {
                    chrome.bookmarks.remove(String(bookmarkNode.id));
                    span.parent().remove();
                    $(this).dialog('destroy');
                  },
                  Cancel: function () {
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          $('#addlink').click(function (event) {
            edit.show();
            $('#adddialog')
              .empty()
              .append(edit)
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Add New Bookmark',
                modal: true,
                show: 'slide',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  Add: function () {
                    edit.hide();
                    chrome.bookmarks.create({
                      parentId: bookmarkNode.id,
                      title: $('#title').val(),
                      url: $('#url').val()
                    });
                    $('#bookmarks').empty();
                    $(this).dialog('destroy');
                    window.dumpBookmarks();
                  },
                  Cancel: function () {
                    edit.hide();
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          $('#editlink').click(function (event) {
            edit.show();
            edit.val(anchor.text());
            $('#editdialog')
              .empty()
              .append(edit)
              .dialog({
                autoOpen: false,
                closeOnEscape: true,
                title: 'Edit Title',
                modal: true,
                show: 'fade',
                position: {
                  my: 'left',
                  at: 'center',
                  of: event.target.parentElement.parentElement
                },
                buttons: {
                  Save: function () {
                    edit.hide();
                    chrome.bookmarks.update(String(bookmarkNode.id), {
                      title: edit.val()
                    });
                    anchor.text(edit.val());
                    options.show();
                    $(this).dialog('destroy');
                  },
                  Cancel: function () {
                    edit.hide();
                    $(this).dialog('destroy');
                  }
                }
              })
              .dialog('open');
          });
          options.fadeIn();
        },

        // unhover
        function () {
          options.remove();
        }
      )
      .append(anchor);
  }

  const li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }

  return li;
}
*/

/*
document.addEventListener('DOMContentLoaded', function () {
  displayBookmarks(); //dumpBookmarks();
});
*/