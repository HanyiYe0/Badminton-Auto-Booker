
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    console.log(reason)
    if (reason !== "install") {
        return;
    }
    // Create an alarm so we have something to look at in the demo
    await chrome.alarms.create('demo-default-alarm', {
      periodInMinutes: 1,
      when: Date.now()
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm triggered:", alarm.name);
});
