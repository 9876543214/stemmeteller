//fjerner .ned på bunnen av skjermen
document.addEventListener("DOMContentLoaded", function() {
    var ned = document.getElementById("ned");

    window.addEventListener("scroll", function() {
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
            ned.style.display = "none";
        } else {
            ned.style.display = "flex";
        }
    });
});

//chart
var Chart
let voteCounts;

let mychart;



document.addEventListener('DOMContentLoaded', function updatechart() {
    updateResults();
    //farger til hvert parti
    const ctx = document.getElementById('mychart');
    const labelColors = [
        '#009de0', '#e81502', '#0c366c', '#b7cc2b', '#cc08c9', '#feb937', 
        '#52888e', '#12c4a7', '#138031', '#7b0a02', '#98647f', '#6694bf'
    ];
    mychart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Høyre', 'Arbeiderpartiet', 'Fremskrittspartiet', 'Senterpartiet', 'Sosialistisk Venstreparti', 'Kristelig Folkeparti', 'Industri- og Næringsparti', 'Venstre', 'Miljøpartiet De Grønne', 'Rødt', 'Pensjonistpartiet', 'Konservativ'],
            datasets: [{
                label: 'Antall stemmer',
                data: Object.values(voteCounts),
                backgroundColor: labelColors,
                borderWidth: 1
            }]
        },
        options: {
            Response: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'   
                        
                    }
                }
            }
        }
    });


    //skrev inn disse to funksjonene inne i charten fordi det var mye som ikke funket
    function updateResults() {
        voteCounts = {};
        ['h', 'ap', 'frp', 'sp', 'sv', 'krf', 'inp', 'v', 'mdg', 'r', 'pp', 'kon'].forEach(partyId => {
            voteCounts[partyId] = 0;
        });

        const voters = JSON.parse(localStorage.getItem('voters')) || {};
        Object.keys(voters).forEach(voter => {
            const vote = localStorage.getItem(voter);
            if (voteCounts.hasOwnProperty(vote)) {
                voteCounts[vote]++;
            }
        });

        displayResults(voteCounts);
    }

    function displayResults(voteCounts) {
        Object.entries(voteCounts).forEach(([partyId, count]) => {
            const bar = document.getElementById(partyId + '-bar');
            const scale = 2;
            bar.textContent = voteCounts[partyId];

            if (bar) {
                bar.style.width = `${0.8 + count * scale}vw`;
            }
        });
    }
});

//måtte lage funksjonen uttafor Domcontentloaded for å kunne deklarere den i andre funksjoner
function updatechart2() {
    updateResults();
    //farger til hvert parti
    const ctx = document.getElementById('mychart');
    const labelColors = [
        '#009de0', '#e81502', '#0c366c', '#b7cc2b', '#cc08c9', '#feb937', 
        '#52888e', '#12c4a7', '#138031', '#7b0a02', '#98647f', '#6694bf'
    ];
    mychart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Høyre', 'Arbeiderpartiet', 'Fremskrittspartiet', 'Senterpartiet', 'Sosialistisk Venstreparti', 'Kristelig Folkeparti', 'Industri- og Næringsparti', 'Venstre', 'Miljøpartiet De Grønne', 'Rødt', 'Pensjonistpartiet', 'Konservativ'],
            datasets: [{
                label: 'Antall stemmer',
                data: Object.values(voteCounts),
                backgroundColor: labelColors,
                borderWidth: 1
            }]
        },
        options: {
            Response: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                        
                    }
                }
            }
        }
    });


    //skrev inn disse to funksjonene inne i charten fordi det var mye som ikke funket
    function updateResults() {
        voteCounts = {};
        ['h', 'ap', 'frp', 'sp', 'sv', 'krf', 'inp', 'v', 'mdg', 'r', 'pp', 'kon'].forEach(partyId => {
            voteCounts[partyId] = 0;
        });

        const voters = JSON.parse(localStorage.getItem('voters')) || {};
        Object.keys(voters).forEach(voter => {
            const vote = localStorage.getItem(voter);
            if (voteCounts.hasOwnProperty(vote)) {
                voteCounts[vote]++;
            }
        });

        displayResults(voteCounts);
    }

    function displayResults(voteCounts) {
        Object.entries(voteCounts).forEach(([partyId, count]) => {
            const bar = document.getElementById(partyId + '-bar');
            const scale = 2;
            bar.textContent = voteCounts[partyId];

            if (bar) {
                bar.style.width = `${0.8 + count * scale}vw`;
            }
        });
    }
};



updateResults()
//funksjon for å sjekke navn før du får stemme
function vote(partyId) {
    let voterName = prompt("Vennligst skriv inn ditt navn:")
    if (!voterName) {
        alert('Du må skrive inn ditt navn for å stemme.');
        return;
    }
    voterName = voterName.trim();

    const voters = JSON.parse(localStorage.getItem('voters')) || {};
    if (voters[voterName]) {
        alert('Du har allerede stemt.');
        return;
    }

    voters[voterName] = true;
    localStorage.setItem('voters', JSON.stringify(voters));
    localStorage.setItem(voterName, partyId);

    updateResults();
    mychart.destroy()
    updatechart2()
}
//oppdaterer resultatet
function updateResults() {
    const voteCounts = {};
    const bars = document.querySelectorAll('.results .bar');

    ['h', 'ap', 'frp', 'sp', 'sv', 'krf', 'inp', 'v', 'mdg', 'r', 'pp', 'kon'].forEach(partyId => {
      voteCounts[partyId] = 0;
    });  

    const voters = JSON.parse(localStorage.getItem('voters')) || {};
    Object.keys(voters).forEach(voter => {
      const vote = localStorage.getItem(voter);
      if (voteCounts.hasOwnProperty(vote)) {
        voteCounts[vote]++;
      }
    });


    // Sorterer søylediagrammet i synkende rekkefølge
    const sortedBars = Array.from(bars).sort((a, b) => {
        const idA = a.id.replace('-bar', '');  // Henter ID og fjerner '-bar'
        const idB = b.id.replace('-bar', '');
        return voteCounts[idB] - voteCounts[idA];  // Sorterer etter antall stemmer
    });
  //kommenterte koden torterer søylediagrammet, ble ikke helt ferdig
//    // Oppdaterer det sorterte diagrammet i HTML-dokumentet
//    const container = document.querySelector('.results');
//    container.innerHTML = '';  // Tømmer .results
//
//    // Legger til det sorterte diagrammet i .results
//    sortedBars.forEach(bar => {
//        container.appendChild(bar);
//    });
//
//    attachVoteListeners();
//    displayResults(voteCounts);
//    }
//
//    function attachVoteListeners() {
//        const bars = document.querySelectorAll('.bar');
   }

    
  //endrer bredde på diagram basert på stemmer og putter antall stemmer i textcontent
function displayResults(voteCounts) {
    Object.entries(voteCounts).forEach(([partyId, count]) => {
        
        console.log()
        const partyId2 = String(partyId).toUpperCase()
        const bar = document.getElementById(partyId + '-bar');
        const scale = 2;
        bar.textContent = partyId2 + voteCounts[partyId];
        if (bar) {
            bar.style.width = `${.8 + count * scale}vw`;
        }
    });
}

  updateResults();


//tømmer localstorage og oppdaterer
function cleardata() {
    localStorage.clear()
    updateResults()
    mychart.destroy()
    updatechart2()
}