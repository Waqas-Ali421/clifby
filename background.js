var names = null;

// Receive names from inject script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("received names from injector");
        if(request.payload === 'names') {
            names = request.names;

            sendResponse({status: "success"});
        }
    }
);

// Send names to popup on request
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.payload === 'nameRequest') {
            if(names) {
                sendResponse({
                    status: "success",
                    names: names
                });
            } else {
                sendResponse({
                    status: "failure",
                    msg: "Names have not yet been loaded"
                });
            }
        }
    }
);
