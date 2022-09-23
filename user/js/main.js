// import data from './data.js'
// import res from 'express/lib/response';
import barchart from './barchart.js'

// barchart.init('chart-anchor', 500, 300);
// barchart.render(data, 'Kilometers Run', 'Day of the Week');

let Progressbtn = document.getElementById("view-progress-btn");
Progressbtn.addEventListener("click", boo);

let closeBtn = document.getElementById("overlay-close-btn");
closeBtn.addEventListener("click", foo2)

let overlaySubmitBtn = document.getElementById("overlay-submit-btn");
overlaySubmitBtn.addEventListener("click", foo)

let overlay = document.getElementById("overlay");

let chartAnchor = document.getElementById("chart-anchor");

function boo() {
    overlay.classList.remove("hide");
}

function foo() {
    let tempDate = document.getElementById('overlay-date').value;
    // console.log("time1=" + tempDate);
    let date = new Date(tempDate.replace("-","/"));
    console.log("time2= " + date);
    let dateMilliseconds = date.getTime();
    let activity = document.getElementById('overlay-activities').value;

    // remove the previous chart so we dont end up with more than 
    // one chart at a time
    removePreviousChart(chartAnchor);

    // send GET request to get data
    fetch(`/week?date=${dateMilliseconds}&activity=${activity}`, {
        method: 'GET',
        headers: {
            // 'Content-Type': 'application/json',
            // 'Accept':'application/json'
          }
        // body: JSON.stringify(data),
    })
    .then((response) => {
        // if we dont use the return keyword it wont return 
        // because we have curly braces in this arrow function
        return response.json();
        // response.type
        // let data = new Array;// = Array.from(response);
        // response.forEach(element => {
        //     data.push(element);
        // });        
    })
    .then((datax) => {
        console.log(datax);
        barchart.init('chart-anchor', 500, 300);
        barchart.render(datax, 'Kilometers Run', 'Day of the Week');
    })
    .catch((err) => {
        console.error(err);
    });

    // barchart.init('chart-anchor', 500, 300);
    // barchart.render(data, 'Kilometers Run', 'Day of the Week');
}

function foo2 () {
    overlay.classList.add("hide");
}

function removePreviousChart(parentNode) {
    if (parentNode.children.length > 0) {
        parentNode.removeChild(parentNode.children[0]);
    }
    // parentNode.prepend(msgNode);
}