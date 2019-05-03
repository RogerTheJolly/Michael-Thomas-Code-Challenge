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
	//This AJAX call will get the data from the server. On success, it will run the createPlans() function
	var mockData = 	$.ajax({
		  type: 'GET',
		  url: "http://localhost:8080/quotes",
		  contentType: 'application/json',
		  success: function(resultData) {createPlans(resultData)},
		  error:(function() { alert("Please fill out all data fields"); })
		});
		//console.log(resultData);
	
	//This function loops through the data and creates plan boxes for each plan sent
	function createPlans(mockData)
	{
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
			
			//Similar to above. If name is too long, decrease font size
			if(mockData.quotes[i].name.length >= 27)
			{
				planBox.childNodes[1].style.fontSize = '15px';
			}
			else
			{
				planBox.childNodes[1].style.fontSize = '20px';
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
}
var selectedCount = 0;

//Function to select up to 4 plans for comparison
function selectCompare(element)
{
	
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
//global variable to keep track of the number of selected plans
var selectedCount = 0;
//Copy plan elements to modal, enable modal view
function compareSelected()
{
	if(selectedCount >= 2)
	{
		var plans = document.getElementsByClassName('planBox');
		var compareModal = document.getElementsByClassName('compareModal__grid')[0];
		var gridStyleString = '';
		var modalParent = document.getElementsByClassName('compareModal__background')[0];
		
		//This has to be saved as a seperate variable here because inside the following loop, I am adding more planBoxes so I would end up in an infinite loop
		var plansLength = plans.length;
		
		//Clone selected elements into the modal
		for(i = 0; i < plansLength; i++)
		{
			if(plans[i].getAttribute('selected') == 'true')
			{
				var copy = plans[i].cloneNode(true);
				copy.className += ' comparePlan';
				compareModal.appendChild(copy);
				gridStyleString += '1fr ';
			}
		}
		//Adjust the number of grid columns based on the number of selected plans
		compareModal.style.gridTemplateColumns = gridStyleString;
		
		//Show modal
		modalParent.style.display = 'block';
	}
	else
	{
		alert("Please select between 2 and 4 plans to compare");
	}
}

//Reset the comparison. Hide modal, delete modal children
function resetCompare(){
	var compareModal = document.getElementsByClassName("compareModal__grid")[0];
	var modalParent = document.getElementsByClassName('compareModal__background')[0];
	
	while (compareModal.firstChild) {
		compareModal.removeChild(compareModal.firstChild);
	}
	modalParent.style.display = 'none';
}

function resetSelected(){
	
	var plans = document.getElementsByClassName('planBox');
	
	for(i = 0; i < plans.length; i++)
	{
		if(plans[i].getAttribute('selected') == 'true')
		{
			plans[i].setAttribute('selected', 'false');
			plans[i].childNodes[1].style.backgroundColor = '#1f4a9d';
			gridStyleString = '';
			selectedCount = 0;
		}
	}
}

function toggleGrid()
{
	grid = document.getElementsByClassName('planGrid')[0];
	
	if(window.getComputedStyle(grid).display == 'grid')
	{
		grid.style.display = 'block';
	}
	else
	{
		grid.style.display = 'grid';
	}
}
function postAPI()
{
	//Verify that start date comes after end date
	if(document.getElementById('startDate').value >= document.getElementById('endDate').value && document.getElementById('startDate').value != '' && document.getElementById('endDate').value != '')
	{
		alert("End Date must come after Start Date");
	}
	
	else
	{
		//grab the data from the input fields and add it to a JSON variable
		values = {'startDate': '', 'endDate': '', 'citizenShip': '', 'policyMax': '', 'age': '', 'mailingState': ''};
		values.startDate = document.getElementById('startDate').value;
		values.endDate = document.getElementById('endDate').value;
		values.citizenShip = document.getElementById('citizenship').value;
		values.policyMax = document.getElementById('maximum').selectedIndex;
		values.age = document.getElementById('age').value;
		values.mailingState = document.getElementById('state').value;
		
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
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}









































