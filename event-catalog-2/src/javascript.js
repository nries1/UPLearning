/* eslint-disable max-statements */

window.addEventListener('load', function() {
  // JQuery to add popover functionality
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
  //prevent forms from loading a new page on submit
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener('submit', function(event) {
        event.preventDefault();
      });
    }
    // look for url parameters
    google.script.url.getLocation(loc => {
      if (loc.parameters.instance) {
        fetchEvents(loc.parameters.instance);
      } else {
        // show the first modal box to allow users to select their Bco
        $('#modal-vertical').modal({show: true});
      }
    });
});

const getMultiSelectValues = input => {
    const options = [...input.getElementsByTagName('OPTION')];
    return options.reduce((values, option) => {
        if (option.selected) values.push(option.value);
        return values;
    }, []);
}

const clearFilters = () => {
  document.getElementById('quick-search').value = '';
  const eventCards = document.getElementsByClassName('event-card');
  for (let i = 0; i < eventCards.length; i++) {
        eventCards[i].style.display = 'flex';
      }
  document.getElementById('total-events-badge').innerHTML = eventCards.length;
}

// eslint-disable-next-line no-confusing-arrow
const displayAfterWildcardFilter = (event, filter) => event.indexOf(filter) === -1 ? 'none' : 'flex';

const displayAfterFilter = (event, filterKey, filterValue) =>
  event[filterKey].toString().toLowerCase().indexOf(filterValue.toString().toLowerCase()) === -1 ? 'none' : 'flex';

const filterEventsWithWildcard = filter => {
  let events = 0;
  if (filter.wildcard === '') {
    clearFilters();
  } else {
    const eventCards = document.getElementsByClassName('event-card')
    for (let i = 0; i < eventCards.length; i++) {
      const filteredDisplay = displayAfterWildcardFilter(eventCards[i].dataset.obj, filter.wildcard)
      eventCards[i].style.display = filteredDisplay;
      if (filteredDisplay === 'flex') events++;
    }
  }
  document.getElementById('total-events-badge').innerHTML = events;
}
const displayAfterDateFilter  = (event, startDate, endDate) => {
  if (startDate === '') {
    startDate = 0;
  } else {
    startDate = new Date(startDate).getTime();
  }
  if (endDate === '') {
    endDate = Infinity;
  } else {
    endDate = new Date(endDate).getTime();
  }
  const dates = event.dates.split(',');
  const firstDate = new Date(dates[0]).getTime()
  const lastDate = new Date(dates[dates.length - 1]).getTime()
  return (firstDate >= startDate && lastDate <= endDate) ? 'flex' : 'none';
}

const filterEvents = filters => {
  console.log('filters ', filters);
  let displayedEvents = 0;
  const eventCards = document.getElementsByClassName('event-card');
  const filterKeys = Object.keys(filters);
  for (let i = 0; i < eventCards.length; i++) {
    const eventObj = JSON.parse(eventCards[i].dataset.obj);
    let eventDisplay = filterKeys.reduce((display, filter) => {
      if (display === 'none' ) return display;
      if (filter === 'end_date') return displayAfterDateFilter(eventObj, filters.start_date, filters.end_date);
      if (filter === 'start_date' || filters[filter] === '') return display;
      return displayAfterFilter(eventObj, filter, filters[filter]);
    }, 'flex');
    eventCards[i].style.display = eventDisplay;
    if (eventDisplay === 'flex') displayedEvents++;
  }
  document.getElementById('total-events-badge').innerHTML = displayedEvents;
}

function FormObj(form) {
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].name !== '') {
      this[elements[i].name] = elements[i].value;
    }
  }
}

const fetchEvents = instances => {
    if (instances.length === 0) return;
    console.log(`fetching event data for ${instances}`);
    console.log(`${instances.length} instances`);
    if (instances[0] === '') {
      instances = ['Affinity PL System', 'Brooklyn South PL System', 'Brooklyn North PL System', 'Central PL System', 'Bronx PL System', 'Manhattan PL System', 'Queens North PL System', 'Queens South PL System', 'Staten Island PL System']
    }
    document.getElementById('main-spinner').style.display = '';
    document.getElementById('main-spinner-msg').innerHTML = 'Loading Events...';
    document.getElementById('event-container').innerHTML = '';
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
    document.getElementById('total-events-badge').innerHTML = eventData.length;
}

const eventCard = data => {
    //card container
    const container = htmlElement({className: 'card col-12 col-xl-5 event-card', 'data-obj': JSON.stringify(data)});
    const header = htmlElement({className: 'card-header'});
    const headerContentContainer = htmlElement({className: 'header-content-container'});
    headerContentContainer.appendChild(htmlElement({innerHTML: data.borough_office.replace(/ PL System/, '')}));
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
    //Event date, time, location, grade, audience
    const eventDetailsContainer = htmlElement({className: 'event-details-container'});
    const datesContainer = htmlElement({className: 'event-sub-details-container'});
    datesContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">calendar_today</i>'}));
    if (data.dates.indexOf(',') === -1) {
      datesContainer.appendChild(htmlElement({innerHTML: new Date(data.dates).toString().slice(0, 15)}));
    } else {
      datesContainer.appendChild(htmlElement({innerHTML: data.dates}));
    }
    eventDetailsContainer.appendChild(datesContainer);
    const locationContainer = htmlElement({className: 'event-sub-details-container'});
    locationContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">location_city</i>'}));
    locationContainer.appendChild(htmlElement({innerHTML: data.location}));
    eventDetailsContainer.appendChild(locationContainer);
    const timesContainer = htmlElement({className: 'event-sub-details-container'});
    timesContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">access_time</i>'}));
    timesContainer.appendChild(htmlElement({innerHTML: data.times}));
    eventDetailsContainer.appendChild(timesContainer);
    const gradeContainer = htmlElement({className: 'event-sub-details-container'});
    gradeContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">school</i>'}));
    gradeContainer.appendChild(htmlElement({innerHTML: data.grade_level}));
    eventDetailsContainer.appendChild(gradeContainer);
    const audienceContainer = htmlElement({className: 'event-sub-details-container'});
    audienceContainer.appendChild(htmlElement({className: 'event-detail-icon', innerHTML: '<i class="material-icons">people_outline</i>'}));
    audienceContainer.appendChild(htmlElement({innerHTML: data.display_audience}));
    eventDetailsContainer.appendChild(audienceContainer);
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