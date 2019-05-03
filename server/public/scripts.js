//Reset all input fields to default on the quote page
function reset(){
	document.getElementById('age').value = '';
	document.getElementById('citizenship').value = '';
	document.getElementById('state').value = '';
	document.getElementById('startDate').value = null;
	document.getElementById('endDate').value = null;
	document.getElementById('maximum').selectedIndex = 0;
}
function resultsPage()
{
	var mockData = {
	  "quotes" : [
		{
		  "id": 1,
		  "price": 100,
		  "name": "Atlas-america",
		  "description": "Best comprehensive plan for visitors",
		  "type": "Comprehensive",
		  "section": "Travel Medical",
		  "bestSellers": true
		},
		{
		  "id": 2,
		  "price": 150,
		  "name": "Atlas-international",
		  "description": "Best comprehensive plan for international travel",
		  "type": "Comprehensive",
		  "section": "International Travel Medical",
		  "bestSellers": true
		},
		{
		  "id": 3,
		  "price": 75,
		  "name": "IMG Patriot America",
		  "description": "Comprehensive plan for visitors",
		  "type": "Comprehensive",
		  "section": "Travel Medical",
		  "bestSellers": true
		},
		{
		  "id": 4,
		  "price": 250,
		  "name": "IMG Patriot International",
		  "description": "Comprehensive plan for international travel",
		  "type": "Comprehensive",
		  "section": "International Travel Medical",
		  "bestSellers": false
		},
		{
		  "id": 5,
		  "price": 15,
		  "name": "Visitor Care",
		  "description": "Fixed plan for domestic travel",
		  "type": "Fixed",
		  "section": "Travel Medical",
		  "bestSellers": true
		},
		{
		"id": 6,
		"price": 50,
		"name": "Visitor Secure",
		"description": "Fixed plan for domestic travel",
		"type": "Fixed",
		"section": "Travel Medical",
		"bestSellers": false
		},
		{
		  "id": 7,
		  "price": 87,
		  "name": "Student travel",
		  "description": "Best student travel plan",
		  "type": "Fixed",
		  "section": "Student Medical",
		  "bestSellers": true
		},
		{
		  "id": 8,
		  "price": 69,
		  "name": "Student comprehensive",
		  "description": "Best student comprehensive plan",
		  "type": "Comprehensive",
		  "section": "Student Medical",
		  "bestSellers": true
		},
		{
		  "id": 9,
		  "price": 154,
		  "name": "J1 insurance",
		  "description": "Best J1 comprehensive plan",
		  "type": "Comprehensive",
		  "section": "J1 Medical",
		  "bestSellers": false
		},
		{
		  "id": 10,
		  "price": 200,
		  "name": "J1 insurance comprehensive",
		  "description": "J1 comprehensive plan",
		  "type": "Comprehensive",
		  "section": "J1 Medical",
		  "bestSellers": true
		},
		{
		  "id": 11,
		  "price": 20,
		  "name": "J1 insurance fixed",
		  "description": "J1 fixed plan",
		  "type": "Fixed",
		  "section": "J1 Medical",
		  "bestSellers": false
		},
	  ]
	};

	//Copy the planBox element depending on how many plans we have
	for(i = 0; i < mockData.quotes.length; i++)
	{
		if(i == 0)
		{
			//This is the planBox that's already built in HTML to be used as a template
			var planBox = document.getElementsByClassName('planBox')[0];
		}
		else
		{
			//Make a copy of the previous planBox
			var planBox = planBox.cloneNode(true);
		}
		
		//Add values from the data onto the targeted planBox
		planBox.childNodes[1].innerHTML = mockData.quotes[i].name;
		planBox.childNodes[3].childNodes[2].innerHTML = '$' + mockData.quotes[i].price;
		planBox.childNodes[3].childNodes[5].innerHTML = mockData.quotes[i].description;
		planBox.childNodes[3].childNodes[8].innerHTML = mockData.quotes[i].type;
		planBox.childNodes[3].childNodes[11].innerHTML = mockData.quotes[i].section;
		
		//If the description is 30 characters or longer, set line-height to half of original value to keep vertical allignment correct
		//This is because >= 30 characters will overflow onto the next line
		if(mockData.quotes[i].description.length >= 30)
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '27.5px';
		}
		else
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '54px';
		}
		
		//Check if this plan is a best seller. This is seperate from the other values because it's a boolean value and the element is not a part of the grid element
		if(mockData.quotes[i].bestSellers)
		{	
			planBox.childNodes[5].innerHTML = 'Best Seller!';
		}
		else
		{
			planBox.childNodes[5].innerHTML = '';
		}
		
		//Add the planBox to the body element
		document.getElementsByClassName("planGrid")[0].appendChild(planBox);
	}
}
var selectedCount = 0;

//Function to select up to 4 plans for comparison
function selectCompare(element){
	
	if(element.getAttribute('selected') == 'false' && selectedCount < 4)
	{
		element.setAttribute('selected', 'true');
		element.childNodes[1].style.backgroundColor = '#eb7f33';
		selectedCount++;
	}
	else if (element.getAttribute('selected') == 'true')
	{
		element.setAttribute('selected', 'false');
		element.childNodes[1].style.backgroundColor = '#1f4a9d';
		selectedCount--;
	}
}

function postAPI()
{
	values = {'startDate': '', 'endDate': '', 'citizenShip': '', 'policyMax': '', 'age': '', 'mailingState': ''};
	
	values.startDate = document.getElementById('startDate').value;
	values.endDate = document.getElementById('endDate').value;
	values.citizenShip = document.getElementById('citizenship').value;
	values.policyMax = document.getElementById('maximum').selectedIndex;
	values.age = document.getElementById('age').value;
	values.mailingState = document.getElementById('state').value;
	
	console.log(values);
	//This will post to the server and navigate to results.html if successful or request missing data if unsuccessful
	var response = $.ajax({
      type: 'POST',
      url: "http://localhost:8080/quotes",
      data: JSON.stringify(values),
	  contentType: 'application/json',
      dataType: "JSON",
      success: function(resultData) {window.location.href = '/results.html';},
	  error:(function() { alert("Please fill out all data fields"); })
	});
}









































