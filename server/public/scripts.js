//Reset all input fields to default on the quote page
function reset(){
	document.getElementById('age').value = '';
	document.getElementById('citizenship').value = '';
	document.getElementById('state').value = '';
	document.getElementById('startDate').value = null;
	document.getElementById('endDate').value = null;
	document.getElementById('maximum').selectedIndex = 0;
}

var globalData = {};

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
}
//This function loops through the data and creates plan boxes for each plan sent
function createPlans(mockData)
{
	
	if(mockData.quotes)
	{	
		mockData = mockData.quotes;
	}
	globalData = mockData;
	
	//Copy the planBox element depending on how many plans we have
	for(i = 0; i < mockData.length; i++)
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
		planBox.childNodes[1].innerHTML = mockData[i].name;
		planBox.childNodes[3].childNodes[2].innerHTML = '$' + mockData[i].price;
		planBox.childNodes[3].childNodes[5].innerHTML = mockData[i].description;
		planBox.childNodes[3].childNodes[8].innerHTML = mockData[i].type;
		planBox.childNodes[3].childNodes[11].innerHTML = mockData[i].section;
		
		//If the description is 30 characters or longer, set line-height to half of original value to keep vertical allignment correct
		//This is because >= 30 characters will overflow onto the next line
		if(mockData[i].description.length >= 30)
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '27.5px';
		}
		else
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '54px';
		}
		
		//Similar to above. If name is too long, decrease font size
		if(mockData[i].name.length >= 27)
		{
			planBox.childNodes[1].style.fontSize = '15px';
		}
		else
		{
			planBox.childNodes[1].style.fontSize = '20px';
		}
		
		//Check if this plan is a best seller. This is seperate from the other values because it's a boolean value and the element is not a part of the grid element
		if(mockData[i].bestSellers)
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

//Sorts data based on price or name
function sortData(index)
{
	data = globalData;
	var planBoxes = document.getElementsByClassName('planBox');
	
	//Delete all existing planBox elements (except one, to be used as a template for copying)
	if(planBoxes.length > 1)
	{
		var length = planBoxes.length;
		
		for(i = length; i > 1; i--)
		{
			planBoxes[i-1].parentNode.removeChild(planBoxes[i-1]);
		}
	}

	//Does my comparison for sorting
	function GetSortOrder(prop) {  
		return function(a, b) {  
			if (a[prop] > b[prop]) {  
				return 1;  
			} else if (a[prop] < b[prop]) {  
				return -1;  
			}  
			return 0;  
		}  
	}  
	
	//Translate selectedIndex to a property name
	if(index == 1)
	{
		property = "price";
	}
	else
	{
		property = "name";
	}
	  
	data.sort(GetSortOrder(property)); 
	
	//Run this function again to repopulate planBoxes
	createPlans(data);
}

