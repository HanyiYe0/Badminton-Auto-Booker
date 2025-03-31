chrome.storage.local.get(['buttonIdToUse'], (result) => {
    const buttonId = result.buttonIdToUse;
    // If the page is at main activities page, use the buttonId here
    activityInfo = document.getElementById(buttonId);
    if (activityInfo) {
        activityInfo.click();
    }
    // If at the activity info page wait for page to load and then book
    register_button = document.getElementById('bookEventButton');
    if (register_button) {
        register_button.click();
    }
  });

  chrome.storage.sync.get(['username', 'password'], (data) => {
    // If at the login page, use the username and password to log into the account
});
