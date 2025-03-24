document.getElementById('preferences-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const sportType = document.getElementById('sport-type').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
  
    // Save to Chrome storage
    chrome.storage.sync.set({ sportType, date, startTime, endTime }, () => {
      console.log('Preferences saved!');
      window.close(); // Close popup after saving
    });
  });
  
  // Load saved preferences on popup open
  chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime'], (data) => {
    if (data.sportType) document.getElementById('sport-type').value = data.sportType;
    if (data.date) document.getElementById('date').value = data.date;
    if (data.startTime) document.getElementById('start-time').value = data.startTime;
    if (data.endTime) document.getElementById('end-time').value = data.endTime;
  });