/* eslint-disable max-statements */

window.addEventListener('load', function() {
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
  $('#modal-vertical').modal({show: true});
});

const getMultiSelectValues = input => {
    const options = [...input.getElementsByTagName('OPTION')];
    return options.reduce((values, option) => {
        if (option.selected) values.push(option.value);
        return values;
    }, []);
}

const filterEvents = filters => {
  // for (let i = 0; i < filters.length; i++) {
  //   for (let j = 0; j < allEvents.length; j++) {
  //     if (filters[i].hasOwnProperty('wildcard')) {
  //       if (JSON.stringify(allEvents[j]).indexOf(filters[i].wildcard) === -1) {

  //       }
  //     }
  //   }
  // }
}

const fetchEvents = instances => {
    if (instances.length === 0) return;
    console.log(`fetching event data for ${instances}`);
    document.getElementById('main-spinner').style.display = '';
    document.getElementById('main-spinner-msg').innerHTML = 'Loading Events...';
    const withSuccess = google.script.run.withSuccessHandler(renderEvents);
    const withFailure = withSuccess.withFailureHandler(function(error) {
        console.log(error);
    });
    withFailure.getEvents(instances);
}

const renderEvents = eventData => {
    document.getElementById('main-spinner').style.display = 'none';
    let parent = document.getElementById('event-container');
    parent.innerHTML = '';
    for (let i = 0; i < eventData.length; i++) {
      let event = JSON.parse(eventData[i]);
      parent.appendChild(eventCard(event));
    }
}

const eventCard = data => {
    //card container
    const container = htmlElement({className: 'card col-12 col-xl-5 event-card'});
    const header = htmlElement({className: 'card-header'});
    const headerContentContainer = htmlElement({className: 'header-content-container'});
    headerContentContainer.appendChild(htmlElement({innerHTML: data.borough_office}));
    headerContentContainer.appendChild(htmlElement({innerHTML: `Division of ${data.division}`}));
    //evnet card header
    const headerButtonsContainer = htmlElement({className: 'header-buttons-conainer'});
    headerButtonsContainer.appendChild(htmlElement({tag: 'A', className: 'btn btn-outline-primary btn-sm', innerHTML: 'More Info', href: data.event_page}))
    headerButtonsContainer.appendChild(htmlElement({tag: 'A', className: 'btn btn-primary btn-sm', innerHTML: 'Register', href: data.reg_url}))
    header.appendChild(headerContentContainer);
    header.appendChild(headerButtonsContainer);
    container.appendChild(header);
    //card body
    const body = htmlElement({className: 'card-body'});
    body.appendChild(htmlElement({tag: 'H5', className: 'card-title', innerHTML: data.title}));
    //Event date, time, location
    const eventDetailsContainer = htmlElement({className: 'event-details-container'});
    const datesContainer = htmlElement({className: 'event-sub-details-container'});
    datesContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">calendar_today</i>'}));
    datesContainer.appendChild(htmlElement({innerHTML: data.dates}));
    eventDetailsContainer.appendChild(datesContainer);
    const locationContainer = htmlElement({className: 'event-sub-details-container'});
    locationContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">location_city</i>'}));
    locationContainer.appendChild(htmlElement({innerHTML: data.location}));
    eventDetailsContainer.appendChild(locationContainer);
    const timesContainer = htmlElement({className: 'event-sub-details-container'});
    timesContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">access_time</i>'}));
    timesContainer.appendChild(htmlElement({innerHTML: data.times}));
    eventDetailsContainer.appendChild(timesContainer);
    //Event Description
    const eventDescriptionContainer = htmlElement({className: 'event-description-container'});
    eventDescriptionContainer.appendChild(htmlElement({innerHTML: '<b>Abbout this event:</b>'}));
    eventDescriptionContainer.appendChild(htmlElement({className: 'event-description', innerHTML: data.description}));
    body.appendChild(eventDetailsContainer);
    body.appendChild(eventDescriptionContainer);
    container.appendChild(body);
    return container;
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