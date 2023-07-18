// the code isn't run until the browser has finished rendering all the elements in the html.
$(function () {
  // global variables
  let today = dayjs().format("MMMM DD, YYYY (dddd)");
  let currentHours = dayjs().format("HH");
  let timeBlockDiv;

  // Display the current date in the header
  $("#currentDay").text(today);

  // present time blocks for standard business hours of 9am to 5pm
  function displayTimeBlocks(){
    for(let hour = 9; hour <= 17; hour++){
      let displayHour = hour;
      if (hour > 12){
        displayHour = hour - 12;
      }

      timeBlockDiv = $("<div></div>").attr("id", "hour-" + hour).addClass("row time-block");
      let timeBlockContents = 
      `
      <div class="col-2 col-md-1 hour text-center py-3">${hour > 11? displayHour + ":00 PM" : displayHour + ":00 AM"}</div>
      <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
      <button class="btn saveBtn col-2 col-md-1" aria-label="save">
      <i class="fas fa-save" aria-hidden="true"></i>
      </button>
      `
      
      $("#timeBlockContainer").append(timeBlockDiv);
      timeBlockDiv.append(timeBlockContents);

      // The time block color changes depending on the current time.
      if(currentHours > hour){  
        timeBlockDiv.addClass("past");
      }else if(currentHours == hour){
        timeBlockDiv.addClass("present");
      }else{
        timeBlockDiv.addClass("future");
      }
    }
  }
  displayTimeBlocks();
  


  // Get schedule list from local storage
  let storedObjects = JSON.parse(localStorage.getItem("schedule"));
  if (!storedObjects){
    storedObjects = [];
  }

  function getSavedSchedule(){  
    $("#timeBlockContainer .time-block").each(function(){
      let timeBlockId = $(this).attr("id");
      for(let i = 0; i < storedObjects.length; i++){
        let storedItemId = storedObjects[i].id;
        if(timeBlockId == storedItemId){
          $(this).find(".description").val(storedObjects[i].value);
        }
      }
    });
  }
  getSavedSchedule();


  // When the save button is clicked, values of textarea save to local storage
  function handleSaveSchedule(){
    let description = $(this).siblings(".description").val();
    let descriptionBlockId = $(this).parent(".time-block").attr("id");
    let descriptionObj = {
      value: description,
      id: descriptionBlockId
    }

    storedObjects.push(descriptionObj);
    window.localStorage.setItem("schedule", JSON.stringify(storedObjects));
  }
  
  // Event Listener
  $("#timeBlockContainer").on("click", ".saveBtn", handleSaveSchedule);
});
