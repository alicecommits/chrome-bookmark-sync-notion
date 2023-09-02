//Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if(msg.name == "fetchDummy"){
  
  
      const apiKey = 'your-api-key';
      const dateStr = new Date().toISOString().slice(0, 10); //2020-01-01
  

      const apiCall = 'https://jsonplaceholder.typicode.com/posts/1';
      console.log(apiCall);
      //We call api..
      fetch(apiCall).then(function(res) {
        //wait for response..
        if (res.status !== 200) {
          response({day: 'Err', desc: 'There was a problem loading the word of the day'});
          return;
        }
        res.json().then(function(data) {
          //send the response...

          //Response
          response({day: JSON.stringify(dateStr), desc: JSON.stringify(data)});
        });
      }).catch(function(err) {
        response({day: 'Err', desc: 'There was a problem loading the word of the day'});
      });
    
  
    }
  
    return true;
  
  });