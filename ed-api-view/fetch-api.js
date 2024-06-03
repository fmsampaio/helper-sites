const reloadBtn = document.getElementById('reload_btn')
const mainContainer = document.getElementById('main_container')

//const BASE_API_URL = 'http://127.0.0.1:8000'
const BASE_API_URL = 'https://ed-json-post-23762f735f6e.herokuapp.com'

reloadBtn.addEventListener('click', (event) => {
    mainContainer.innerHTML = ''
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
})

function renderStudentDataCards(data) {
    var content = ''

    for (let i = 0; i < data.length; i++) {
        const studentData = JSON.parse(data[i].json_data)
        console.log(studentData)
        
        const cardDiv = document.createElement('div')
        cardDiv.classList.add('card')
        cardDiv.setAttribute('style', 'width:18rem;')

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
        console.log(disciplinasJson)

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