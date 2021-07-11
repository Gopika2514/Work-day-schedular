// Function to contain all other functions
function initiatePlanner() {

    function currentDateHour() {

        // Get current time and date from Moment.js
        const momentObj = moment();

        const currentDate = momentObj.format("dddd, MMMM Do");

        const currentHour = momentObj.format("k");

        const current = {
            date: currentDate,
            hour: currentHour
        };
        // Used so that when the function is called the value it returns is the object current.
        return current;
    }

    // Update header to show current date
    function showCurrentDate() {
        const DateHour = currentDateHour();
        const currentDayEl = document.getElementById('currentDay');
        currentDayEl.innerText = DateHour.date;
    }
    showCurrentDate();


    // Checks if the user has created and stored any activites previously. If user has created activities, the activities are returned.
    function checkLocalStorage() {
        // Defines a variable to store existing activities
        let existingHours = [];

        if (localStorage.getItem('existingHours')) {
            const hoursStringified = localStorage.getItem('existingHours');

            // Transforms stringified data into an object
            existingHours = JSON.parse(hoursStringified);

            // Get date of existing data
            const existingDate = existingHours[0].date;

            // Get current date
            const currentDate = currentDateHour().date;


            if (currentDate === existingDate) {
                return existingHours;
            }
            else {
                return false;
            };
        }
        else {
            return false;
        };
    };

    // Creates an array that will be used to render the calendar.
    function createHoursArray() {

        // Creates an array that will store either existing activities or a blank set of activities used to fill out the calendar
        const hours = [];
        // -- i starts at 9 and ends at 17 to create the hours 9am - 5pm
        for (let i = 9; i <= 17; i++) {
            let t = moment(i, "H").format("h:mm A");
            let singleHour = {
                date: currentDateHour().date,
                time: i,
                stringTime: t,
                activity: " "
            };
            // Adds the hour object to the array
            hours.push(singleHour);
        };

        // Returns array of hours, which contains an object per hour for the hours of 9AM to 5PM
        return hours;
    };
    function renderCalendar() {

        let hours = [];
        
        let check = checkLocalStorage();

        if (check) {
            hours = checkLocalStorage();
        } else {
            hours = createHoursArray();
        };

        // Creates each row of the calendar
        for (i = 0; i < hours.length; i++) {

            const rowEl = document.createElement('row');
            rowEl.classList.add('row');

            const colEl1 = document.createElement('div');
            colEl1.classList.add('time-block', 'hour', 'col-2', 'p-0');

            const colEl2 = document.createElement('div');
            colEl2.classList.add('description', 'col-9', 'p-0');

            const colEl3 = document.createElement('div');
            colEl3.classList.add('button-column', 'col-1', 'p-0');

            const saveButton = document.createElement('button');

            saveButton.classList.add('far', 'fa-save', 'saveBtn');

            const activityInput = document.createElement('input');
            activityInput.classList.add('description')

            // Styles : Past is grey, present is white, future is green
            
            if (hours[i].time < moment().format("k")) {
                activityInput.classList.add('past')
            }
            if (hours[i].time === moment().format("k")) {
                activityInput.classList.add('present')
            }
            if (hours[i].time > moment().format("k")) {
                activityInput.classList.add('future')
            }

            // Creates a unique id for each input. Used later for button event listener
            activityInput.setAttribute("id", "input-" + (i));

            saveButton.setAttribute("id", "button-" + (i));
            // updates inner text of column 1 to display the time for that row
            colEl1.innerText = hours[i].stringTime;
            // appends input to column 2
            colEl2.append(activityInput);
            // appends button to column 3
            colEl3.append(saveButton);
            // updates input value with corresponding activity for that row if any exist
            activityInput.value = hours[i].activity;
            // appends all three columns to the row
            rowEl.append(colEl1, colEl2, colEl3);


            const containerEl = document.querySelector('.container');
            containerEl.append(rowEl);
            containerEl.classList.add('mx-auto')

            // When a save button is clicked, the text in the corresponding input is saved to local storage
            saveButton.addEventListener('click', function () {

                const hourInput = event.target.id.replace('button-', 'input-');
                const hoursIndex = event.target.id.replace('button-', '');
                hours[hoursIndex].activity = document.getElementById(hourInput).value;
                const hoursStringified = JSON.stringify(hours);

                localStorage.setItem('existingHours', hoursStringified);

            });
        };
    };
    renderCalendar();

    function hourFormatSwitch() {
        let hourSwitchbtnEl = document.getElementById('hour-switch');

        hourSwitchbtnEl.addEventListener('click', function () {

            console.log('switch button clicked', hourSwitchbtnEl.innerText);
            const timeArray = createHoursArray();
            if (hourSwitchbtnEl.innerText === "24H") {

                hourSwitchbtnEl.innerText = "12H";
                const hourTexts = document.querySelectorAll(".hour");

                for (let i = 0; i < timeArray.length; i++) {
                    hTime = timeArray[i].time;

                    hhTime = moment(hTime, "H").format("HHmm");
                    hourTexts[i].innerText = hhTime;

                }

            } else {
                hourSwitchbtnEl.innerText = "24H";
                const hourTexts = document.querySelectorAll(".hour");

                for (let i = 0; i < timeArray.length; i++) {
                    backTime = timeArray[i].stringTime;

                    hourTexts[i].innerText = backTime;

                }
            };
        });
    }
    hourFormatSwitch();
};
initiatePlanner();