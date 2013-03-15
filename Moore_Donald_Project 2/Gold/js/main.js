window.addEventListener("DOMContentLoaded", function(){

	function $(x){
      var theElement = document.getElementById(x);
      return theElement;
    
   }  
    
	function getInfo(){
        var formTag = document.getElementsByTagName("form"),
            selectLi = $("select"),
            makeSelect = document.createElement("select");
            makeSelect.setAttribute("id", "group");
        for(var i=0, j=itemGroups.length; i<j; i++){
            var makeOption = document.createElement("option");
            var opText = itemGroups[i];
            makeOption.setAttribute("value", opText);
            makeOption.innerHTML = opText;
            makeSelect.appendChild(makeOption);          
        }
        selectLi.appendChild(makeSelect);
   }  
	function getSelectedRadio(){
        var radios = document.forms[0].location;
        for(var i=0; i<radios.length; i++){
            if(radios[i].checked){
             locationValue = radios[i].value;
            }
            
        }
        
   }
	function getCheckboxValue(){
        if($("fav").checked){
             favoriteValue = $("fav").value;
        }else{
             favoriteValue = "No"            
        }
   }
	function toggleControls(n){
       switch(n){
            case "on":
               $("itemForm").style.display = "none";
               $("clear").style.display = "inline";
               $("displayLink").style.display = "none";
               $("addNew").style.display = "inline";
                break;
            case "off":
               $("itemForm").style.display = "block";
               $("clear").style.display = "inline";
               $("displayLink").style.display = "inline";
               $("addNew").style.display = "none";
               $("items").style.display = "none";
               break;
            default:
               return false;
       }
   }
  
	function storeData(key){
       //If there is no key,this means this is a brand new item and we need a new key.
      if(!key){      
         var id                = Math.floor(Math.random()*100000001);
      }else{
          //Set the id to the existing key we're editing so that it will save over the data. 
          //The key is the same key that's been passed along from the editSubmit event handler
          //to the validate function, and then passed here, into the storageData function.
          id = key;
      }
      getCheckboxValue();
      getSelectedRadio();
      var item                	={};
			item.group 			=["Group:", $("group").value];
			item.iname			=["Item Name:", $("iname").value];
			item.getbydate		=["Get By:", $("getbydate").value];
			item.location		=["Location:", locationValue];
			item.range			=["Range:", $("range")].value;
			item.fav			=["Favorite:", favoriteValue];
			item.notes			=["Additional Information:", $("notes").value];
                   
          localStorage.setItem(id, JSON.stringify(item));
          alert("Item Saved"); 
                               
   }
   
	function getData(){
       toggleControls("on");
       if(localStorage.length === 0){
           alert("There is no data in local storage. Default JSON data added!");
		   autoFillData(); //Populates JSON Data
       }
       
       var makeDiv = document.createElement("div");
       makeDiv.setAttribute("id", "items");
       var makeList = document.createElement("ul");
       makeDiv.appendChild(makeList);
       document.body.appendChild(makeDiv);
       $("items").style.display = "block";
       for(var i=0, len=localStorage.length; i<len; i++){
           var makeLi = document.createElement("li");
           var linksLi = document.createElement("li");
           makeList.appendChild(makeLi);
           var key = localStorage.key(i);
           var value = localStorage.getItem(key);
           var obj = JSON.parse(value);
           var makeSubList = document.createElement("ul");
           makeLi.appendChild(makeSubList);
		   getImage(obj.group[1],makeSubList);
           for(var n in obj){
               var makeSubLi = document.createElement("li");
               makeSubList.appendChild(makeSubLi);
               var optSubText = obj[n][0]+" "+obj[n][1];
               makeSubLi.innerHTML = optSubText;
               makeSubList.appendChild(linksLi);
          }
           makeItemLinks(localStorage.key(i),linksLi); //create edit and delete buttons each item in local storage
       } 
   }
	//create the edit and delete links for each stored item when displayed.
	function makeItemLinks(key, linksLi){
       var editLink = document.createElement("a");
       editLink.href ="#";
       editLink.key = key; 
       var editText = "Edit Item";
       editLink.addEventListener("click", editItem);
       editLink.innerHTML = editText;
       linksLi.appendChild(editLink);
       
       //add line break
       var breakTag = document.createElement("br");
       linksLi.appendChild(breakTag);
       
       
       var deleteLink = document.createElement("a");
       deleteLink.href = "#";
       deleteLink.key = key;
       var deleteText = "Delete Item";
       deleteLink.addEventListener("click", deleteItem);
       deleteLink.innerHTML = deleteText;
       linksLi.appendChild(deleteLink);  
   }
   
    function editItem(){
	    //grab the data from our local Storage.
	    var value = localStorage.getItem(this.key);
	    var item =JSON.parse(value);
	    
	    //show the form
	    toggleControls("off");
	    
	    $("select").value = item.group[1];
	    $("iname").value = item.iname[1];
	    $("getbydate").value = item.getbydate[1];
	    $("location").value = item.location[1];
	    $("range").value = item.range[1];
	    $("fav").value = item.fav[1];
	    $("notes").value = item.notes[1];
	    $("comments").value = item.comments[1];
	    var checkbox = document.forms[0].fav;
	    for(var i=0; i<checkbox.length; i++){
    	   if(checkbox[i].value == "yes" && item.fav[1] == "yes"){
        	   checkbox[i].setAttribute("checked","checked");
           }else if(checkbox[i].value == "no" && item.fav[1] == "no"){
               checkbox[i].setAttribute("checked","checked");
           }
	    
	    }
	    var radio = document.forms[0].location;
	    for(var i=0; i<radio.length; i++){   
            if(radio[i].value == "walmart" && item.location[1] == "walmart"){
            radio[i].setAttribute("checked","checked");
            }else if(radio[i].value == "albertsons" && item.location[1] == "albertsons"){
            radio[i].setAttribute("checked","checked");
            }else if(radio[i].value == "both" && item.location[1] == "both"){
            radio[i].setAttribute("checked","checked");
           }
        }
             
        //Remove the initial listener from the input "save contact" button.
        submit.removeEventListener("click", storeData);
        //Change submit button value to edit button
        $("submit").value = "Edit Item";
        var editSubmit = $("submit");
        //save the key value established in this function as a property of the editSumit event
        //so we can use that value when we save the data we edited.
        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;              
                   	        	   	        
    }
    
    function deleteItem(){
        var ask = confirm("Are you sure you want to delete this item?");
        if(ask){
            localStorage.removeItem(this.key);
            alert("Item was deleted!!");
            window.location.reload();
        }else{
            alert("Item was NOT deleted.");
        }           
        
    }
    function clearLocal(){
        if(localStorage.length === 0){
            alert("There is no data to clear.");
        }else{
            localStorage.clear();
            alert("All items are deleted!");
            window.location.reload();
            return false;
            
        }           
   }

    function validate(e){
       //Define the element we want to check
       var getItems  = $("group");
       var getIName = $("iname");
       
       //Reset Error Messages
       errMsg.innerHTML ="";
          getItems.style.border  = "1px solid black";
          getIName.style.border = "1px solid black";

       //Get Error Message
       var messageAry = [];
       //group validation
       if(getItems.value === "--Choose A Group--"){
           var itemError = "Please choose a group.";
           getItems.style.border = "1px solid red";
           messageAry.push(itemError);
       }
       //Item name validation
       if(getIName.value === ""){
           var inameError = "Please enter a name.";
           getIName.style.border = "1px solid red";
           messageAry.push(inameError);
       }
       
       //if there were errors,display them on the screen.
       if(messageAry.length >= 1){
           for(var i=0, j=messageAry.length; i < j; i++){
               var txt = document.createElement("li");
               txt.innerHTML = messageAry[i];
               errMsg.appendChild(txt);               
           }
           e.preventDefault();
           return false;
       }else{
           //If all is OK, save our data! send the key value (which came from the editData function).
           //Remember this key alue was passed through the editSubmit event listener as a property.
           storeData(this.key);
       }       
   }

	//get the right images for each item in our data 
	function getImage(imgName, makeSubList){
		var imageLi = document.createElement("li");
		makeSubList.appendChild(imageLi);
		var newImage = document.createElement("img");
		var setSource = newImage.setAttribute("src", "images/" + imgName + ".png");
		imageLi.appendChild(newImage);
	}
	//Populates JSON Data
   	function autoFillData() {
		for (var n in json) {
			var id = Math.floor(Math.random() * 1000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}
	
    // Function to load JSON into localStorage if it isn't in there already.
var defaultData = function() {
	for (var key in jsonData) {
		var tID = Math.floor(Math.random() * 1000000001);					// Create random id	
		localStorage.setItem(tID, JSON.stringify(jsonData[key]));
	}
	alert("No data found, defaults loaded");
};

// Loading the news section
/*$("#group").live('pageshow',function() {
	document.getElementById("upcomingitems").innerHTML = "";
	if (localStorage.length == 0) {
		defaultData();
	}
	// Clearing the div for new data
	document.getElementById("upcomingitems").innerHTML = '';

	// Creating the UL holder and giving it to listview.
	$("#upcomingitems").append("<ul id='newsResultUL' data-role='listview'></ul>");
	$("#newsResultUL").listview();

	// Pulling the data from localStorage and pushing it into a sortable array.
	var items = [];
	for (var key in localStorage) {
		var item = JSON.parse(localStorage.getItem(key));
		item.key = key;
		items.push(item);
	}

	// Sorting out by date.
	items.sort(function(a, b) {
		var date1 = new Date(a.duedate[1]),
			date2 = new Date(b.duedate[1]);
		return date1 - date2;
	});
	// Populate the list
	for (i = 0; i < items.length; i++) {
		var itemList = '';
		for (x = 0, y = items[i].items[1].length; x < y; x++) {
			itemList += items[i].items[1][x] + " ";
		}
		var itemDetails = "<li data-key='" + items[i].key + "'><a href='#bygroup'><h4>" + items[i].aname[1] + "</h4><p>" + itemList + "</strong></p><p>" + items[i].duedate[1] + " " + items[i].duetime[1] + "</p><p class=\"ui-li-aside\">Priority: " + items[i].priority[1] + "</p></a></li>";
		$("#newsResultUL").append(itemDetails);
	}

	$("#newsResultUL").listview("refresh");

	// Set the itemKey variable so I can retrieve it on the bygroup page
	$("#newsResultUL").on('click', 'li', function() {
		sessionStorage.setItem("itemKey", $(this).attr("data-key"));
		$.mobile.changePage('#bygroup');
	});
	
});
*/
// Search Form Activated
$("#searchButton").click(function() {
	// Clear out the searchResults div to avoid previous data from being present
	document.getElementById("searchResults").innerHTML = "";

	// Get our search term and move pages.
	var searchTerm = $("#searchBox").val();
	$.mobile.changePage($("#searchPage"));
	
	// Make sure we have data to search.
	if (localStorage.length == 0) {
		defaultData();
	}

	// Build UL
	$("#searchResults").append("<ul id='resultUL' data-role='listview'></ul>");
	$("#searchResults").trigger("create");

	// Populate the list
	for (var mainKey in localStorage) {
		var item = JSON.parse(localStorage.getItem(mainKey));
		for (var key in item) {
			if (item[key][1].indexOf(searchTerm) != -1) {
				var itemList = '';
				for (x = 0, y = item.items[1].length; x < y; x++) {
						itemList += item.items[1][x] + " ";
				}
				var itemDetails = "<li data-key='" + mainKey + "'><a href='#bygroup'><h4>" + item.aname[1] + "</h4><p>" + itemList + "</strong></p><p>" + item.duedate[1] + " " + item.duetime[1] + "</p><p class=\"ui-li-aside\">Priority: " + item.priority[1] + "</p></a></li>";
				$("#resultUL").append(itemDetails);
				break;
			}
		}
	}
	$("#resultUL").listview("refresh");

	// Set the itemKey variable so I can retrieve it on the bygroup page
	$("#resultUL").on('click', 'li', function() {
		sessionStorage.setItem("itemKey", $(this).attr("data-key"));
		$.mobile.changePage('#bygroup');
	});

});



$("#bygroup").live('pageshow',function() {

	if (!sessionStorage.getItem('itemKey')) {
		$.mobile.back();
	}

	console.log(sessionStorage.getItem('itemKey'));
	var itemKey = sessionStorage.getItem('itemKey');
	document.getElementById('itemDetails').innerHTML = '';
	var item = JSON.parse(localStorage.getItem(itemKey));
	console.log(item);
	$('#itemDetails').append("<h2>" + item.group[0] + "</h2>");
	$('#itemDetails').append("<h3>" + item.iname[0] + "</h3>");
	$('#itemDetails').append("<h3>" + item.getbydate[0] + ":</h3>");
	$('#itemDetails').append("<h3> Location:" + item.location[0] + "</h3>");
	$('#itemDetails').append("<h3>Amount Needed:</h3><p>" + item.range[0] + "</p>");
	$('#itemDetails').append("<h3>Fav?:</h3><p>" + item.favs[0] + "</p>");
	$('#itemDetails').append("<h3>Notes:</h3><p>" + item.notes[1] + "</p>");

});

	var itemGroups = ["--Choose A Group--", "Food", "Clothes", "Housewares", "Electronics"],
		favoriteValue = "No",
		locationValue, 
		errMsg = $("errors");     
    
	getInfo();    


	var displayLink = $("displayLink");
	displayLink.addEventListener("click", getData);
	var clear = $("clear");
	clear.addEventListener("click", clearLocal);
	var submit = $("submit");
	submit.addEventListener("click", validate);
});




//json.sort(sort_by("group", true, parseInt));
	
//json.sort(sort_by("iname", false, function(a){return a.toUpperCase()}));
	
//json.sort(sort_by("getbydate", true, parseInt));
	
//json.sort(sort_by("location", true, parseInt));
	
//json.sort(sort_by("fav", true, parseInt));