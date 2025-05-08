document.getElementById('save-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Store all the info from the form
    const sportType = document.getElementById('sport-type').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const location = document.getElementById('location').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const autoLogin = document.getElementById('auto-book').checked;
    const emailNotification = document.getElementById('email-notification').checked;
    const email = document.getElementById('email').value;
    const smsNotification = document.getElementById('sms-notification').checked;
    const number = document.getElementById('phone-number').value

    // Save to Chrome storage
    await chrome.storage.sync.set({ sportType, date, startTime, endTime, location, username, password, autoLogin, emailNotification, email, smsNotification, number }, () => {
        console.log('Preferences saved!');
    });
});

document.getElementById('start-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Store all the info from the form
    const sportType = document.getElementById('sport-type').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const location = document.getElementById('location').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const autoLogin = document.getElementById('auto-book').checked;
    const emailNotification = document.getElementById('email-notification').checked;
    const email = document.getElementById('email').value;
    const smsNotification = document.getElementById('sms-notification').checked;
    const number = document.getElementById('phone-number').value

    await chrome.action.setBadgeText({
        text: "ON"
    });
    // if checkbox is checked, perform auto-login
    if (document.getElementById("auto-book").checked) {
        await chrome.runtime.sendMessage( {
            action: "buttonOn",
            type: "autoLogin"
        });
    } else {
        // Do the button on stuff at background.js
        await chrome.runtime.sendMessage( {
            action: "buttonOn",
            type: "noAutoLogin"
        });
    }

    // Save to Chrome storage
    await chrome.storage.sync.set({ sportType, date, startTime, endTime, location, username, password, autoLogin, emailNotification, email, smsNotification, number }, () => {
        console.log('Preferences saved!');
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
chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime', 'location', 'username', 'password', 'autoLogin', 'emailNotification', 'email', 'smsNotification', 'number'], (data) => {
    if (data.sportType) document.getElementById('sport-type').value = data.sportType;
    if (data.date) document.getElementById('date').value = data.date;
    if (data.startTime) document.getElementById('start-time').value = data.startTime;
    if (data.endTime) document.getElementById('end-time').value = data.endTime;
    if (data.location) document.getElementById('location').value = data.location;
    if (data.username) document.getElementById('username').value = data.username;
    if (data.password) document.getElementById('password').value = data.password;
    if (data.autoLogin) document.getElementById('auto-book').checked = data.autoLogin;
    if (data.emailNotification) document.getElementById('email-notification').checked = data.emailNotification;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.smsNotification) document.getElementById('sms-notification').checked = data.smsNotification;
    if (data.number) document.getElementById('phone-number').value = data.number
});



// Send sms notification
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "send-sms") {
        var numberTo = request.number
        const iframe = document.createElement('iframe');
        iframe.src = "https://www.textnow.com/messaging";
        //iframe.style.display = 'none'; // Hide the iframe
        document.body.appendChild(iframe);
    }

})
