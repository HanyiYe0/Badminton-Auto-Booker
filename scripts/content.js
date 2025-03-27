chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime'], (data) => {
    wantedStartTime = data.startTime;
    wantedEndTime = data.endTime;
    activity = data.sportType;
    dateWanted = formatDate(data.date);
    isDate = false;
    console.log(dateWanted);
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
        if (isDate && rows[i].classList.contains('bm-class-row')) {
            console.log(rows[i].textContent);
        };
    };
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

