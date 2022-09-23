"use strict";

let reminderDateString;

// Sending a GET request for /reminder as soon as page is loaded
fetch(`/reminder`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',        
      }    
})
// we're returning response.json() to the next chained callback function
// this response.json() (which is from fetch API) doesnt actually create a JSON but
//  instead takes the JSON as input and produces a JS Object
.then(response => response.json())
// this callback function will receive the response.json() and do its thing
.then(responseData => {
    console.log(responseData); 
    // console.log(typeof(responseData));
    displayReminder(responseData);
})
.catch(error => {
    console.log(error);
});

 
let addPastActivityButton = document.getElementById("addPastActivityBtn");
addPastActivityButton.addEventListener("click", addPastActivityOnClick);

let addFutureActivityButton = document.getElementById("addFutureActivityBtn");
addFutureActivityButton.addEventListener("click", addFutureActivityOnClick);

let submitPastActivityBtn = document.getElementById("submitPastActivityBtn");
submitPastActivityBtn.addEventListener("click", submitPastActivityOnClick);

let submitFutureActivityBtn = document.getElementById("submitFutureActivityBtn");
submitFutureActivityBtn.addEventListener("click", submitFutureActivityOnClick);

let pastActivityDropdown = document.getElementById("pActActivity");
pastActivityDropdown.addEventListener("change", pastActivityDropdownOnChange);

let reminderYesBtn = document.getElementById("reminder-yes-btn");
reminderYesBtn.addEventListener("click", yesReminderOnClick);

let reminderNoBtn = document.getElementById("reminder-no-btn");
reminderNoBtn.addEventListener("click", noReminderOnClick);

/**
 * Event for when the user clicks on YES in the reminder section.
 * It closes the reminder tab and opens up the Past Activity Form. 
**/
function yesReminderOnClick() {
    let reminderSection = document.getElementById("reminder-section");
    reminderSection.classList.add("hide");

    addPastActivityOnClick();
    let pActDate = document.getElementById("pActDate");
    pActDate.value = reminderDateString;
}

/**
 * Event for the NO button in the reminder section. It simply closes the reminder tab.
 */ 
function noReminderOnClick() {
    let reminderSection = document.getElementById("reminder-section");
    reminderSection.classList.add("hide");
}

function pastActivityDropdownOnChange() {
    let pActUnit = document.getElementById("pActUnit");

    switch (pastActivityDropdown.value) {
        case "Walk": case "Run": case "Bike":
            pActUnit.value = "km";
            break;
        case "Swim":
            pActUnit.value = "laps";
            break;
        case "Yoga": case "Basketball": case "Soccer":
            pActUnit.value = "minutes";
            break;
        default:
            pActUnit.value = "units";
    }
}

function addPastActivityOnClick() {
    let pastAddButtonDiv = document.getElementById("pastAdd");
    let pastForm = document.getElementById("pastForm");

    pastAddButtonDiv.classList.add("hide");
    pastForm.classList.remove("hide");    
}

function addFutureActivityOnClick() {
    let futureAddButtonDiv = document.getElementById("futureAdd");
    let futureForm = document.getElementById("futureForm");

    futureAddButtonDiv.classList.add("hide");
    futureForm.classList.remove("hide");    
}

