window.addEventListener('load',getLoadState);
window.addEventListener('load',preventFormSubmit);
//window.addEventListener('load',greet);
var newFolder;
var reqParameters = {};

function getLoadState() {
  console.log("getting load state");
  console.log(window.location);
  google.script.url.getLocation((loc) => {
    console.log("load state ",loc);
    reqParameters = loc.parameter;
    if (loc.parameter.base==="true") {greet()}
    if (loc.parameter.setup==="true") {initSetupPage()}
    if (loc.parameter.globals==="true") {initGlobalsPage()}
    if (loc.parameter.bugs==="true") {initBugPage()}
    if (loc.parameter.enhancements==="true") {initEnhancementsPage()}
    if (loc.parameter.users==="true") {initUsersPage()}
  });
}

function toggleVisible(element) {
  var containers = document.getElementsByClassName("section-container");
  for (var i = 0; i < containers.length; i++) {if (containers[i].id !== element.id && containers[i].stlye) {containers[i].style.display = "none";}}
  if (element.style) {element.style.display = "flex"}
}

function initUsersPage() {
  console.log("init updates page");
  toggleVisible(item("users-container"));
  //var cbObj = {"display_element": item("users-container")};
  var withSuccess = google.script.run.withSuccessHandler(displayUsers);
  var withFailure = withSuccess.withFailureHandler(failHandler) //.withUserObject(cbObj);
  withFailure.getUsers();
  showProgress(0, 0, 250, "Fetching Users. Please wait.", item("progress-container"), item("progress-msg"), item("spinner"), item("users-container"));
}

function displayUsers(cb) {
  const container = document.getElementById('users-container');
  cb.forEach(user => {
    let userDiv  = htmlElement({className: 'user-container'});
    userDiv.appendChild(htmlElement({innerHTML: user[0], className: 'user'}));
    userDiv.appendChild(htmlElement({innerHTML: user[1], className: 'user'}));
    container.appendChild(userDiv);
  });
}

function htmlElement(obj, parent) {
  if (obj.tag) {
    var element = document.createElement(obj.tag);
  } else {
    var element = document.createElement("DIV");
  }
  var keys = Object.keys(obj);
  keys.forEach(function(key) {
    if (key==="tag") {return}
    if (key.indexOf("data-")!==-1) {
      element.setAttribute(key,obj[key])
    } else if (key==="eventListener") {
      element.addEventListener(obj[key].event, obj[key].function)
    }
    else {element[key]=obj[key]}
  });
  if (parent) {
    parent.appendChild(element);
  } else {
    return element;
  }
}

function initUpdate(appName) {
  item("updates-callback").innerHTML = "";
  alert("Unable to update apps right now.");
  /*
  var cbObj = {"display_element": item("updates-callback")};
  var withSuccess = google.script.run.withSuccessHandler(confirmUpdates);
  var withFailure = withSuccess.withFailureHandler(failHandler).withUserObject(cbObj);
  withFailure.updateApp(appName);
  showProgress(0, 0,250, "Checking for available updates. Please wait.", item("progress-container"), item("progress-msg"), item("spinner"), item("updates-callback"));
  */
}

function confirmUpdates(msg) {
  item("updates-callback").innerHTML = msg+" app(s) updated successfully.";
}

function initEnhancementsPage() {
  toggleVisible(item("enhancement-container"));
}

function initBugPage() {
  toggleVisible(item("bug-container"));
}


function postGlobals(formBlob) {
  item("globals-callback").innerHTML = "";
  var cbObj = {"display_element": item("globals-callback")};
  getFormData(formBlob);
  var formObj = getFormData(formBlob);
  console.log(formObj);
  var withSuccess = google.script.run.withSuccessHandler(confirmGlobalsSave);
  var withFailure = withSuccess.withFailureHandler(failHandler).withUserObject(cbObj);
  withFailure.saveGlobals(formObj);
  item("globals-display").innerHTML = "";
  showProgress(0, 0,250, "Saving your data. This may take a couple minutes. Hang on.", item("progress-container"), item("progress-msg"), item("spinner"), item("globals-callback"));
}

function getFormData(form) {
  var out = [];
  var elements = form.getElementsByTagName("textarea");
  for (var i=0;i<elements.length;i++) {
    let obj = {};
    obj["key"] = elements[i].name;
    obj["value"] = elements[i].value;
    out.push(obj);
  }
  return out;
}

