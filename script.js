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
// let asia = [];
// let europe = [];
// let africa = [];
// let america = [];
// let oceania = [];
let world = [];

document.addEventListener("DOMContentLoaded", getData);
async function getData() {
	const countries = await getCountry(); // array of countries
	world = (await getCovid()).data; //array of covid data
	for (let i = 0; i < world.length; i++) {
		for (let j = 0; j < countries.length; j++) {
			if (world[i].code == countries[j].cca2)
				world[i].region = countries[j].region;
		}
	}
	// world.sort((a, b) => (a.region >= b.region ? 1 : -1)); //sort by continent
	// //place 4 to 63 is africa , 63 to  119 is america , 120 to 169 is asisa , 170 to 221 is europ 222 to 248 is oceania
	// africa = world.slice(4, 62);
	// america = world.slice(63, 120);
	// asia = world.slice(121, 170);
	// europe = world.slice(171, 222);
	// oceania = world.slice(223);
	// console.log(africa);
}

const btn = document.querySelector(".button");
btn.addEventListener("click", CreateGraph);
async function CreateGraph(e) {
	const button = e.target;
	document
		.querySelectorAll(".continent")
		.forEach((btn) => btn.setAttribute("data-use", "false")); //we remove the use from all btns
	button.setAttribute("data-use", "true"); // we set the dseire btn attribute in use
	let ctx = document.querySelector("#myChart").getContext("2d");
	let graph = updateGraph(button.id);
	let chart = new Chart(ctx, graph);
}

function updateGraph(graphLabel) {
	let labels = [];
	let data = [];
	world.forEach((country) => {
		if (country.region.toLowerCase() == graphLabel) {
			labels.push(country.name);
			data.push(country.latest_data.deaths);
		}
	});
	const graph = {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{
					label: "",
					backgroundColor: "rgb(255, 99, 132)",
					borderColor: "rgb(255, 99, 132)",
					data: [],
				},
			],
		},
	};
	graph.data.datasets[0].label = `${graphLabel.charAt(0).toUpperCase()}`;
	graph.data.labels.push(...labels);
	graph.data.datasets[0].data.push(...data);
	return graph;
}

function removeData(chart) {
	chart.data.labels.pop();
	chart.data.datasets.forEach((dataset) => {
		dataset.data.pop();
	});
	chart.update();
}
