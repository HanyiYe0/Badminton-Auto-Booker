
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

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name);
    // create notification
    chrome.notifications.create("spot-open-notification", {
        type: "basic",
        iconUrl: 'images/tear.png',
        title: "Spot Open!",
        message: "A spot has opened up. Click to go to website and book."
    });
    console.log(chrome.runtime.lastError)
});

chrome.notifications.onClicked.addListener((notificationId) => {
    callback: goToBooking()
});

function goToBooking() {
    chrome.tabs.create({
        url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4?widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a"
    });
};