function submitPastActivityOnClick() {

    let pastAdd = document.getElementById("pastAdd");
    let pastForm = document.getElementById("pastForm");
    
    /* Activity Data to Send to Server */
    let data = {
        date: reformatDate(document.getElementById('pActDate').value),
        activity: document.getElementById('pActActivity').value,
        scalar: document.getElementById('pActScalar').value,
        units: document.getElementById('pActUnit').value
    }

    // Check if Inputs are valid.
    try {
        pastActivityInputValid(data);
    } catch (err) {
        alert(err);
        return;
    }

    
    // Creating submission message
    let p = document.createElement("p");
    p.textContent = `Got it! ${data.activity} for ${data.scalar} ${data.units}. Keep it up!`;
    submissionConfirmation(p, pastAdd);

    pastAdd.classList.remove("hide");
    pastForm.classList.add("hide");

    // fetch() is an asynchronous function
    fetch(`/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Accept':'application/json'
          },
        body: JSON.stringify(data),
    })
    // we're returning response.json() to the next chained callback function
    .then(response => response.json()) 
    // this callback function will catch the response.json() and do its thing
    .then(responseData => {
        console.log("Text Gotten: ", responseData);        
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

// Function for submission confirmation
// if the parentNode (i.e. the div with the add button) already has
// a confirmation message from a previous submission (i.e. length > 1)
// then we remove that message, which should be at index 0 since we're prepending
// all the msgNodes
function submissionConfirmation(msgNode, parentNode) {
    if (parentNode.children.length > 1) {
        parentNode.removeChild(parentNode.children[0]);
    }
    parentNode.prepend(msgNode);
}

function submitFutureActivityOnClick() {

    let futureAdd = document.getElementById("futureAdd");
    let futureForm = document.getElementById("futureForm");
    

    /* Activity Data to Send to Server */
    let data = {
        date: reformatDate(document.getElementById('fActDate').value),
        activity: document.getElementById('fActActivity').value        
    }

    // Check if Inputs are valid.
    try {
        futureActivityInputValid(data);
    } catch (err) {
        alert(err);
        return;
    }
    
    // Creating submission message
    let p = document.createElement("p");
    p.textContent = `Sounds good! Don't forget to come back to update your session for ${data.activity} on ${data.date}!`;
    submissionConfirmation(p, futureAdd);

    // Unhide the add button and hide the form
    futureAdd.classList.remove("hide");
    futureForm.classList.add("hide");

    // Sending the data to the server
    fetch(`/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Accept':'application/json'
          },
        body: JSON.stringify(data),
    })
    // response.json() is actually response.send(JSON.stringify(x))
    .then(response => response.json())
    .then(data => {
        console.log("Text Gotten: ", data);        
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

function pastActivityInputValid(data) {
    let todaysDate = new Date();
    let pastDate = new Date(data.date);
    
    if (pastDate.getTime() > todaysDate.getTime() || pastDate == "Invalid Date" ) {
        throw "Invalid date. Please provide a date that is before today's date."
    }

    if (data.date == "" || data.activity == "" || data.scalar == "" || data.units == "") {
        throw "Invalid Form. Please fill out the entire form."
    }
}

function futureActivityInputValid(data) {
    let todaysDate = new Date();
    let futureDate = new Date(data.date);
    // tempDate.setDate(tempDate.getDate() + 1);

    // console.log("todaysDate=" + todaysDate + "tempdate=" + tempDate);
    
    if (futureDate.getTime() < todaysDate.getTime() || futureDate == "Invalid Date" ) {
        throw "Invalid date. Please provide a date that is after today's date."
    }

    if (data.date == "" || data.activity == "") {
        throw "Invalid Form. Please fill out the entire form."
    }
}


function displayReminder(reminderJSON) {
    let reminder = JSON.parse(reminderJSON);
    console.log(reminder);
    // create html elements
    let reminderMsg = document.createElement("h1");
    let reminderMsgNode = document.getElementById("reminder-section-reminder");

    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1); 

    let reminderDate = new Date(reminder.date);
    
    // Create a string with the reminder date in specified format
    reminderDateString = `${reminderDate.getFullYear()}-${reminderDate.getMonth() + 1}-${reminderDate.getDate()}`
    
    if (yesterdayDate.getDate() == reminderDate.getDate()) {
        reminderMsg.textContent = `Did you ${reminder.activity} yesterday?`;
    } else {
        reminderMsg.textContent = `Did you ${reminder.activity} on ${reminderDateString}?`;
    }    

    // Appending will ensure it shows up in the proper div and on the page
    reminderMsgNode.appendChild(reminderMsg);

    let reminderSection = document.getElementById("reminder-section");
    reminderSection.classList.remove("hide");
    // return "Reminder: Success";
}

function reformatDate(domDate) {
    // replace all instances of "-" with "/"
    return domDate.replace(/-/g, "/");
}