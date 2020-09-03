 var currentChart; // muuttuja johon tallentuu nykyinen kaavio
 let button = document.getElementById("renderBtn");
 let input = document.getElementById("country")

// When this fuction is called by event listener, code is excecuted 
function logCountryCode() {
    var countryCode = document.getElementById('country').value;
    // Print the value of the variable countryCode into the console.
    console.log(countryCode);
}

button.addEventListener('click', function (){
fetchData();
input.value=""; //tyhjentää input fieldin
})

// Yllä oleva korvaa tämän: document.getElementById('renderBtn').addEventListener('click', fetchData);
// event listener for user input, when user clicks button, this gives input to run function 'fecthData'

// UUSI OMINAISUUS - ENTER toimii tietojen syötössä
input.addEventListener("keypress", function(event) {
    if (event.which === 13){
        fetchData();
        input.value="";
    }
} )



async function fetchData() {
    var countryCode = document.getElementById('country').value;
    //vaihtuva muuttuja maakoodille
    const indicatorCode = 'SP.POP.TOTL'; // Population, total  
    // pysyvä elementti, indikaattori väestön yhteismäärästä tiedostossa
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    // pysyvä elementti mistä tieto haetaan
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    // tässä yhdistetään tietojen hakua varten pysyvä url, indikaattori sekä maakoodi
    console.log('Fetching data from URL: ' + url);
    var response = await fetch(url);


    if (response.status == 200) {
        // status 200 tarkoittaa, että järjestelmän pyyntö on onnistunut
        var fetchedData = await response.json();
        console.log(fetchedData);
        // kirjataan saatu tieto muistiin

        var data = getValues(fetchedData); // alempana määritelty, tässä tallennuttuna väestömäärä per vuosi
        var labels = getLabels(fetchedData); // tässä väestömäärään liittyvä vuosiluku
        var countryName = getCountryName(fetchedData); // tässä maa
        renderChart(data, labels, countryName); // tämä tekee kaavion

    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
    // hakee ja palauttaa väestömäärän datasta
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
    // hakee ja palauttaa vuosiluvun
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
    // hakee ja palauttaa maan nimen
}



function renderChart(data, labels, countryName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }
    // tyhjentää edellisen kaavion pohjalta jos sellainen on



    // Piirtää uuden kaavion
   currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                // tästä alkaa värit, voit muokata näitä tässä tai css puolella
                borderColor: 'rgba(0,0,0,.5)',
                backgroundColor: 'rgba(146, 157, 161, 0.2)',
            }]
        },
        options: { // muokkaa skaalauksen alkamaan 0
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}