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
    await chrome.storage.sync.set({ program, activity, date, startTime, endTime, location, username, password, autoLogin, emailNotification, email, smsNotification, number }, () => {
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