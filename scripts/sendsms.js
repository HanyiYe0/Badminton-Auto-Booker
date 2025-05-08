Overlay
const overlay = document.createElement('div');
overlay.id = 'smsOverlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
overlay.style.zIndex = '999999';
overlay.style.display = 'flex';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.fontSize = '2rem';
overlay.style.fontWeight = 'bold';
overlay.style.color = '#333';
const text = document.createElement('div');
text.textContent = 'Sending SMS...';
overlay.appendChild(text);
document.body.appendChild(overlay);

function simulateEnterKey(element) {
    // Create keyboard events
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
  
    const keyUpEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
  
    // Dispatch events
    element.dispatchEvent(keyDownEvent);
    element.dispatchEvent(keyUpEvent);
}
const modal = document.getElementById('modal');
if (modal) {
    modal.remove()
}

const nextText = document.getElementById('newText')
nextText.click()
chrome.storage.sync.get(['number'], (data) => {
  var numberWanted = data.number
  setTimeout(() => {
    const numberTo = document.querySelector('input[placeholder="Enter a name or number"]')
    numberTo.value = numberWanted
    simulateEnterKey(numberTo)
    const message = document.getElementById('text-input');
    message.value = "A slot has opened up.";
    message.focus()
  
    const sendButton = document.getElementById('send_button');
    //sendButton.click()
}, 1000);
})

