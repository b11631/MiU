$(document).ready(function(){
	
	// Concept implemented by the JQuery Mobile Dev. Team <--> Experimental phase. 
	// Refactoring for this project by: Andrei B.	
	$(function(){
		$('[data-role="list-divider"]').toggle(function(){
			$('.'+$(this).attr('data-link')).addClass('show');
			$(this).children().removeClass('ui-icon-plus').addClass('ui-icon-minus');
		},
	
		function(){
			$('.'+$(this).attr('data-link')).removeClass('show');
			$(this).children().removeClass('ui-icon-minus').addClass('ui-icon-plus');
	 	});	
	});
	
	
	//function to parse the form
	var $myitemForm = $('#itemForm');
	
	//access the validation property (plugging)
	$myitemForm.validate({
		//ignores the items that have the class "ignore" on them			
		ignore: ".ignore",
		invalidHandler: function() {},		
		submitHandler: function(randomId){
		
		//serialize the form data into an object 
		var data = $myitemForm.serializeArray();
		
		//stringify the data from the form object
		var jsonObj = JSON.stringify(data);
		
		//add a random number for the key
		var randomId = genRandomId();
		
		//add the string conversion to the localStorage with a key-value
		localStorage.setItem(randomId,jsonObj);
		
		//reset the form after localStorage insertion
		$($myitemForm)[0].reset();
		
		//refresh localStorage
		window.location = '#displayInfo';
				
		}
	});
		
	//Refresh the '#displayData' page to update all the local store changes
	$('#displayLink').click(function(){
		
		//tranports to displayData
		window.location = '#displayData';	
		
		//refreshes displayData
		window.location.reload('#displayData');
	});
	
	//Clear local storage
	$('#clear').click(function(){
		
		localStorage.clear();
		window.location.reload();	
	});
	
	//Call saveData function to display the local storage	
	outputData();
	
				
}); //here ends $(document).ready();
	




//outputData function starts here	
var outputData = function () {
	
	for(var i = 0, j = localStorage.length; i < j; i ++) {
		
		//retrieve the key of the (i) position
		var storedKey = localStorage.key(i);
		
		//retrieve the value under the retrieved (i) key
		var storedObj = localStorage.getItem(storedKey);
		
		//parse the obj. to have access to its properties (name, length, category, etc.)
		var parsedObj = JSON.parse(storedObj);
		
		//add a localStorageId property to the parsed obj
		parsedObj.id = storedKey;
		
		//create an html div-container with the page id ulOrigin + local Storage id
		var ulListView = $('#container').append('<ul data-role="listview" data-split-icon="minus" data-split-theme="c" data-inset="true" id="ulOrigin'+parsedObj.id+'"></ul>');
		
		//complete the list by adding the <li> element inside of the <ul>
		var insideLi = $('#ulOrigin'+parsedObj.id).append('<li><a href="#li'+parsedObj.id+'"><img src="images/'+parsedObj[0].value+'.png"><h2>'+parsedObj[1].value+'</h2><p>'+parsedObj[0].value+'</p></a><a href = "#deleteObject" data-rel = "popup" data-position-to = "window" data-transition = "pop">Delete Entry</a></li>');	
		
		//keep here for reference
		//window.location.reload('#addItem');
			
	}
};
	
//genRandomId function creates a random number and returns the number 
var genRandomId = function(){
	var randomId = Math.floor(Math.random() * 10000001);
	return randomId;
};