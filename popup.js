console.log('helloooo');

chrome.runtime.sendMessage({payload: 'nameRequest'}, function(names) {
    console.log(names);  
})
