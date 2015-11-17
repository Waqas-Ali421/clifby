var elements = document.getElementsByClassName('fsl fwb fcb');

for(var i = 0; i < elements.length; i++) {
  var element = elements[i];
  console.log(element.getElementsByTagName('a')[0].innerText);
}
