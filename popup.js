console.log('hi');

function clearList() {
    var list = document.getElementsByClassName('list')[0];
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

chrome.runtime.sendMessage({payload: 'nameRequest'}, function(data) {
    if(data.status === "success") {
        var names = data.names;

        clearList();
        for(var i = 0; i < names.length; i++) {
            var name = names[i];
            var newItem = document.createElement("li");
            newItem.innerHTML = name;
            document.getElementsByClassName('list')[0].appendChild(newItem);
        }
    } else {
        console.log("name request failed.");
        console.log(data);
    }
})
