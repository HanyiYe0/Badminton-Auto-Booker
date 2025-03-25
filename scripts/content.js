// Global variables
let timeSlotElement;

let wantedStartTime = chrome.storage.sync.get("startTime");
let wantedEndTime = chrome.storage.sync.get("endTime");


chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    console.log(reason)
    if (reason !== "install") {
        return;
    }
    // Create alarm
    await chrome.alarms.create('spot-open-alarm', {
      periodInMinutes: 1,
      when: Date.now()
    });
});

// when an alarm is created 
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name);
    displaySlotAvailable();
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
        message: "A spot has opened up. Click to go to website and book."
    });
};


function checkAvailable() {
    
}