function applyFilter()
{
	data = globalData;
	var planBoxes = document.getElementsByClassName('planBox');
	
	//Delete all existing planBox elements (except one, to be used as a template for copying)
	if(planBoxes.length > 1)
	{
		//Length needs to be saved in a variable becuase planBoxes[] will be changing as planBoxes are removed
		var length = planBoxes.length;
		
		for(i = length; i > 1; i--)
		{
			planBoxes[i-1].parentNode.removeChild(planBoxes[i-1]);
		}
	}

	//Get the filter options
	var maxPrice = document.getElementById('maxPrice').value;
	if (maxPrice == '')
		maxPrice = 999999999;
	
	var comprehensive = document.getElementById('Comprehensive').checked;
	var fixed = document.getElementById('Fixed').checked;
	
	var bestSeller = document.getElementById('bestSeller').selectedIndex;
	
	var travelMed = document.getElementById('Travel').checked;
	var intTravelMed = document.getElementById('International').checked;
	var studentMed = document.getElementById('Student').checked;
	var j1Med = document.getElementById('J1').checked;
	
	//Copy the planBox element depending on how many plans we have
	for(i = 0; i < data.length; i++)
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
		
		//Skip anything that doesn't match the filters
		if(data[i].price > maxPrice || (!comprehensive && data[i].type == "Comprehensive") || (!fixed && data[i].type == "Fixed") || (bestSeller == 0 && !data[i].bestSellers) || (bestSeller == 1 && data[i].bestSellers)
			 || (!travelMed && data[i].section == 'Travel Medical') || (!intTravelMed && data[i].section == 'International Travel Medical') || (!studentMed && data[i].section == 'Student Medical') || (!j1Med && data[i].section == 'J1 Medical'))
		{
			continue;
		}
		//Add values from the data onto the targeted planBox
		planBox.childNodes[1].innerHTML = data[i].name;
		planBox.childNodes[3].childNodes[2].innerHTML = '$' + data[i].price;
		planBox.childNodes[3].childNodes[5].innerHTML = data[i].description;
		planBox.childNodes[3].childNodes[8].innerHTML = data[i].type;
		planBox.childNodes[3].childNodes[11].innerHTML = data[i].section;
		
		//If the description is 30 characters or longer, set line-height to half of original value to keep vertical allignment correct
		//This is because >= 30 characters will overflow onto the next line
		if(data[i].description.length >= 30)
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '27.5px';
		}
		else
		{
			planBox.childNodes[3].childNodes[5].style.lineHeight = '54px';
		}
		
		//Similar to above. If name is too long, decrease font size
		if(data[i].name.length >= 27)
		{
			planBox.childNodes[1].style.fontSize = '15px';
		}
		else
		{
			planBox.childNodes[1].style.fontSize = '20px';
		}
		
		//Check if this plan is a best seller. This is seperate from the other values because it's a boolean value and the element is not a part of the grid element
		if(data[i].bestSellers)
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
	
	//The following checks are for the first planBox in the set, as that one does not get deleted by default because it's used to make copies
	
	//Delete any planBoxes that don't match the filter
	if(parseInt(planBoxes[0].childNodes[3].childNodes[2].innerHTML.toString().replace('$','')) > maxPrice || (!comprehensive && planBoxes[0].childNodes[3].childNodes[8].innerHTML == "Comprehensive")
		 || (!fixed && planBoxes[0].childNodes[3].childNodes[8].innerHTML == "Fixed") || (bestSeller == 0 && planBoxes[0].childNodes[5].innerHTML == '') || (bestSeller == 1 && planBoxes[0].childNodes[5].innerHTML != '')
		 || (!travelMed && planBoxes[0].childNodes[3].childNodes[11].innerHTML == 'Travel Medical') || (!intTravelMed && planBoxes[0].childNodes[3].childNodes[11].innerHTML == 'International Travel Medical')
		 || (!studentMed && planBoxes[0].childNodes[3].childNodes[11].innerHTML == 'Student Medical') || (!j1Med && planBoxes[0].childNodes[3].childNodes[11].innerHTML == 'J1 Medical'))
	{
		planBoxes[0].parentNode.removeChild(planBoxes[0]);
	}
}
var selectedCount = 0;

//Function to select up to 4 plans for comparison
function selectCompare(element)
{
	//Select planBoxes on click, up to 4 total
	if(element.getAttribute('selected') == 'false' && selectedCount < 4)
	{
		element.setAttribute('selected', 'true');
		element.childNodes[1].style.backgroundColor = '#eb7f33';
		selectedCount++;
	}
	//Deselect planBoxes
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
function closeCompare(){
	var compareModal = document.getElementsByClassName("compareModal__grid")[0];
	var modalParent = document.getElementsByClassName('compareModal__background')[0];
	
	while (compareModal.firstChild) {
		compareModal.removeChild(compareModal.firstChild);
	}
	modalParent.style.display = 'none';
}
//Deselect all planBoxes
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

//Switch between grid and list view
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
//Open the filter modal
function toggleFilter()
{
	var modal =document.getElementsByClassName('filterModal__background')[0];
	
	if(modal.getAttribute('view') == 'hidden')
	{
		modal.style.display = 'block';
		modal.setAttribute('view', 'shown');
	}
	else
	{
		modal.style.display = 'none';
		modal.setAttribute('view', 'hidden');
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

//Scroll to the top of the window every time the page is reloaded
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}









































