const getMultiSelectValues = input => {
    const options = [...input.getElementsByTagName('OPTION')];
    return options.reduce((values, option) => {
        if (option.selected) values.push(option.value);
        return values;
    }, []);
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
    console.log(eventData);
}