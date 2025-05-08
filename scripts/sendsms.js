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
    sendButton.click()
  }, 1000);
  setTimeout(() => {
    chrome.runtime.sendMessage( {
      action: "sent-sms"
    });
  }, 2000);
  
})
