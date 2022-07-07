var returnMemberData = null;
var returnContactData = null;
var returnLatestElectionResult = null;
var returnVotingRecords = null;
var initialSearch = false;

function mainSearch() {
	getMp();
}

async function fetchConstituencyData(x) {
	const response = await fetch(x);
	const data = await response.json();
	return data.items[0].value;
}

function getConstituencyUrl(url) {
	var input = document.getElementById('mainSearch').value;
	var constituencyApi = "https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=";
	var url = constituencyApi.concat(input);
	return url;
}

async function getMp() {
	returnMemberData = await fetchConstituencyData(getConstituencyUrl());
	returnContactData = await fetchContactInfo();
	returnLatestElectionResult = await fetchLatestElectionResult();
	returnVotingRecords = await fetchVotingRecords();

	var d = new Date(returnMemberData.currentRepresentation.member.value.latestHouseMembership.membershipStartDate);

	document.getElementById("membersContainer").style.borderTop = "5px solid grey";
	document.getElementById("membersContainer").style.borderBottom = "5px solid grey";
	document.getElementById("membersContact").style.display = "flex";
	document.getElementById("latestElectionContainer").style.display = "inline-block";
	document.getElementById("votingRecordsContainer").style.display = "inline-block";
	document.getElementById("votingHeader").style.display = "block";
	document.getElementById("votingRecordsHeader").style.display = "flex";

	document.getElementById("membersWrap").innerHTML = `
		<h1 class="membersName">${returnMemberData.currentRepresentation.member.value.nameFullTitle}</h1>
		<img class="portrait" src="${returnMemberData.currentRepresentation.member.value.thumbnailUrl}">
		<div class="membersInfoCard">
			<h2 class="constituencyInfo">Member for ${returnMemberData.name}</h2>
			<div class="membersContent">
				<h3 class ="membersParty">Party:	${returnMemberData.currentRepresentation.member.value.latestParty.name}</h3>
				<h3 class ="membersSince">Date first elected:	${d.toDateString()}</h3>
			</div>
		</div>
		`;

	document.getElementById("membersContactHeaderWrap").innerHTML = `
		<h1 class="contactHeader">Contact Information</h1>
	`;

	if (!document.getElementById("westminsterPhoneA") || !document.getElementById("westminsterEmailA")) {
		var telWestminster = document.createElement('a');
		telWestminster.id = 'westminsterPhoneA'
		telWestminster.textContent = returnContactData[0].phone;
		telWestminster.href = 'tel:' + returnContactData[0].phone;

		var emailWestminster = document.createElement('a');
		emailWestminster.id = 'westminsterEmailA'
		emailWestminster.textContent = returnContactData[0].email;
		emailWestminster.href = 'mailto:' + returnContactData[0].email;

		document.getElementById('westminsterPhone').appendChild(telWestminster);
		document.getElementById('westminsterEmail').appendChild(emailWestminster);

	}
	else {

		document.getElementById("westminsterPhoneA").innerHTML = `<a id="westminsterPhoneA" href="tel:${returnContactData[0].phone}">${returnContactData[0].phone}</a>`
		document.getElementById("westminsterEmailA").innerHTML = `<a id="westminsterPhoneA" href="tel:${returnContactData[0].email}">${returnContactData[0].email}</a>`
	}

	if (returnContactData[1].type == "Constituency") {

		document.getElementById("cContent").style.display = "flex"

		if (!document.getElementById("constituencyPhoneA") || !document.getElementById("constituencyEmailA")) {

			var address = cleanAddress();
			document.getElementById("constituencyAddress").innerHTML = '';
			for (var key in address) {
				var div = document.createElement('div');
				div.textContent = address[key];
				document.getElementById("constituencyAddress").appendChild(div);
			}

			if (returnContactData[1].email == null) {
				var telConstituency = document.createElement('a');
				telConstituency.id = 'constituencyPhoneA'
				telConstituency.textContent = returnContactData[1].phone;
				telConstituency.href = 'tel:' + returnContactData[1].phone;

				document.getElementById('constituencyPhone').appendChild(telConstituency);


			}
			else {
				var telConstituency = document.createElement('a');
				telConstituency.id = 'constituencyPhoneA'
				telConstituency.textContent = returnContactData[1].phone;
				telConstituency.href = 'tel:' + returnContactData[1].phone;

				var emailConstituency = document.createElement('a');
				emailConstituency.id = 'constituencyEmailA'
				emailConstituency.textContent = returnContactData[1].email;
				emailConstituency.href = 'mailto:' + returnContactData[1].email;

				document.getElementById('constituencyPhone').appendChild(telConstituency);
				document.getElementById('constituencyEmail').appendChild(emailConstituency);
			}
		}
		else {

			document.getElementById("constituencyPhoneA").innerHTML = `<a id="constituencyPhoneA" href="tel:${returnContactData[1].phone}">${returnContactData[1].phone}</a>`
			document.getElementById("constituencyEmailA").innerHTML = `<a id="constituencyEmailA" href="mailto:${returnContactData[1].email}">${returnContactData[1].email}</a>`
			var address = cleanAddress();
			document.getElementById("constituencyAddress").innerHTML = '';
			for (var key in address) {
				var div = document.createElement('div');
				div.textContent = address[key];
				document.getElementById("constituencyAddress").appendChild(div);
			}

		}
	} else {
		document.getElementById("cContent").style.display = "none";
	}

	var divisonCard = document.getElementById("divisionCards");

	document.getElementById("divisionCards").innerHTML = '';

	for (var entry in returnVotingRecords) {
		newCard = document.createElement('div');
		newCard.className = 'cardContent';

		cardHeading = document.createElement('h3');
		cardHeading.className = 'cardHeading';
		cardHeading.textContent = returnVotingRecords[entry].PublishedDivision.Title;

		cardAyesWrap = document.createElement('div');
		cardNoesWrap = document.createElement('div');
		cardAyesWrap.className = 'cardAyesWrap';
		cardNoesWrap.className = 'cardNoesWrap';

		cardAyes = document.createElement('div');
		cardNoes = document.createElement('div');
		cardAyes.className = 'cardAyes';
		cardNoes.className = 'cardNoes';

		cardAyes.textContent = 'Ayes '
		cardNoes.textContent = 'Noes '

		cardAyesValue = document.createElement('div');
		cardNoesValue = document.createElement('div');
		cardAyesValue.className = 'cardAyesValue';
		cardNoesValue.className = 'cardNoesValue';

		cardAyesValue.textContent = returnVotingRecords[entry].PublishedDivision.AyeCount;
		cardNoesValue.textContent = returnVotingRecords[entry].PublishedDivision.NoCount;

		cardVoteHistory = document.createElement('div');
		cardVoteHistory.className = 'cardVoteHistory';

		if (returnVotingRecords[entry].MemberVotedAye) {
			cardVoteHistory.textContent = "Aye"
			cardVoteHistory.style.color = '#26984d'
		}
		else {
			cardVoteHistory.textContent = "No"
			cardVoteHistory.style.color = '#cc4645'
		}


		cardDivisionInfo = document.createElement('div');
		cardDivisionInfo.className = 'cardDivisionInfo';
		var publishDate = new Date(returnVotingRecords[entry].PublishedDivision.Date);
		cardDivisionInfo.textContent = "Division " + returnVotingRecords[entry].PublishedDivision.DivisionId + ": held on " + publishDate.toDateString();

		divisonCard.appendChild(newCard);
		newCard.appendChild(cardHeading);
		newCard.appendChild(cardAyesWrap);
		newCard.appendChild(cardNoesWrap);
		cardAyesWrap.appendChild(cardAyes);
		cardAyes.appendChild(cardAyesValue);
		cardNoesWrap.appendChild(cardNoes);
		cardNoes.appendChild(cardNoesValue);
		newCard.appendChild(cardVoteHistory);
		newCard.appendChild(cardDivisionInfo);
	}



	console.log(returnMemberData);
	console.log(returnLatestElectionResult);
	console.log(returnContactData);
	console.log(returnVotingRecords);
	createChart();
	initialSearch = true;
}

