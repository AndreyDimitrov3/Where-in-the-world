document.addEventListener('DOMContentLoaded', function () {
    // Declare Variables
    let input = document.getElementById('input');
    let popUp = document.getElementById('popUp');
    let popUpNoButton = document.querySelector('.popUpNoButton');
    let countryData = [];
    let visibleCountries = [];
    let regionFilteredCountries = []; // Declare the variable here

    // Close Popup
    document.getElementById('backButton').addEventListener('click', closePopUp);
    function closePopUp() {
        popUp.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        popUpNoButton.innerHTML = '';
    }

    // Fetch Data
    fetch('data.json')
    .then(response => response.ok ? response.json() : Promise.reject('There was an error'))
    .then((data) => {
        countryData = data; // Save the data to a variable to reuse it
        regionFilteredCountries = data; // Save regionFilteredCountries to all countries
        renderCountries(data);
        attachEventListeners();
    });

    // Search function
    input.addEventListener('input', inputSearch);
    function inputSearch() {
        let filter = input.value.toUpperCase();
        let countryPages = Array.from(document.getElementsByClassName('countryPage'));

        for (let i = 0; i < countryPages.length; i++) {
            let countryNameElement = countryPages[i].querySelector(".countryName");
            countryPages[i].cachedText = countryNameElement.textContent || countryNameElement.innerText;
            let countryNameUpperCase = countryPages[i].cachedText.toUpperCase();
            let matchesSearch = countryNameUpperCase.indexOf(filter) > -1;
            let matchesRegion = regionFilteredCountries.some(country => country.name.toUpperCase() === countryNameUpperCase);
            
            if (matchesSearch && matchesRegion) {
                countryPages[i].classList.remove('hidden');
            } else {
                countryPages[i].classList.add('hidden');
            }
        }
    }

    // Render Country Cards
    function renderCountries(data) {
        let htmlContent = '';
        for (let i = 0; i < data.length; i++) {
            let populationConverted = formatPopulation(data[i].population);

            htmlContent += `
                <div class="countryPage">
                    <img class="countryFlag" src="${data[i].flags.png}" alt="${data[i].name}'s flag">
                    <div class="dataInformation">
                        <h2 class="countryName">${data[i].name}</h2>
                        <p class="dataValueHolder">Population: <span class="dataValue">${populationConverted}</span></p>
                        <p class="dataValueHolder region ${data[i].region}">Region: <span class="dataValue">${data[i].region}</span></p>
                        <p class="dataValueHolder">Capital: <span class="dataValue">${data[i].capital ? data[i].capital : 'None'}</span></p>
                    </div>
                </div>
            `;
        }

        document.getElementById('fetchSection').innerHTML = htmlContent;
    }

    // Attach Event Listeners for Country Cards
    function attachEventListeners() {
        document.querySelectorAll('.countryPage').forEach(el => {
            el.addEventListener('click', function () {
                openCountryMenu(el);
            });
        });
    }

    // Open Country Popup
    function openCountryMenu(el) {
        popUp.classList.remove('hidden');
        document.body.classList.add('no-scroll');

        // Get the clicked country's name and corresponding data
        const countryName = el.querySelector(".countryName").innerText;
        const country = countryData.find(country => country.name === countryName);

        let populationConverted = formatPopulation(country.population);
        let popUpNoButtonHtml = `
            <img class="countryFlagPopUp" src="${country.flags.svg}" alt="${country.name}'s flag">
            <div class="popUpNoImg">
                <h1 class="popUpH1">${country.name}</h1>
                <div class="popUpInformationHolder">
                    <p class="popUpInformation popUpInformationPadding">Native name: <span class="popUpValue">${country.nativeName}</span></p>
                    <p class="popUpInformation popUpInformationPadding">Population: <span class="popUpValue">${populationConverted}</span></p>
                    <p class="popUpInformation popUpInformationPadding">Region: <span class="popUpValue">${country.region}</span></p>
                    <p class="popUpInformation popUpInformationPadding">Sub Region: <span class="popUpValue">${country.subregion}</span></p>
                    <p class="popUpInformation popUpInformationPadding">Capital: <span class="popUpValue">${country.capital ? country.capital : 'None'}</span></p>
                    <p class="popUpInformation">Top Level Domain: <span class="popUpValue">${country.topLevelDomain}</span></p>
                    <p class="popUpInformation">Currencies: <span class="popUpValue">${country.currencies ? country.currencies.map(c => c.name).join(", ") : ''}</span></p>
                    <p class="popUpInformation">Languages: <span class="popUpValue">${country.languages ? country.languages.map(l => l.name).join(", ") : ''}</span></p>
                </div>
        `;

        if (country.borders && country.borders.length > 0) {
            popUpNoButtonHtml += `
                <div class="borderCountries">
                    <p class="popUpInformation" id="borderCountriesP">Border Countries: </p>
                    <span class="borderButtonsContainer">
            `;

            country.borders.forEach(borderCode => {
                const borderCountry = countryData.find(c => c.alpha3Code === borderCode);
                if (borderCountry) {
                    popUpNoButtonHtml += `<button class="borderButton popUpButton" data-country="${borderCountry.name}">${borderCountry.name}</button>`;
                }
            });

            popUpNoButtonHtml += `</span></div>`;
        }

        popUpNoButtonHtml += `</div></div>`;
        popUpNoButton.innerHTML = popUpNoButtonHtml;

        // Add event listeners to border buttons
        document.querySelectorAll('.borderButton').forEach(button => {
            button.addEventListener('click', function () {
                const selectedCountryName = button.getAttribute('data-country');
                const selectedCountry = countryData.find(country => country.name === selectedCountryName);

                closePopUp();
                openCountryMenuByData(selectedCountry);
            });
        });
    }

    // Open Popup with Given Country Data
    function openCountryMenuByData(country) {
        openCountryMenu({ querySelector: () => ({ innerText: country.name }) });
    }

    // Format Population with Commas
    function formatPopulation(population) {
        let populationArray = String(population).split("");
        let count = 0;

        for (let i = populationArray.length - 1; i >= 0; i--) {
            if (count === 3) {
                populationArray[i] += ',';
                count = 1;
            } else {
                count += 1;
            }
        }

        return populationArray.join("");
    }

    document.getElementById('filter').addEventListener('change', function() {
        let selectedRegion = this.value;

        if (selectedRegion === 'All' || selectedRegion === 'default') {
            regionFilteredCountries = countryData;
        } else {
            regionFilteredCountries = countryData.filter(country => country.region === selectedRegion);
        }

        // Reapply the search filter after region change
        inputSearch();
    });
});