const confirmGlobalsSave = function(msg) {
  if (msg.error) {
    item("globals-callback").innerHTML = msg.error;
  } else {
    item("globals-callback").innerHTML = "<div>Your data was saved sucessfully. Please click the links below to update the UP Learning Apps</div><br>\
    <a target=_blank href='https://script.google.com/a/strongschools.nyc/macros/s/AKfycbyNuZDlNWQ-SOtdwZ3bXGFaLk0cg7WHVC9LCXUbOmOcCPxU1yiV/exec?globalupdate=aplss'>Event Creation Form</a><br>\
    <a target=_blank href='https://script.google.com/a/strongschools.nyc/macros/s/AKfycbzLNQ3zv6p2P-xa3xhQi2t5hPhsqvrxug99FDCEo4f2CdPIXU35/exec?globalupdate=aplss'>Facilitator Dashboard</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbxLKdBZMuyt5LO7ZMX4OEeXCk-HjexX6f4touUHPZYHsWijV1Hq/exec?globalupdate=aplss'>Data and Reports Dashboard</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbyf4W3SZl5P3xvIXIJ-RJ8o3UfNAjd0L2yebRfhgtih2yIISfM/exec?globalupdate=aplss'>Attendance App</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbwJWBNRPuHcfhT6jkCZWfUZDXsEzkW70XsuGaizDXEBO6HG1Xk6/exec?globalupdate=aplss'>Registrant Portal</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbz13TA6TRLjXeWWS4UzoZp0Si7VH0DV8Qjhco5ZG2FHe2y7j-Y/exec?globalupdate=aplss'>Registration Form</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbwXs13RmZjPTZMeTDLSNY6r5xVwmFc-HRGNW3lHFLRudH1iBG0/exec?globalupdate=aplss'>Feedback</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbypayx_JCyp7x3rNrtRCpIhd1K-EH4gXnrJaAIjnSkMtC_tnyKg/exec?globalupdate=aplss'>Event Catalog</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbzxslr3lnJlzLFoQqjEGHru9GlOaV32EOHs6gSE1CEdgzYlrxk/exec?globalupdate=aplss'>Sign in App</a><br>\
    <a target=_blank href='https://script.google.com/macros/s/AKfycbz4AthfjpkN8d_pttRsnKfYnsQp_Fal9N5O4tHpQX6Q-Hm58oo/exec?globalupdate=aplss'>Event Page</a><br><br>\
    <button onclick='initGlobalsPage()'>Reload Globals</button>"
  }
}

function initGlobalsPage() {
  toggleVisible(item("globals-mgmt-container"));
  var cbObj = {"display_element": item("globals-callback")}
  var withSuccess = google.script.run.withSuccessHandler(displayGlobals);
  var withFailure = withSuccess.withFailureHandler(failHandler).withUserObject(cbObj);
  withFailure.getGlobals();
  showProgress(0, 0, 250, "Fetching your global variables. Hang on.", item("progress-container"), item("progress-msg"), item("spinner"), item("globals-callback"));
}

function displayGlobals(globals) {
  console.log("globals: ",globals);
  item("globals-callback").innerHTML = "Here are all of the global variables listed for your instance.";
  var header = document.createElement("div");
  header.className = "header-row";
  header.innerHTML = "<div><strong>#</strong></div>\
            <div class='name-cell'><strong>Name</strong></div>\
            <div class='form-cell'><strong>Reference Type</strong></div>\
            <div class='form-cell'><strong>Your Last Update</strong></div>\
            <div class='text-cell'><strong>Reference Value</strong></div>";
  item("globals-display").appendChild(header);
  globals.forEach(function(reference,index) {
    if (!reference) {return;}
    let newDiv = document.createElement("div");
    newDiv.className = "form-row";
    newDiv.innerHTML = "<div>"+Number(index+1)+"</div>\
    <div class='name-cell'>"+reference.name+"</div>\
    <div class='form-cell'>"+reference.ref_type+"</div>\
    <div class='form-cell'>"+reference.last_update+"</div>\
    <textarea class='text-cell' name='"+reference.key+"' placeholder='"+reference.placeholder+"'>"+reference.ref+"</textarea>";
    item("globals-display").appendChild(newDiv);
  });
  var submit = document.createElement("input");
  submit.type = "submit";
  item("globals-display").appendChild(submit);
}

function initSetupPage() {
  toggleVisible("");
  var cbObj = {"display_element": item("setup-callback")}
  console.log("initiating setup page");
  var withSuccess = google.script.run.withSuccessHandler(displaySetupPage);
  var withFailure = withSuccess.withFailureHandler(failHandler).withUserObject(cbObj);
  withFailure.getConfigStatus();
  showProgress(0, 0,250, "Checking for existing systems. Hang on.", item("progress-container"), item("progress-msg"), item("spinner"), item("setup-callback"));
}