async function fetchContactInfo() {
	const response = await fetch(`https://members-api.parliament.uk/api/Members/${returnMemberData.currentRepresentation.member.value.id}/Contact`);
	const data = await response.json();
	return data.value;
}

async function fetchLatestElectionResult() {
	const response = await fetch(`https://members-api.parliament.uk/api/Members/${returnMemberData.currentRepresentation.member.value.id}/LatestElectionResult`);
	const data = await response.json();
	return data.value;
}

async function fetchVotingRecords() {
	const response = await fetch(`https://commonsvotes-api.parliament.uk/data/divisions.json/membervoting?queryParameters.memberId=${returnMemberData.currentRepresentation.member.value.id}`);
	const data = await response.json();
	return data;

}

function cleanAddress() {
	const address = { key1: returnContactData[1].line1, key2: returnContactData[1].line2, key3: returnContactData[1].line3, key4: returnContactData[1].line4, key5: returnContactData[1].line5 };

	for (var propName in address) {
		if (address[propName] === null || address[propName] === undefined) {
			delete address[propName];
		}
	}

	return address;
}

function getPartyColor(x) {

	switch (x) {
		case "Lab":
			color = "#e91d0e";
			break;
		case "Con":
			color = "#0575c9";
			break;
		case "LD":
			color = "#efac18";
			break;
		case "SNP":
			color = "#f8ed2e";
			break;
		case "Green":
			color = "#5fb25f";
			break;
		case "BXT":
			color = "#02b6d7";
			break;
		case "DUP":
			color = "#b51c4b";
			break;
		case "Alliance":
			color = "#d6b429";
			break;
		case "UUP":
			color = "#3b75a8";
			break;
		case "SF":
			color = "#159b78";
			break;
		case "SDLP":
			color = "#224922";
			break;
		case "PC":
			color = "#13e594";
			break;
		case "Ind":
			color = "grey";
			break;
	}

	return color;
}

function getPercentageVote(x) {
	x = (x * 100).toFixed(2) + '%'
	return x;
}


function createChart() {
	// Load google charts
	google.charts.load('current', { 'packages': ['corechart'] });
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {

		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Party');
		data.addColumn('number', 'Votes');
		data.addColumn({ role: 'style' });
		data.addColumn({ role: 'annotation' })

		for (var i in returnLatestElectionResult.candidates) {
			data.addRow([
				returnLatestElectionResult.candidates[i].party.abbreviation,
				returnLatestElectionResult.candidates[i].votes,
				getPartyColor(returnLatestElectionResult.candidates[i].party.abbreviation),
				getPercentageVote(returnLatestElectionResult.candidates[i].voteShare)
			])
		}

		data.sort([{ column: 1, desc: true }, { column: 0 }]);

		var options = {
			title: returnLatestElectionResult.constituencyName + ' ' + returnLatestElectionResult.electionTitle,
			backgroundColor: 'transparent',
			legend: { position: 'none' }
		};

		var chart = new google.visualization.BarChart(document.getElementById('googleChart'));
		chart.draw(data, options);

	}
}