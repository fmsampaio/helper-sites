const logEntriesTable = document.getElementById('log_entries_table')
const refreshBtn = document.getElementById('refresh_btn')
const loadingDiv = document.getElementById('loading_div')
const projctsSelect = document.getElementById('project_select')

const BASE_API_URL = 'https://exp-logger-api-5bed46122227.herokuapp.com'

fetchProjectsData()
//fetchLogEntriesData()

refreshBtn.addEventListener('click', (event) => {
    clearLogTable()
    fetchLogEntriesData()
})

function fetchProjectsData() {
    showLoading()
    fetch(`${BASE_API_URL}/projects/`, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then( (resp) => resp.json() )
    .then( (data) => {
        console.log(data)
        createProjectsSelect(data)        
    })
}

function createProjectsSelect(projects){
    hideLoading()    
    projects.forEach( (project) => {
        var option = document.createElement('option')
        option.setAttribute('value', project.id)
        var text = document.createTextNode(project.title)
        option.appendChild(text)
        projctsSelect.appendChild(option)
    })
}

function fetchLogEntriesData() {
    showLoading()
    fetch(`${BASE_API_URL}/log_entries/`, {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then( (resp) => resp.json() )
    .then( (data) => {
        createLogTable(data)
        
    })
    
}

function parseTimestamp(timestamp){
    const date = new Date(timestamp)
    const returnable = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return returnable
}

function clearLogTable() {
    logEntriesTable.innerHTML = ''
}

function createLogTable(data) {
    hideLoading()
    logEntriesTable.innerHTML = `
    <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Project</th>
                        <th>Experiment</th>
                        <th>Logged Message</th>
                    </tr>
                </thead>
    `

    data.forEach( logEntry => {
        createLogEntryRow(logEntry)
    });
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

function showLoading() {
    loadingDiv.classList.add('spinner-border')
    loadingDiv.setAttribute('role', 'status')
}

function hideLoading() {
    loadingDiv.classList.remove('spinner-border')
    loadingDiv.setAttribute('role', '')
}