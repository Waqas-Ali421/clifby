var names = []

var elements = document.getElementsByClassName('fsl fwb fcb');

for(var i = 0; i < elements.length; i++) {
  var element = elements[i];
  names.push(element.getElementsByTagName('a')[0].innerText);
}

function send() {
    console.log('message sent');
    chrome.runtime.sendMessage({
        names: names,
        payload: 'names'
        }, function(response) {
            console.log('message received');
        }
    );
}

send()
