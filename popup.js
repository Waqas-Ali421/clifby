function clearList() {
    var list = document.getElementsByClassName('list')[0];
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById("addGroupButton").addEventListener("click", function() {
        console.log("sent message");
        chrome.runtime.sendMessage({type: 'addGroupRequest'}, function(data) {
            console.log(data);
        });
    }); 
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== "groupMembersPayload") {
            return;
        }

        var names = request.names;

        clearList();
        for(var i = 0; i < names.length; i++) {
            var name = names[i];
            var newItem = document.createElement("li");
            newItem.innerHTML = name;
            document.getElementsByClassName('list')[0].appendChild(newItem);
        }
    }
);
