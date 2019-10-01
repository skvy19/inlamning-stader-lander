// skapar en ny element
function createNewElement(node, attributes) {
    const newElement = document.createElement(node);
    for(let key in attributes){
        newElement.setAttribute(key, attributes[key]);
    }
    return newElement;
}

// döljer 'besökt' knapp för besökta städer
function hideButtonClear(button, id) {
    if(localStorage.length > 0) {
        const saved = JSON.parse(localStorage.visited)

        // söker efter id match
        function isVisited (saved) { 
            return saved === id.innerHTML.slice(4);
        }
        
        // söker efter första träff enligt function ovan samt visar om hittar
        saved.find(isVisited) ? button.hidden = true : button.hidden = false
    }
}

Promise.all([
    fetch("land.json").then(data => data.json()),
    fetch("stad.json").then(data => data.json())
    ]).then(allResponses => {

        const countries = allResponses[0]
        const cities = allResponses[1]

        // loop land.json 
        countries.map(country => {

            const navButtons = document.getElementById('dropdown')
            const div = createNewElement('div', {class: 'btn-group dropright'})
            const dropdownButton = createNewElement('button', {type: "button", class: "btn btn-secondary btn-lg dropdown-toggle mb-2", 'data-toggle': "dropdown", 'aria-haspopup':"true", 'aria-expanded':"false"})
            const dropdownMenu = createNewElement('div', {id: `${country.countryname}-dropdown`, class: "dropdown-menu"})
    
            // Navbar länder - #dropdown
            navButtons.appendChild(div)
            div.appendChild(dropdownButton)
            dropdownButton.innerHTML += `${country.countryname}`
            div.appendChild(dropdownMenu)
        
            // sortera städerna
            cities.sort( (a, b) => b.population - a.population )

            // loop stad.json
            cities.map(city => {

            // söker städer i respektivt land
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

                        hideButtonClear(cardBtn, cardID)

                        // besökt knapp
                        cardBtn.onclick = function() {
                            
                        // sparar array in localStorage
                            if(!localStorage.getItem('visited')) { 
                                let visited = []
                                visited.push(`${city.id}`)
                                localStorage.setItem('visited', JSON.stringify(visited))
                            } else {
                                let visited = JSON.parse(localStorage.getItem('visited'))
                                visited.push(`${city.id}`)
                                localStorage.setItem('visited', JSON.stringify(visited))
                            }
                            location.reload()
                        }
                    }
                }

            })
        })
    
        // skriver ut en lista med städer jag har besökt och räknar antal träffade människor
        if(localStorage.length > 0) {

            const visited = document.getElementById('visited')
            const saved = JSON.parse(localStorage.visited)
            let count = 0
            const ul = createNewElement('ul', {})
            const para = createNewElement('p', {})
            const clearBtn = createNewElement('button', {class: 'btn btn-warning btn-sm w-25 mt-2'})
    
            // Kort besökta städer
            visited.appendChild(para)
            visited.appendChild(ul)
            visited.appendChild(clearBtn)
            clearBtn.innerHTML = 'Rensa'
    
            // Loop städer
            cities.map(city => {
                    
                // Loop localStorage
                saved.map(element => {
                    const li = createNewElement('li', {class: 'list-unstyled ml-2'})
    
                    // Söker efter id match
                    if(element == city.id) {
                        count += city.population
                        ul.appendChild(li)
                        li.innerHTML += city.stadname
    
                        // Bara för kontroll om allt loop, if och count funkar
                        console.log(city.stadname, city.population, 'count:', count)
                    }
                })
    
                // Utskrift av antal träffade människor
                para.innerHTML = `Råkade träffa ca ${(count / Math.pow(10,6)).toFixed(2).replace('.', ',')} miljoner människor. Dessa städer har jag besökt:`
            })
    
            // Tömmer lista samt localStorage
            clearBtn.onclick = function() {
                localStorage.clear()
                location.reload()
            }

        }

    })