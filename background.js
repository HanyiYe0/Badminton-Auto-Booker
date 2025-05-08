let tempTab;
let state;
let autoLogin;
const activeContentScripts = new Set();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request); // Log the entire message object
  if (request.action === "buttonOn") {
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
    // Email Notification
    chrome.storage.sync.get(['emailNotification'], (data) => {
      if (data.emailNotification) {
        sendEmailNotification('A slot has opened up. Visit to book: https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False');
      }
    });
    // SMS Notification
    chrome.storage.sync.get(['smsNotification'], (data) => {
      if (data.smsNotification) {
        sendSMSNotification('A slot has opened up.');
      } else {
        if (autoLogin) {
          getAndBookSlotAvailable(request.type);
        } else {
          chrome.tabs.remove(tempTab.id);
        }
      }
    })
    chrome.alarms.clear('spot-open-alarm');
    chrome.action.setBadgeText({
      text: "OFF"
    });
    

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
      sendEmailNotification("A slot has been booked successfully!")
      sendSMSNotification("A slot has been booked successfully")
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


  } else if (request.action === "sent-sms") {
    chrome.tabs.remove(tempTab.id);
    chrome.cookies.remove({
      "url": "https://www.textnow.com/messaging",
      "name": "connect.sid",
      "storeId": "0",
    }
    );
    chrome.cookies.remove({
      "url": "https://www.textnow.com/messaging",
      "name": "_csrf",
      "storeId": "0",
    }
    );
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

function sendEmailNotification(messageBody) {
  chrome.storage.sync.get(['email'], (data) => {
    var emailTo = data.email

    fetch('https://script.google.com/macros/s/AKfycbxIFk-K4FoOL5fjjiMu3Gs-nnyeXmcxYKTsYhbGBqbkFY4PqIFw9Qk8NzshjgC534LWWw/exec', {
      method: 'POST',
      body: JSON.stringify({
        to: emailTo,
        subject: 'Spot Open!',
        body: messageBody
      })
    });
  })
}






function sendSMSNotification(messageBody) {
  chrome.storage.local.set({message: messageBody});
  chrome.cookies.set({
    "url": "https://www.textnow.com/messaging",
    "name": "connect.sid",
    "value": "s%3ADvxFBkO1ZjLIqjVHa0RYJxE4H-RQWDGf.%2FsaOO%2B4ugpx6ND1On3j%2FMwSDKS2heZYsFxJ%2ByPRP88Q",
    "domain": ".textnow.com",
    "path": "/"
  }
  );
  chrome.cookies.set({
    "url": "https://www.textnow.com/messaging",
    "name": "_csrf",
    "value": "s%3AIcMno0d52mFnFyDlBl5PwqvA.kKsKwR8ovQM5WzSKAx2DEHes585B2cU8jt8kUnr7wxo",
    "domain": ".textnow.com",
    "path": "/"
  }
  );
  chrome.tabs.update(tempTab.id, {
    url: "https://www.textnow.com/messaging"
  });
  chrome.scripting.executeScript({
    target: { tabId: tempTab.id},
    files: ["scripts/setoverlay.js"],
  })
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 1000);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 1500);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 2000);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 2500);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 3000);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 3500);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/sendsms.js"],
    });
  }, 5000);
  
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


