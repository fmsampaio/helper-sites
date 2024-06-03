const reloadBtn = document.getElementById('reload_btn')
const mainContainer = document.getElementById('main_container')
const loadingDiv = document.getElementById('loading_div')

//const BASE_API_URL = 'http://127.0.0.1:8000'
const BASE_API_URL = 'https://ed-json-post-23762f735f6e.herokuapp.com'

fetchStudentData()

reloadBtn.addEventListener('click', (event) => {
    fetchStudentData()
})

function fetchStudentData() {
    mainContainer.innerHTML = ''
    showLoading()
    fetch(`${BASE_API_URL}/data/`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then( (resp) => resp.json() )
    .then( (data) => {
        renderStudentDataCards(data)
    })
}

function renderStudentDataCards(data) {
    hideLoading()
    var dataJson = []

    data.sort((elemA, elemB) => {
        const dateA = new Date(elemA.timestamp).getTime()
        const dateB = new Date(elemB.timestamp).getTime()
        return dateB - dateA 
    })

    data.forEach(element => {
        dataJson.push(JSON.parse(element.json_data))
    });    

    for (let i = 0; i < dataJson.length; i++) {
        const studentData = dataJson[i]
                
        const cardDiv = document.createElement('div')
        cardDiv.classList.add('card')
        cardDiv.setAttribute('style', 'width:20rem;margin:5px')

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        
        const cardTitle = document.createElement('h5')
        cardTitle.innerHTML = studentData.nome

        const cardContent = document.createElement('p')

        var content = ''
        content += `<strong>Data nasc.: </strong> ${studentData.nasc}<br>`
        content += `<strong>Email.: </strong> ${studentData.email}<br>`
        content += `<strong>Mora em Farroupilha: </strong> ${studentData.reside_farroupilha ? "Sim" : "Não"}<br>`
        content += `<strong>Altura: </strong> ${studentData.altura}<br>`
        
        const courseData = studentData.curso
        content += `<strong>Curso: </strong> ${courseData.nome}<br>`
        content += `<strong>Instituição: </strong> ${courseData.inst}<br>`
        content += `<strong>Ano ingresso: </strong> ${courseData.ano_ingresso}<br>`
        
        const disciplinasJson = JSON.parse(courseData.disciplinas.replaceAll("'", '"'))

        content += `<strong>Disciplinas: </strong>${disciplinasJson.length} <br>`
        disciplinasJson.forEach( (disc) => {
            content += `${disc}<br>`
        })

        cardContent.innerHTML = content

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardContent)

        cardDiv.appendChild(cardBody)

        mainContainer.appendChild(cardDiv)
        
    }
    
}

function showLoading() {
    loadingDiv.classList.add('spinner-border')
    loadingDiv.setAttribute('role', 'status')
}

function hideLoading() {
    loadingDiv.classList.remove('spinner-border')
    loadingDiv.setAttribute('role', '')
}