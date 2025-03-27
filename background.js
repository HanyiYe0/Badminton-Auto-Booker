var state;
const activeContentScripts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "buttonOn") {
    // Create alarm
    chrome.alarms.create('spot-open-alarm', {
      periodInMinutes: 1,
      when: Date.now()
    });    
  } else if (request.action === "buttonOff") {
      // Remove the alarm
      chrome.alarms.clear('spot-open-alarm');
  }

});

// when an alarm is created 
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("Alarm triggered:", alarm.name);
  getSlotsAvailable();
});

// redirect to the drop in booking page when click
chrome.notifications.onClicked.addListener((notificationId) => {
  callback: goToBooking()
});

function goToBooking() {
  chrome.tabs.create({
      url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
  });
};

function displaySlotAvailable() {
  chrome.notifications.create("spot-open-notification", {
      type: "basic",
      iconUrl: 'images/badminton.png',
      title: "Spot Open!",
      message: "A slot has opened up. Click to go to website and book."
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "slotAvailable") {
      chrome.notifications.create({
          type: "basic",
          iconUrl: "images/icon48.png",
          title: "Spot Available!",
          message: `${message.startTime} - ${message.endTime} slot opened!`
      });
  }
});

async function getSlotsAvailable() {
  // create hidden tab
  const tab = await chrome.tabs.create({
    url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
    active: false,
    pinned: true,
    selected: true
  });
  // delay so the website can inject their own stuff into it
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    });
  }, 3000);
  

}