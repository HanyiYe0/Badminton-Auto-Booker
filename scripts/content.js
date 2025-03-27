chrome.storage.sync.get(['sportType', 'date', 'startTime', 'endTime'], (data) => {
    wantedStartTime = data.startTime;
    wantedEndTime = data.endTime;
    activity = data.sportType;
    dateWanted = data.date;

    // Find all date rows
    const table = document.getElementById("classes");
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        console.log(rows[i].textContent);
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
}

