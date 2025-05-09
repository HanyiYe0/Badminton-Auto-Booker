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
    }
  } else if (request.action === "buttonOff") {
      // Remove the alarm
      chrome.alarms.clear('spot-open-alarm');


  } else if (request.action === "slotOpen") {
    // if auto login, then do auto login stuff and then check whether their is notification enabled
    if (autoLogin) {
      getAndBookSlotAvailable(request.type);
    } else {
      displaySlotAvailable();
      // no auto login, just send notification if applicable
      // Email Notification
      chrome.storage.sync.get(['emailNotification'], (data) => {
        if (data.emailNotification) {
          sendEmailNotification('Slot Open!','A slot has opened up. Visit to book: https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False');
        }
      });
      // SMS Notification
      chrome.storage.sync.get(['smsNotification'], (data) => {
        if (data.smsNotification) {
          sendSMSNotification('A slot has opened up.');
        } else {
          chrome.tabs.remove(tempTab.id);
          // Re-enable start watch button
          const running = false;
          chrome.storage.sync.set({ running }, () => {
            console.log('Stopped Run');
          });
          chrome.action.setBadgeText({
            text: "OFF"
          });
        }
      })
    }
    chrome.alarms.clear('spot-open-alarm');

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
    }, 3000);


  } else if (request.action === "updateTab") {
    chrome.tabs.update(tempTab.id, { url: request.url });
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tempTab.id},
        files: ["scripts/autologin.js"],
      });
    }, 2000);
  } else if (request.action === "finish") {
    // once done remove the tab and remove the alarm
    // Email Notification
    chrome.storage.sync.get(['emailNotification'], (data) => {
      if (data.emailNotification) {
        sendEmailNotification('Successful Booking!','A slot has been successfully booked.');
      }
    });
    // SMS Notification
    chrome.storage.sync.get(['smsNotification'], (data) => {
      if (data.smsNotification) {
        setTimeout(() => {
          sendSMSNotification('A slot has been successfully booked.');
        }, 5000)
      } else {
        setTimeout(() => {
            chrome.tabs.remove(tempTab.id);
        }, 5000)
        // Re-enable start watch button
        const running = false;
        chrome.storage.sync.set({ running }, () => {
          console.log('Stopped Run');
        });
        chrome.action.setBadgeText({
          text: "OFF"
        });
      }
    })
    chrome.alarms.clear('spot-open-alarm');

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
    // Re-enable start watch button
    const running = false;
    chrome.storage.sync.set({ running }, () => {
      console.log('Stopped Run');
    });
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

  chrome.storage.sync.get(['program'], (data) => {
    switch (data.program) {
      case "Activities for Age 55+":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=018e7083-d228-4af0-aab1-6d7958b3c8d4&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Aquafit":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=d4d891dd-9e45-474b-97c4-e43c8f8fe3b8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Adapted":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=87aec518-3085-43dc-b1de-62e39e1c6956&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Group Fitness: Cardio":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=3cad5e4f-9aa0-430b-b2d4-8f75e0984e39&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Group Fitness: Mind & Body":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=1da4e633-1e1c-4639-8aed-aaeaef5ebb2d&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Group Fitness: Strength Training":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=f0a1e11c-56e9-4d9b-996d-ef8201cf6ed8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Sensory Room / Inddor Playground":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=1b657632-f24f-42b3-bdb4-3043e211da12&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Skating":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=ecf5202d-4c97-4f89-b4e3-42966a1cc453&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Sports & Activities":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Swimming":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=39bd5c76-e07f-43f3-af24-c6969091dbb4&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
      case "Tennis Round Robins":
        chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=3f4b9fa1-1ba8-4d30-8abc-6f47de53c4b8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False"
        });
        break;
    }
  })
};

function displaySlotAvailable() {
  chrome.notifications.create("spot-open-notification", {
      type: "basic",
      iconUrl: 'images/badminton.png',
      title: "Spot Open!",
      message: "A slot has opened up. Click to go to website and book."
  });
};

function sendEmailNotification(messageSubject, messageBody) {
  chrome.storage.sync.get(['email'], (data) => {
    var emailTo = data.email

    fetch('https://script.google.com/macros/s/AKfycbxIFk-K4FoOL5fjjiMu3Gs-nnyeXmcxYKTsYhbGBqbkFY4PqIFw9Qk8NzshjgC534LWWw/exec', {
      method: 'POST',
      body: JSON.stringify({
        to: emailTo,
        subject: messageSubject,
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
  }, 500);
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
      files: ["scripts/setoverlay.js"],
    })
  }, 4000);
  setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tempTab.id},
      files: ["scripts/setoverlay.js"],
    })
  }, 4500);
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
  chrome.storage.sync.get(['program'], async (data) => {
    switch (data.program) {
      case "Activities for Age 55+":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=018e7083-d228-4af0-aab1-6d7958b3c8d4&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Aquafit":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=d4d891dd-9e45-474b-97c4-e43c8f8fe3b8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Adapted":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=87aec518-3085-43dc-b1de-62e39e1c6956&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Group Fitness: Cardio":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=3cad5e4f-9aa0-430b-b2d4-8f75e0984e39&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Group Fitness: Mind & Body":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=1da4e633-1e1c-4639-8aed-aaeaef5ebb2d&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Group Fitness: Strength Training":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=f0a1e11c-56e9-4d9b-996d-ef8201cf6ed8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Sensory Room / Inddor Playground":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=1b657632-f24f-42b3-bdb4-3043e211da12&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Skating":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=ecf5202d-4c97-4f89-b4e3-42966a1cc453&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Sports & Activities":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=491a603e-4043-4ab6-b04d-8fac51edbcfc&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Swimming":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=39bd5c76-e07f-43f3-af24-c6969091dbb4&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
      case "Tennis Round Robins":
        var tab = await chrome.tabs.create({
          url: "https://cityofmarkham.perfectmind.com/Clients/BookMe4BookingPages/Classes?calendarId=3f4b9fa1-1ba8-4d30-8abc-6f47de53c4b8&widgetId=6825ea71-e5b7-4c2a-948f-9195507ad90a&embed=False",
          active: false,
          pinned: true,
        });
        break;
    }
    console.log("Created tab with ID:", tab.id); 
    tempTab = tab
    // delay so the website can inject their own stuff into it
    setTimeout(() => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/content.js"],
      });
    }, 5000);
  })
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


