//to sanity check bg script is working
console.log('bg running...');

//Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if(msg.name === "fetchDummy"){
  
      const apiKey = 'your-api-key';
      const dateStr = new Date().toISOString().slice(0, 10); //YYYY-MM-DD
  
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
          const wantedData = JSON.stringify(data.body);
          //Response
          response({day: dateStr, desc: wantedData});
        });
      }).catch(function(err) {
        response({day: 'Err', desc: 'There was a problem loading the word of the day'});
      });
    
  
    }
  
    return true;
  
  });