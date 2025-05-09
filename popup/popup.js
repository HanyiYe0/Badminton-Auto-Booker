document.getElementById('save-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Store all the info from the form
    const program = document.getElementById('program-type').value;
    const activity = document.getElementById('activity-type').value;
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
    await chrome.storage.sync.set({ program, activity, date, startTime, endTime, location, username, password, autoLogin, emailNotification, email, smsNotification, number }, () => {
        console.log('Preferences saved!');
    });
});

document.getElementById('start-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    // Store all the info from the form
    const program = document.getElementById('program-type').value;
    const activity = document.getElementById('activity-type').value;
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
    // Checks for required fields
    if (!program || !activity || !date || !startTime || !endTime || !location) {
      // Check required fields
      if (!location) {
        showAlert('Required Field', 'Please select a location');
        return false;
      }
      if (!program) {
        showAlert('Required Field', 'Please select a program');
        return false;
      }
      if (!activity) {
        showAlert('Required Field', 'Please select an activity');
        return false;
      }
      if (!date) {
        showAlert('Required Field', 'Please select a date');
        return false;
      }
      if (!startTime) {
        showAlert('Required Field', 'Please select a start time');
        return false;
      }
      if (!endTime) {
        showAlert('Required Field', 'Please select an end time');
        return false;
      }
    } else {
      if (autoLogin) {
        if (!username || !password) {
          showAlert('Required Field', 'Please enter username and password')
          return false;
        }
      }
      if (emailNotification && !email) {
        showAlert('Required Field', 'Please enter email address')
        return false;
      }
      if (smsNotification && !number) {
        showAlert('Required Field', 'Please enter a phone number')
        return false;
      }
    }

    // Start watch
    const running = true;
    document.getElementById("start-btn").disabled = true;


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
    await chrome.storage.sync.set({ running, program, activity, date, startTime, endTime, location, username, password, autoLogin, emailNotification, email, smsNotification, number }, () => {
        console.log('Preferences saved!');
    });
  });

document.getElementById('stop-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const running = false;
    await chrome.storage.sync.set({ running }, () => {
        console.log('Stopped Run');
    });
    document.getElementById("start-btn").disabled = false;

    // set the icon as off
    await chrome.action.setBadgeText({
        text: "OFF"
    });
    // Do the button off stuff: just delete alarm
    await chrome.runtime.sendMessage( {
        action: "buttonOff"
    });
});
  
document.querySelector('.toggle-password').addEventListener('click', function() {
  const passwordInput = document.getElementById('password');
  const icon = this;

  // Toggle between password/text
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  // Optional: Change icon when visible
  icon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});
// Example JavaScript for cascading dropdowns
const programType = document.getElementById('program-type');
const activityType = document.getElementById('activity-type');

const activities = {
    'Activities for Age 55+': [
      'Bone Health Fitness',
      'Cardio Dance',
      'Cardio Exercise',
      'Chair Yoga',
      'Gentle Fit',
      'Line Dance',
      'Pilates',
      'Social Dance',
      'Strength & Balance',
      'Tai Chi',
      'Taichi Sword',
      'Wellness & Strength Training',
      'Yoga'
    ],
    'Aquafit': [
        'Aquafit: Deep',
        'Aquafit: Older Adults',
        'Aquafit: Shallow',
        'Aquafit: Shallow/Deep',
        'Aquafit: Stretch'
    ],
    'Adapted': [
      'Sensory Room'
    ],
    'Group Fitness: Cardio': [
      'Cardio Dance',
      'Cardio Dance: Salsa',
      'Cardio Kick Boxing',
      'Cycle Fitness',
      'Low Impact Workout',
      'Step: Challenge',
      'Step: Interval',
      'Zumba'
    ],
    'Group Fitness: Mind & Body': [
      'Relax & Stretch',
      'Yoga',
      'Yoga: Gentle',
      'Yoga: Meditative',
      'Yoga: Plus',
      'Yoga: Power',
      'Yoga: Yin'
    ],
    'Group Fitness: Strength Training': [
      'Functional Movement Workout',
      'Muscle Conditioning',
      'Pilates',
      'Pilates I/II Challenge'
    ],
    'Group Fitness: Total Body Workout': [
      'Barre',
      'Bodyweight Boot Camp',
      'Cardio & Strength Fusion',
      'Core Strength & Stretch',
      'Group Fitness: Older Adult',
      'Muscle Works'
    ],
    'Sensory Room / Inddor Playground': [
      'Indoor Playground',
      'Sensory Room'
    ],
    'Skating': [
      'Recreational Skate',
      'Shinny: Adults',
      'Shinny: Adults (40+)',
      'Stick & Puck- 16 +'
    ],
    'Sports & Activities': [
      'Badminton: Adult and Child',
      'Badminton: Adults',
      'Badminton: All Ages',
      'Basketball: Adults',
      'Basketball: Pre-Teens',
      'Basketball: Teens',
      'Pickleball: Adults',
      'Rock Jam Music',
      'Soccer: Adults',
      'Table Tennis: All Ages',
      'Volleyball: Adults',
      'Youth Centre'
    ],
    'Swimming': [
      'Lane Swim',
      'Parent & Tot Swim',
      'Recreational Swim',
      'Sensory Swim with Caregiver',
      'Therapy Swim'
    ],
    'Tennis Round Robins': [
      'Tennis Round Robin: Intermediate/Advanced',
      'Tennis Round Robin: Rec/Beginner'
    ]
  };
  
programType.addEventListener('change', function() {
  const selectedProgram = this.value;
  activityType.innerHTML = '<option value="">Select an activity</option>';
  
  if (selectedProgram) {
    activities[selectedProgram].forEach(activity => {
      const option = document.createElement('option');
      option.value = activity;
      option.textContent = activity;
      activityType.appendChild(option);
    });
  }
});

// Load saved preferences on popup open
chrome.storage.sync.get(['program', 'activity', 'date', 'startTime', 'endTime', 'location', 'username', 'password', 'autoLogin', 'emailNotification', 'email', 'smsNotification', 'number'], (data) => {
    // 1. Restore program (triggers activity dropdown population)
    if (data.program) {
        document.getElementById('program-type').value = data.program;
        
        // Manually trigger 'change' event to load activities
        const event = new Event('change');
        programType.dispatchEvent(event);
        
        // 2. Set activity AFTER dropdown is populated (small delay)
        setTimeout(() => {
          if (data.activity) {
            document.getElementById('activity-type').value = data.activity;
          }
        }, 50); // Short delay to ensure dropdown is updated
      }
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


// Custom Alert System
function showAlert(title, message) {
  const overlay = document.getElementById('alert-overlay');
  const alertTitle = document.getElementById('alert-title');
  const alertMessage = document.getElementById('alert-message');
  
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  overlay.classList.add('active');
  
  // Focus the OK button for keyboard accessibility
  document.getElementById('alert-ok-button').focus();
}

// Close alert when OK button is clicked
document.getElementById('alert-ok-button').addEventListener('click', function() {
  document.getElementById('alert-overlay').classList.remove('active');
});

// Close alert when clicking outside the box
document.getElementById('alert-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('active');
  }
});

// Close alert with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('alert-overlay').classList.contains('active')) {
    document.getElementById('alert-overlay').classList.remove('active');
  }
});

chrome.storage.sync.get(['running'], (data) => {
  if (data.running) {
    document.getElementById("start-btn").disabled = true;
  } else {
    document.getElementById("start-btn").disabled = false;
  }
})