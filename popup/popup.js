document.getElementById('save-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const sportType = document.getElementById('sport-type').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
  
    await chrome.action.setBadgeText({
        text: "ON"
    });


    // Save to Chrome storage
    await chrome.storage.sync.set({ sportType, date, startTime, endTime }, () => {
      console.log('Preferences saved!');
    });

    await chrome.runtime.sendMessage( {
        action: "buttonOn"
    });
  });

document.getElementById('stop-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Turn off and stop the alarms
    await chrome.action.setBadgeText({
        text: "OFF"
    });

    await chrome.runtime.sendMessage( {
        response: "buttonOff"
    });
});
  
// Load saved preferences on popup open
chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime'], (data) => {
    if (data.sportType) document.getElementById('sport-type').value = data.sportType;
    if (data.date) document.getElementById('date').value = data.date;
    if (data.startTime) document.getElementById('start-time').value = data.startTime;
    if (data.endTime) document.getElementById('end-time').value = data.endTime;
});

