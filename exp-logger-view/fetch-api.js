const logEntriesTable = document.getElementById('log_entries_table')
const BASE_API_URL = 'https://exp-logger-api-5bed46122227.herokuapp.com'

fetchData()

function fetchData() {
    fetch(`${BASE_API_URL}/log_entries/`, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then( (resp) => resp.json() )
    .then( (data) => {
        data.forEach( logEntry => {
            createLogEntryRow(logEntry)
        });
    })
    
}

function parseTimestamp(timestamp){
    const date = new Date(timestamp)
    const returnable = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return returnable
}

function createLogEntryRow(logEntry) {
    const newRow = logEntriesTable.insertRow(-1)

    const tdTimestamp = document.createElement('td')
    tdTimestamp.innerHTML = parseTimestamp(logEntry.time_created)
    newRow.appendChild(tdTimestamp)

    const tdProject = document.createElement('td')
    tdProject.innerHTML = logEntry.project.title
    newRow.appendChild(tdProject)

    const tdExperiment = document.createElement('td')
    tdExperiment.innerHTML = logEntry.experiment_name
    newRow.appendChild(tdExperiment)

    const tdLogMessage = document.createElement('td')
    tdLogMessage.innerHTML = logEntry.log_message
    newRow.appendChild(tdLogMessage)    
}


