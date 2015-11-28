function clearList() {
    var list = document.getElementsByClassName('list')[0];
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function loadMembers(members) {
    for(var i = 0; i < members.length; i++) {
        var name = members[i];
        var newItem = document.createElement("li");
        newItem.innerHTML = name;
        document.getElementsByClassName('list')[0].appendChild(newItem);
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    document.getElementById("addGroupButton").addEventListener("click", function() {
        chrome.runtime.sendMessage({type: 'addGroupRequest'}, function(data) {
            console.log(data);
        });
    }); 
});

// Process groups data
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type !== 'sendGroupsData') {
            return;
        }

        console.log(request.payload);

        var groups = request.payload;
        loadMembers(groups[0].members);
    }
);

chrome.runtime.sendMessage({type: 'getGroupsRequest'});
