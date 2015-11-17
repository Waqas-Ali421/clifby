console.log('helloooo');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResposne) {
        console.log("message received");
        console.log(request);
        console.log(sender);
        console.log(sendResponse);
    }
)
