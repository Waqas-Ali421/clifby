console.log('helloooo');

chrome.runtime.sendMessage({payload: 'nameRequest'}, function(names) {
    console.log(names);
    for(var i = 0; i < names.length; i++) {
        var name = names[i];
        var newItem = document.createElement("li");
        newItem.innerHTML = name;
        document.getElementsByClassName('list')[0].appendChild(newItem);
    }
})