function displaySetupPage(msg) {
  if (msg.success) {
  item("setup-container").style.display = "";
  item("setup-callback").innerHTML = "Great. You're ready for set up."
  } else {
    item("setup-callback").innerHTML = msg.msg;
  }
}

function postNewUser(form) {
  var withSuccess = google.script.run.withSuccessHandler(function() {
    form.innerHTML = "<div>New User saved. Refresh the page.";
  });
  var withFailure = withSuccess.withFailureHandler(function(error) {
    form.innerHTML = error;
  });
  withFailure.saveNewUser(form);
}


function greet() {
  google.script.run.withSuccessHandler((user) => {
  console.log(user);
  if (!user) {
    item("base-container").style.display = "";
    item("greeting").innerHTML = "Oops. The email address you're logged in with isn't associated with any Borough Offices. <button onclick='document.getElementById(\"new-user-form\").style.display=\"\"'>Add this email account</button>";
    return;
  }
  item("base-container").style.display = "";
  item("greeting").innerHTML = "Hi "+user.dm+". Welcome to APLSS (The Application for Professional Learing System Support).<br><br>What would you like to do?"
  item("platform-select-container").style.display = "flex";
  }).getUser();
}

function showProgress(progress, callCount, speed, message, displayContainer, messageContainer, displayElement, baseCaseElement) {
  if (baseCaseElement.innerHTML !== "") {displayContainer.style.display = "none"; displayElement.style.display = "none"; return;}
  displayContainer.style.display = "flex";
  displayContainer.style.position = "absolute";
  displayContainer.style.top = Number(browserHeight()*0.25)+"px";
  displayContainer.style.left = Number(browserWidth()*0.33)+"px";
  displayElement.style.display = "";
  if (callCount > 100) {message = "Still working."}
  if (callCount > 200) {message = "Getting there."}
  if (callCount > 400) {message = "Almost done."}
  messageContainer.innerHTML = message;
  var canvas = displayElement.getContext("2d");
  canvas.lineWidth = 5;
  if(progress>2) {canvas.clearRect(0,0,displayElement.width, displayElement.height); progress=0.5;}
  canvas.beginPath();
  canvas.arc(25,25,20,0*Math.PI,progress*Math.PI);
  canvas.stroke();
  setTimeout(function() {showProgress(progress+0.5,callCount+1,speed,message,displayContainer,messageContainer,displayElement,baseCaseElement)},speed);  
}

const item = function(element) {
  return document.getElementById(element);
}

function serverCallback(msg) {
  item("callback-msg").innerHTML = msg;
}

function browserWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function browserHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function initiateCopy() {
  console.log("initiating copy");
  var cbObj = {"display_element": item("copy-callback")}
  var withSuccess = google.script.run.withSuccessHandler(verifyCopy);
  var withFailure = withSuccess.withFailureHandler(failHandler).withUserObject(cbObj);
  withFailure.makeCopy();
  showProgress(0,0,250, "Initializing your new PL system instance. This can take a few minutes. Hang on.", item("progress-container"), item("progress-msg"), item("spinner"), item("copy-callback")) 
}

function verifyCopy(msg) {
  item("setup-callback").innerHTML = "";
  item("copy-template").className = "process-complete";
  item("copy-template").innerHTML = "Copy Successful."
  item("continue-setup").style.display = "flex";
  item("copy-callback").innerHTML = "Copied "+msg.num_files+" files to your new PL System instance folder. \
  And copied reference IDs for "+msg.num_refs_updated+" files in the global references sheet.<br><br>\
  Your new PL system Instance's folder is saved in the root folder of your Google Drive <a class='custom-buttons' \
  style='padding: 2.5px; display: inline;' href='"+msg.new_folder_url+"' target=_blank>\
  here</a>. Please note that the IDs and URLs for all files and folders in your instance have been saved for reference by your script. So you do not need to paste them into your global variables. But, you should visit the global management page to enter any data specific to your borough office (e.g. DBN lists and directors's emails). <strong>Do not rename any of the files, folders, sheets, or variables associated with your new instance.</strong>"; 
}

function failHandler(msg,callbackObj) {
  callbackObj.display_element.innerHTML = msg;
}

function showForm() {
  item("copy-form").style.display = "";
  item("parent-folder-input").focus();
}

function preventFormSubmit() {
        var forms = document.querySelectorAll('form');
        for (var i = 0; i < forms.length; i++) {
          forms[i].addEventListener('submit', function(event) {
            event.preventDefault();
          });
        }
}