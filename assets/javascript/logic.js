// alert("logic is linked");

// For timepicker pop-up on form for materialize
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: false, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
  });

  var config = {
    apiKey: "AIzaSyDCnBR0nBqO6mRBH5aELFrc3WISW_AiXNY",
    authDomain: "stephen-numberone.firebaseapp.com",
    databaseURL: "https://stephen-numberone.firebaseio.com",
    projectId: "stephen-numberone",
    storageBucket: "stephen-numberone.appspot.com",
    messagingSenderId: "802261033661"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $('#submit').on('click', function() {
    // console.log("button works");
    var trainName = $('#train_name').val().trim();
        console.log("This is the train name: " + trainName);
    var destination = $('#destination_name').val().trim();
        console.log("The train goes to: " + destination);
    var frequency = $('#frequency').val().trim();
        console.log("The train runs every: " + frequency + " minutes.");
    var firstTime = $('#first_train_time').val().trim();
        console.log("The first train time is: " + firstTime);
    // TODO: make sure you have a value in the form fields for submit to work, use if statement
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    })
    $('#train_name').val("");
    $('#destination_name').val("");
    $('#frequency').val("");
    $('#first_train_time').val("");
  })

  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTime;

    // use childSnapshot to get the value back from the database
    var trainStart = childSnapshot.val().firstTime;
    //set year back 1 year to make sure it's before current time
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Get current time from Moment.js
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Time Difference: " + timeDifference);
    // in case there's a remainder...
    var remainder = timeDifference % frequency;
    console.log(remainder);

    var minsTillTrain = frequency - remainder;
    console.log("Minutes till train: " + minsTillTrain);

    var nextTrain = moment().add(minsTillTrain, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

    $("#train-schedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency +
"</td><td>" + (nextTrain).format("hh:mm a") + "</td><td>" + minsTillTrain + "</td></tr>");

});


  