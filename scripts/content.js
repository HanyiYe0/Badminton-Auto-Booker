chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime', 'location'], (data) => {
    wantedStartTime = data.startTime;
    wantedEndTime = data.endTime;
    wantedFullTime = formateTime(wantedStartTime, wantedEndTime);
    activity = data.sportType;
    dateWanted = formatDate(data.date);
    wantedLocation = data.location;
    isDate = false;
    found = false;
    console.log(wantedFullTime);
    // Find all date rows
    const table = document.getElementById("classes");
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        // check if the date is correct
        if (rows[i].classList.contains('bm-marker-row')) {
            if (rows[i].textContent.includes(dateWanted)) {
                isDate = true;
            } else {
                isDate = false;
            }
        };
        // if date is correct, get all the activities under that date
        if (isDate && rows[i].classList.contains('bm-class-row')) {
            //console.log(rows[i].textContent);
            // check if the activity is correct
            if (rows[i].textContent.includes(activity)) {
                // check if time is correct
                if (rows[i].textContent.includes(wantedFullTime)) {
                    // check if location is correct
                    if (rows[i].textContent.includes(wantedLocation)) {
                        // check if slot open
                        console.log(rows[i].textContent);
                        buttonId = rows[i].querySelector('input[type="button"]').id;
                        console.log(buttonId);
                        if (rows[i].textContent.includes("Register")) {
                            chrome.runtime.sendMessage({
                                action: "slotOpen",
                                type: buttonId,
                            });
                            found = true;
                        };
                    };
                };
            };
        };
    };
    if (found === false) {
        chrome.runtime.sendMessage({
            action: "noSlotsFound"
        });
    }
});



function formatDate(date) {
    const words = date.split('-');
    const numToLetter = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    };

    let output = ""
    // Check last index then convert into string
    if (words[2].charAt(words[2].length-1) === '1') {
        output = numToLetter[words[1]] + " " + Number(words[2]).toString() + "st, " + words[0];
    } else if (words[2].charAt(words[2].length-1) === '2') {
        output = numToLetter[words[1]] + " " + Number(words[2]).toString() + "nd, " + words[0];
    } else if (words[2].charAt(words[2].length-1) === '3') {
        output = numToLetter[words[1]] + " " + Number(words[2]).toString() + "rd, " + words[0];
    } else {
        output = numToLetter[words[1]] + " " + Number(words[2]).toString() + "th, " + words[0];
    }
    return output
}

function formateTime(sTime, eTime) {
    let sList = sTime.split(':');
    let eList = eTime.split(':');
    let sTimeString;
    let eTimeString;
    if (Number(sList[0]) > 12) {
        sList[0] = (Number(sList[0]) - 12).toString()
        sTimeString = "pm";
    } else if (Number(sList[0]) === 12){
        sList[0] = sList[0].toString()
        sTimeString = "pm";
    } else {
        sTimeString = "am";
    };

    if (Number(eList[0]) >= 12) {
        eList[0] = (Number(eList[0]) - 12).toString()
        eTimeString = "pm";
    } else if (Number(eList[0]) === 12){
        eList[0] = eList[0].toString()
        eTimeString = "pm";
    } else {
        eTimeString = "am";
    };


    let formatedSTime = sList[0].padStart(2, '0') + ":" + sList[1] + " " + sTimeString;
    let formatedETime = eList[0].padStart(2, '0') + ":" + eList[1] + " " + eTimeString;

    let output = formatedSTime + " - " + formatedETime;
    return output
}

