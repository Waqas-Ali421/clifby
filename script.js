var CLIFBY_APP = {
    names: [],
    sent: false
}

function send() {
    var elements = document.getElementsByClassName('fsl fwb fcb');
    var names = [];
    for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        names.push(element.getElementsByTagName('a')[0].innerText);
    }

    chrome.runtime.sendMessage({
        names: names,
        payload: 'names'
        }, function(response) {
            if(response.status === "success") {
                CLIFBY_APP.sent = true;
            }
        }
    );

    CLIFBY_APP.names = names;

    if(!CLIFBY_APP.sent) {
        setTimeout(send, 1000);
    }
}

send()
