let tempTab;
let state;
let autoLogin;
const activeContentScripts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request); // Log the entire message object
  if (request.action === "buttonOn") {
    chrome.storage.sync.get(['emailNotification'], (data) => {
      if (sendNotification) {
        sendEmailNotification();
      }
    })

    // Create alarm
    chrome.alarms.create('spot-open-alarm', {
      periodInMinutes: 2,
      when: Date.now()
    });    
    if (request.type === 'autoLogin') {
      autoLogin = true;
      console.log('autologin');
    } else if (request.type === 'noAutoLogin') {
      autoLogin = false;
      console.log('no auto login');
    };

  } else if (request.action === "buttonOff") {
      // Remove the alarm
      chrome.alarms.clear('spot-open-alarm');
  } else if (request.action === "slotOpen") {
    displaySlotAvailable();
    chrome.storage.sync.get(['emailNotification'], (data) => {
      if (sendNotification) {
        sendEmailNotification();
      }
    })

    
    chrome.alarms.clear('spot-open-alarm');
    chrome.action.setBadgeText({
      text: "OFF"
    });
    if (autoLogin) {
      getAndBookSlotAvailable(request.type);
    } else {
      chrome.tabs.remove(tempTab.id);
    }
    console.log(request.type);
  } else if (request.action === "noSlotsFound") {
      chrome.tabs.remove(tempTab.id);
  } else if (request.action === "beforecheckout") {
    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
  } else if (request.action === "checkout") {
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tempTab.id},
        files: ["scripts/autologin.js"],
      });
    }, 5000);
  } else if (request.action === "updateTab") {
    chrome.tabs.update(tempTab.id, { url: request.url });
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tempTab.id},
        files: ["scripts/autologin.js"],
      });
    }, 5000);
  } else if (request.action === "finish") {
    // once done remove the tab and remove the alarm
    chrome.tabs.remove(tempTab.id)
    chrome.alarms.clear('spot-open-alarm');
    chrome.action.setBadgeText({
      text: "OFF"
    });
  }
});


// when an alarm is created 
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("Alarm triggered:", alarm.name);
  getSlotsAvailable();
});

// redirect to the drop in booking page when click
chrome.notifications.onClicked.addListener(() => {
  goToBooking()
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

function sendEmailNotification() {
  chrome.storage.sync.get(['email'], (data) => {
    var emailTo = data.email
  })
}

async function getAndBookSlotAvailable(buttonId) {
  await chrome.storage.local.set({ buttonIdToUse: buttonId });
  chrome.tabs.onUpdated.addListener(tabUpdatedListener);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/autologin.js"],
    });
  }, 0);
}

async function getSlotsAvailable() {
  // create hidden tab
  const tab = await chrome.tabs.create({
    url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
    active: false,
    pinned: true,
  });
  console.log("Created tab with ID:", tab.id); 
  tempTab = tab
  // delay so the website can inject their own stuff into it
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    });
  }, 5000);
}

function tabUpdatedListener(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    if (tabId == tempTab?.id) {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tempTab.id},
          files: ["scripts/autologin.js"],
        });
      }, 2000);
    }
    console.log(`Tab ${tabId} finished loading.`);
  }
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.includes("MemberCheckout?shoppingCartKey")) {
    console.log("Redirecting to:", details.url);
  }
});


