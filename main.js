// skapar en ny element
function createNewElement(node, attributes) {
    const newElement = document.createElement(node);
    for(let key in attributes){
        newElement.setAttribute(key, attributes[key]);
    }
    return newElement;
}

// skriver ut en lista med städer jag har besökt och räknar antal träffade människor
function showVisited() {
    if(localStorage.length > 0) {
        
        const visited = document.getElementById('visited')
        const saved = JSON.parse(localStorage.visited)
        let count = 0
        const ul = createNewElement('ul', {})
        const para = createNewElement('p', {})
        const btn = createNewElement('button', {class: 'btn btn-warning btn-sm w-25 mt-2'})

        // Kort besökta städer - #cardVisited
        visited.appendChild(para)
        visited.appendChild(ul)
        visited.appendChild(btn)
        btn.innerHTML = 'Rensa'
        
        // Loop för besökta städer och beräkning av antal människor
        saved.forEach(element => {
            const li = createNewElement('li', {class: 'list-unstyled ml-2'})
            
            count += parseFloat(element.population)
            ul.appendChild(li)
            li.innerHTML += element.name 
        });

        // Utskrift av antal träffade människor
        para.innerHTML = `Råkade träffa ca ${(count / 1000000).toFixed(2).replace('.', ',')} miljoner människor. Dessa städer har jag besökt:`
        
        // Tömmer lista samt localStorage
        btn.onclick = function() {
            localStorage.clear()
            location.reload()
        }
    }   
}

showVisited()

// döljer 'besökt' knapp för besökta städer
function hideButton(button, card) {
    if(localStorage.length > 0) {
        const saved = JSON.parse(localStorage.visited)

        function isVisited (saved) { 
            return saved.name === card.innerHTML;
        }
          
        saved.find(isVisited) ? button.hidden = true : button.hidden = false
    }
}

// fetch länder
fetch('land.json')
.then(response => response.json())
.catch(err => console.log(err))
.then(countries => {

    // loop land.json 
    countries.map(country => {

        const navButtons = document.getElementById('dropdown')
        const div = createNewElement('div', {id: `${country.countryname}`, class: 'btn-group dropright'})
        const dropdownButton = createNewElement('div', {type: "button", class: "btn btn-secondary btn-lg dropdown-toggle mb-2", 'data-toggle': "dropdown", 'aria-haspopup':"true", 'aria-expanded':"false"})
        const dropdownMenu = createNewElement('div', {id: `${country.countryname}-dropdown`, class: "dropdown-menu"})

        // Navbar länder - #dropdown
        navButtons.appendChild(div)
        div.appendChild(dropdownButton)
        dropdownButton.innerHTML += `${country.countryname}`
        div.appendChild(dropdownMenu)
        
        // få städer i respektive land
        getCity(country)
    })
})

function getCity(country) {

    // fetch städer
    fetch('stad.json')
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(cities => {

        // sortera städerna
        cities.sort( (a, b) => b.population - a.population )

        // loop stad.json
        cities.map(city => {
            
            // söker städer i länder
            if(country.id == city.countryid) {
                const focusCountry = document.getElementById(`${country.countryname}-dropdown`)
                const a = createNewElement('a', {id: `${city.stadname}`, class:"dropdown-item"})
                
                focusCountry.appendChild(a)
                a.innerHTML += `${city.stadname}`
                
                const cardTitle = document.getElementsByClassName('card-title')[0]
                const cardID = document.getElementsByClassName('card-subtitle')[0]
                const cardText = document.getElementsByClassName('card-text')[0]
                const cardBtn = document.getElementById('card-button')
                cardBtn.hidden = true
                
                // städer knapp
                a.onclick = function() {
                    cardID.innerHTML = `ID: ${city.id}`
                    cardTitle.innerHTML = `${city.stadname}`
                    cardText.innerHTML = `${city.population.toLocaleString().replace(/,/g,' ')} invånare`
                    cardBtn.hidden = false

                    hideButton(cardBtn, cardTitle)

                    // besökt knapp
                    cardBtn.onclick = function() {
                        
                        const myObj = {id: `${city.id}`, name: `${city.stadname}`, population: `${city.population}`}

                        // sparar array in localStorage
                        if(!localStorage.getItem('visited')) { 
                            let visited = []
                            visited.push(myObj)
                            localStorage.setItem('visited', JSON.stringify(visited))
                        } else {
                            let visited = JSON.parse(localStorage.getItem('visited'))
                            visited.push(myObj)
                            localStorage.setItem('visited', JSON.stringify(visited))
                        }

                    location.reload()
                    }
    
                }

            }
            
        })

    })
}