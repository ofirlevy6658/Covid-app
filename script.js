// `https://api.codetabs.com/v1/proxy?quest=http://corona-api.com/countries`
// `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`

async function getCovid() {
	const resposne = await fetch(
		`https://api.codetabs.com/v1/proxy?quest=http://corona-api.com/countries`
	);
	return resposne.json();
}

async function getCountry() {
	const resposne = await fetch(
		`https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1`
	);
	return resposne.json();
}

let world = [];
const worldData = [];
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
	//taking the neccery data and push it into worldData -array of objects
	world.forEach((country) => {
		worldData.push({
			name: country.name.toLowerCase(),
			region: country.region,
			deaths: country.latest_data.deaths,
			confirmed: country.latest_data.confirmed,
			recovered: country.latest_data.recovered,
			critical: country.latest_data.critical,
		});
	});
}
const infoBtns = document.querySelectorAll(".info");
infoBtns.forEach((b) => b.addEventListener("click", infoBottonState));
const continentBtns = document.querySelectorAll(".continent");
continentBtns.forEach((b) =>
	b.addEventListener("click", continentBottonsState)
);
//

async function displayGraph() {
	document.querySelector(".infoBtn").style.visibility = "visible";
	document.querySelector(".myChart").remove();
	const chartElement = document.createElement("canvas");
	chartElement.classList.add("myChart");
	document.querySelector(".canvas-div").appendChild(chartElement);
	let ctx = document.querySelector(".myChart").getContext("2d");
	ctx.height = 100;
	let graph = createGraph();
	let chart = new Chart(ctx, graph);
}

function continentBottonsState(e) {
	continentBtns.forEach((btn) => btn.setAttribute("data-use", "false")); //we remove the use from all btns
	e.target.setAttribute("data-use", "true"); // we set the dseire btn attribute in use
	displayGraph();
}
function infoBottonState(e) {
	infoBtns.forEach((btn) => btn.setAttribute("data-use", "false"));
	e.target.setAttribute("data-use", "true");
	displayGraph();
}

function updateGraph(graphLabel, dataType) {
	const labels = [];
	const data = [];
	worldData.forEach((country) => {
		if (country.region.toLowerCase() == graphLabel) {
			labels.push(country.name);
			data.push(country[dataType]);
		}
	});
	return [labels, data];
}

function createGraph() {
	const state = document.querySelectorAll('[data-use="true"]');
	const dataType = state[0].id;
	const graphLabel = state[1].id;
	const graphColor = graphColors(dataType);

	const graphData = updateGraph(graphLabel, dataType);
	const graph = {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{
					label: "",
					backgroundColor: graphColor[0],
					borderColor: graphColor[1],
					data: [],
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	};

	graph.data.datasets[0].label = `${
		graphLabel.charAt(0).toUpperCase() + graphLabel.slice(1)
	} ${dataType}`;
	graph.data.labels.push(...graphData[0]);
	graph.data.datasets[0].data.push(...graphData[1]);
	return graph;
}

function graphColors(dataType) {
	switch (dataType) {
		case "confirmed":
			return ["#ffa64c", "#ff8000"];
		case "deaths":
			return ["#ff9999", "#ff0000"];
		case "recovered":
			return ["#EBF7E3", "#9BD770"];
		case "critical":
			return ["#ffeb3b", "black"];
	}
}
