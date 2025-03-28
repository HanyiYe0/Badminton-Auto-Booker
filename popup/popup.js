document.getElementById('save-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Store all the info from the form
    const sportType = document.getElementById('sport-type').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const location = document.getElementById('location').value;

    // Save to Chrome storage
    await chrome.storage.sync.set({ sportType, date, startTime, endTime, location }, () => {
        console.log('Preferences saved!');
    });
});

document.getElementById('start-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    await chrome.action.setBadgeText({
        text: "ON"
    });
    // Do the button on stuff at background.js
    await chrome.runtime.sendMessage( {
        action: "buttonOn"
    });
  });

document.getElementById('stop-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // set the icon as off
    await chrome.action.setBadgeText({
        text: "OFF"
    });
    // Do the button off stuff: just delete alarm
    await chrome.runtime.sendMessage( {
        action: "buttonOff"
    });
});
  
// Load saved preferences on popup open
chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime', 'location'], (data) => {
    if (data.sportType) document.getElementById('sport-type').value = data.sportType;
    if (data.date) document.getElementById('date').value = data.date;
    if (data.startTime) document.getElementById('start-time').value = data.startTime;
    if (data.endTime) document.getElementById('end-time').value = data.endTime;
    if (data.location) document.getElementById('location').value = data.location;
});

