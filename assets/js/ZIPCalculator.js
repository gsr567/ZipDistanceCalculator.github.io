/* Distance between two lat/lng coordinates in km using the Haversine formula */
function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
  if (typeof miles === "undefined"){miles=false;}
  function deg2rad(deg){return deg * (Math.PI/180);}
  function square(x){return Math.pow(x, 2);}
  var r=6371; // radius of the earth in km
  lat1=deg2rad(lat1);
  lat2=deg2rad(lat2);
  var lat_dif=lat2-lat1;
  var lng_dif=deg2rad(lng2-lng1);
  var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
  var d=2*r*Math.asin(Math.sqrt(a));
  if (miles){return d * 0.621371;} //return miles
  else{return d;} //return km
}

totalDistance = 0;

const myForm = document.getElementById("form");
myForm.addEventListener("submit", (e) => {
e.preventDefault();

let zip1 = "";
let zip2 = "";
let latitude1 = "";
let latitude2 = "";
let longitude1 = "";
let longitude2 = "";
const form = document.querySelector('#form')
zip1 = document.getElementById("from").value;
zip2 = document.getElementById("to").value;
let inputs = form.getElementsByTagName('input');
inputs.from.value = zip2;
inputs.to.value = '';

//Parse Through Zip Code JSON Data  
const ourRequest = new XMLHttpRequest();
ourRequest.open('GET','assets/js/ZipCodeDatabase.json');
ourRequest.onload = function (){
    let zipData = JSON.parse(ourRequest.responseText);
    zipData.forEach(element => {
        if (element.Zip == zip1) 
        return latitude1 = element.Latitude,longitude1 = element.Longitude, city1 = element.City, state1 = element.State;
        else return undefined
    })
    zipData.forEach(element => {
        if (element.Zip == zip2)
        return latitude2 = element.Latitude,longitude2 = element.Longitude, city2 = element.City, state2 = element.State;
        else return undefined
    })
  //Run Distance Function with Lat & Long from User Inputs
let distance = getDistanceFromLatLng(latitude1,longitude1,latitude2,longitude2,"miles") 
    if (zip1.length < 5 || zip2.length < 5 || isNaN(zip1) == true || isNaN(zip2) == true || latitude1 == "" || latitude2 == "" || longitude1 == "" || longitude2 == ""){
      return alert(`Please provide valid 5 digit US ZIP Code`)
  }else{
    totalDistance += distance;
    let newDistance = `${zip1} (${city1},${state1}) to ${zip2} (${city2},${state2}) => <strong>${Math.round((distance + Number.EPSILON) * 100) / 100} miles</strong> || <strong>Total Distance = ${Math.round((totalDistance + Number.EPSILON) * 100) / 100} miles</strong><br>`
    document.getElementById("displayDistance").innerHTML += newDistance;
    let markers = [ [latitude1, longitude1],
    [latitude2, longitude2]];
    let customIcon = {
      iconUrl:'assets/img/mappin.png',
      iconSize:[75,75]
     }
     let myIcon = L.icon(customIcon);
     
     let iconOptions = {
      title:'mappin.png',
      draggable:false,
      icon:myIcon
     }
    
    const marker1 = L.marker([latitude1,longitude1],iconOptions).addTo(mymap);
    marker1.bindPopup(`City: ${city1} <br>State: ${state1}<br>Latitude: ${latitude1}<br>Longitude: ${longitude1}`);
    const marker2 = L.marker([latitude2,longitude2],iconOptions).addTo(mymap);
    marker2.bindPopup(`City: ${city2} <br>State: ${state2}<br>Latitude: ${latitude2}<br>Longitude: ${longitude2}`);
    let latlngs = [ [latitude1,longitude1], [latitude2, longitude2] ];

    let polyline = L.polyline(latlngs, {color: '#5cb874'});
    polyline.addTo(mymap)
    mymap.fitBounds(polyline.getBounds());
    
    zip1 = "";
    zip2 = "";
    latitude1 = "";
    latitude2 = "";
    longitude1 = "";
    longitude2 = "";
    return 
  }
  };
    ourRequest.send();
  })
