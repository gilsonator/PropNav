let map = null;
let marker = null;
let addressGLatLng = null;
let myPano = null;
let streetViewVisible = false;
let address;
let suburb;
let pcode;
let sLatLng;
const state = 'QLD';

function load() {
  const urlParams = new URLSearchParams(window.location.search);

  address = urlParams.get('adr');
  suburb = urlParams.get('suburb') || 'Townsville';
  pcode = urlParams.get('pcode') || '4810';
  sLatLng = urlParams.get('latlng');

  if (!address) return;

  document.getElementById('addrDiv').innerHTML = `${address}, ${suburb} ${state} ${pcode}`;

  map = new google.maps.Map(document.getElementById('mapDiv'), {
    zoom: 8,
    center: { lat: -25.344, lng: 131.036 },
    mapTypeId: 'roadmap',
  });

  if (!sLatLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: `${address} ${suburb} ${state} ${pcode}` }, (results, status) => {
      if (status === 'OK') {
        const point = results[0].geometry.location;
        getLatLngCallback(point);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    return;
  }

  const sLatLngSplitted = sLatLng.split(',');
  const point = new google.maps.LatLng(parseFloat(sLatLngSplitted[0]), parseFloat(sLatLngSplitted[1]));

  getLatLngCallback(point);
}

function getLatLngCallback(point) {
  if (!point) {
    alert("We're sorry but the address was not found!");
    window.close();
  } else {
    map.setCenter(point);
    map.setZoom(16);

    marker = new google.maps.Marker({
      position: point,
      map: map,
    });

    const sHTML = `
      <div>
        <img src="images/navigatorbanner_small.jpg" height="40" style="margin: 0 6px 4px 0px">
      </div>
      <div style="padding-top: 3px; font-size: 12pt;">
        ${address},<br>${suburb} ${state} ${pcode}
      </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: sHTML,
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });

    infowindow.open(map, marker);

    addressGLatLng = point;
  }
}

function showStreetView() {
  if (!addressGLatLng) return;

  if (streetViewVisible) {
    myPano.setVisible(false);
    document.getElementById('streetViewDiv').style.display = 'none';
    document.getElementById('mapDiv').style.height = '570px';
    google.maps.event.trigger(map, 'resize');
    centerProperty();
    document.getElementById('cmdStreetView').value = 'Show Street View';
    streetViewVisible = false;
    return;
  }

  const streetViewService = new google.maps.StreetViewService();
  streetViewService.getPanorama({ location: addressGLatLng, radius: 50 }, showPanoData);
}

function showPanoData(panoData, status) {
  if (status !== 'OK') {
    alert('No Street View is available for this address.');
    return;
  }

  streetViewVisible = true;

  document.getElementById('cmdStreetView').value = 'Hide Street View';

  centerProperty();
  document.getElementById('mapDiv').style.height = '320px';
  google.maps.event.trigger(map, 'resize');

  document.getElementById('streetViewDiv').style.display = 'block';
  document.getElementById('streetViewDiv').innerHTML = 'Street View is Loading....';

  if (!myPano) {
    myPano = new google.maps.StreetViewPanorama(document.getElementById('streetViewDiv'), {
      position: panoData.location.latLng,
      pov: { heading: 0, pitch: 0 },
    });
  } else {
    myPano.setPosition(panoData.location.latLng);
    myPano.setVisible(true);
  }

  const angle = computeAngle(addressGLatLng, panoData.location.latLng);
  myPano.setPov({ heading: angle, pitch: 0 });
}

function computeAngle(endLatLng, startLatLng) {
  const DEGREE_PER_RADIAN = 57.2957795;
  const RADIAN_PER_DEGREE = 0.017453;

  const dlat = endLatLng.lat() - startLatLng.lat();
  const dlng = endLatLng.lng() - startLatLng.lng();

  let yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat) * DEGREE_PER_RADIAN;

  // Wrap angle
  yaw = (yaw + 360) % 360;

  return yaw;
}

function centerProperty() {
  map.setCenter(addressGLatLng, map.getZoom());
}

function cmdPrint_onclick() {
  window.print();
}
