
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
    chrome.notifications.create({
        type: "basic",
        iconUrl: 'images/tear.png',
        title: "Spot Open!",
        message: "A spot has opened up. Click to go to website and book."
    });
    console.log(chrome.runtime.lastError)
});
