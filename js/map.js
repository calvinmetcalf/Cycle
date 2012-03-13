var m;
var tid = 3206745;
var geocoder = new google.maps.Geocoder();
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var marker;
var mainLayer;

function initialize() {
    
  m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });

 mainLayer = new google.maps.FusionTablesLayer(tid);
  mainLayer.setQuery("SELECT 'geometry' FROM " + tid + " WHERE 'FacStatus' = 1");
  mainLayer.setMap(m);
  }

function geocode() {
     var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        m.setCenter(results[0].geometry.location);
        m.setZoom(14);
     marker = new google.maps.Marker({
            map: m, 
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

function resetgeo() {
    
    m.setCenter(center);
    m.setZoom(zoom);
marker.setMap(null);
}

 $(function() {
        $( "#tabs" ).tabs({
			collapsible: true,
            selected: -1
		});
        $( "input:submit,input:reset" ).button();
        $('input, textarea').placeholder();
	});
    
    google.load('visualization', '1', {});
    
function popLists(){    
 var queryFacTypeText = encodeURIComponent("SELECT 'Type', COUNT() FROM " + tid + " GROUP BY 'Type'");
	var queryFacType = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryFacTypeText);
	queryFacType.send(getFacTypeData);

    var queryFacSurText = encodeURIComponent("SELECT 'Surface', COUNT() FROM " + tid + " GROUP BY 'Surface'");
    var queryFacSur = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryFacSurText);
	queryFacSur.send(getFacSurData);
    }


function getFacTypeData(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  typeSelect = document.getElementById("facType");  
  for(i = 0; i < numRows; i++) {
      newoption = document.createElement('option');
  	newoption.setAttribute('value'," AND 'Type' like '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	typeSelect.appendChild(newoption);
  }  
}

function getFacSurData(response) {
  
  // Get the number of rows
  numRows = response.getDataTable().getNumberOfRows();
  
  // Add options to the select menu based on the results
  facSurSelect = document.getElementById("facSur");  
  for(i = 0; i < numRows; i++) {
      newoption = document.createElement('option');
 	newoption.setAttribute('value'," AND 'Surface' like  '" + response.getDataTable().getValue(i, 0) + "'");
  	newoption.innerHTML = response.getDataTable().getValue(i, 0);
  	facSurSelect.appendChild(newoption);
  }  
}
function changeMap() {
   var facType = document.getElementById('facType').value.replace("'", "\\'");
  var facSur = document.getElementById('facSur').value.replace("'", "\\'");
  mainLayer.setQuery("SELECT 'geometry' FROM " + tid + " WHERE 'FacStatus' = 1 " + facType + facSur);
 
}