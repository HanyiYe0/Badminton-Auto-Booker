chrome.storage.local.get(['buttonIdToUse'], (result) => {
    const buttonId = result.buttonIdToUse;
    // If the page is at main activities page, use the buttonId here
    activityInfo = document.getElementById(buttonId);
    if (activityInfo) {
        activityInfo.click();
    }
    // If at the activity info page wait for page to load and then book
    registerButton = document.getElementById('bookEventButton');
    if (registerButton) {
        registerButton.click();
    }
    
    // If at the confirmation page
    nextButton1 = document.querySelector('.next-button-container');
    if (nextButton1) {
        nextButton1.click()
    }

    // Next confirmation page
    nextButton2 = document.querySelector('[title="Add to Cart"]');
    if (nextButton2) {
        chrome.runtime.sendMessage({action: "beforecheckout"});
        nextButton2.click();
        chrome.runtime.sendMessage({action: "checkout"});
    }
    // Comfirm Payment Page
    creditCardRadio = document.querySelector('div.payment-radio input[type="radio"]');
    if (creditCardRadio) {
        creditCardRadio.click();
    }
    purchaseButton = document.querySelector('button.process-now');
    if (purchaseButton) {
        purchaseButton.click();
        chrome.runtime.sendMessage({action: "finish"});
    }
  });

chrome.storage.sync.get(['username', 'password'], (data) => {
    // If at the login page, use the username and password to log into the account
    usernameBox = document.getElementById('textBoxUsername');
    passwordBox = document.getElementById('textBoxPassword');
    loginButton = document.getElementById('buttonLogin');
    // Use username and password
    if (usernameBox && passwordBox && loginButton) {
        usernameBox.value = data.username;
        passwordBox.value = data.password;
        loginButton.click();
    };
});

// Run in console on the parent page
const iframe = document.querySelector('iframe.online-store');
if (iframe) {
  console.log('Real checkout URL:', iframe.src);

  chrome.runtime.sendMessage({ action: "updateTab", url: iframe.src });
}

