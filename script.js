//https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1
// async function getContinent(continent) {
// 	const resposne = await fetch(
// 		`https://cors-anywhere.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${continent}`
// 	);
// 	return resposne.json();
// }

async function getCovid() {
	const resposne = await fetch(`http://corona-api.com/countries`);
	return resposne.json();
}

async function getCountry() {
	const resposne = await fetch(`https://restcountries.herokuapp.com/api/v1/`);
	return resposne.json();
}

let dataCovid = [];
document.addEventListener("DOMContentLoaded", getData);
async function getData() {
	const countries = await getCountry(); // array of countries
	dataCovid = (await getCovid()).data; //array of covid data
	for (let i = 0; i < dataCovid.length; i++) {
		for (let j = 0; j < countries.length; j++) {
			if (dataCovid[i].code == countries[j].cca2)
				dataCovid[i].region = countries[j].region;
		}
	}
	dataCovid.sort((a, b) => (a.region >= b.region ? 1 : -1)); //sort by continent
	//place 4 to 62 is africa , 63 to  119 is america , 120 to 169 is asisa , 170 to 221 is europ 222 to 248 is oceania
}

const btnAsia = document.querySelector("#asia");
btnAsia.addEventListener("click", CreateGraph);

async function CreateGraph() {
	let ctx = document.getElementById("myChart").getContext("2d");
	const asiaGraph = {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{
					label: "Asia",
					backgroundColor: "rgb(255, 99, 132)",
					borderColor: "rgb(255, 99, 132)",
					data: [],
				},
			],
		},
	};

	for (let i = 4; i < 62; i++) {
		asiaGraph.data.labels.push(dataCovid[i].name);
		asiaGraph.data.datasets[0].data.push(dataCovid[i].latest_data.deaths);
	}
	let chart = new Chart(ctx, asiaGraph);
}
