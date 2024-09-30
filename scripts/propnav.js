// Written by David Gilson.

function fnPNShow(elm) {
  let sDate = document.getElementById('PubDate').value;
  sDate = sDate.replace(/\//g, '-');

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;

  const sOptions = `status=no,scrollbars=yes,resizable=yes,left=0,top=0,width=${width},height=${height}`;

  // window.open(`../${sDate}/${elm.innerHTML}.pdf`, 'propprev', sOptions);
  // const baseURL = window.location.href;
  const fullPath = `${sDate}_page-${elm.dataset.page}.pdf`;

  window.customAlert.show(`A PDF of Page ${elm.dataset.page} would have downloaded from:\n\n${fullPath}`);
  return null;
}

function fnPNShowMap(elem) {
  const sAddress = elem.dataset.address;

  const width = 800;
  const height = 600;

  const top = (window.screen.availHeight - height) / 2;
  const left = (window.screen.availWidth - width) / 2;

  const sOptions = `status=no,scrollbars=no,resizable=no,left=${left},top=${top},width=${width},height=${height}`;

  return window.open(`map.html?adr=${encodeURIComponent(sAddress)}`, 'propmap', sOptions);
}

const fetchInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let propertiesData;

async function fnLoadXMLData(){
  // DG TODO: create json on xml loading first?
  const myXmlData = './xml/propnav.xml';
  const myXslStylesheet = './xml/propnav-data.xsl';

  let jsonString = '';
  let xmlText;
  let xslDataText;

  try {

    const [xmlResponse, xslResponse] = await Promise.all([fetch(myXmlData), fetch(myXslStylesheet)]);

    xmlText = await xmlResponse.text();
    xslDataText = await xslResponse.text();

    try {
      // Attempt to store the data in localStorage
      window.localStorage.setItem('xslDataText', xslDataText);
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Unable to store new data.');
        // Handle the error, e.g., by clearing some old data or notifying the user
      } else {
        throw e; // Re-throw other errors
      }
    }

    const parser = new DOMParser();
    domXMLDocument = parser.parseFromString(xmlText, 'application/xml');
    domXSLTDocument = parser.parseFromString(xslDataText, 'application/xml');

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(domXSLTDocument);

    const fragment = xsltProcessor.transformToFragment(domXMLDocument, document);
    const tmpBox = document.createElement('div');
    tmpBox.appendChild(fragment);

    jsonString = tmpBox.textContent.trim();

    window.localStorage.setItem('propertiesData.json', jsonString);
    propertiesData = JSON.parse(jsonString);
    console.log ('PropertyData:', propertiesData);

    return propertiesData;

  } catch (error) {
    console.error('Error during transformation:', error);
  }
}

async function fnPNDoSearch() {
  const oDate = document.getElementById('PubDate');

  if (!oDate.value) {
    window.customAlert.show('Please choose a date...');
    oDate.focus();
    return;
  }

  const myXmlData = './xml/propnav.xml';
  const myXslStylesheet = './xml/propnav.xsl';

  let finishedHTML = '';
  let xmlText;
  let xslText;

  try {
    const lastFetchTime = Number(window.localStorage.getItem('lastFetchTime'));
    const currentTime = new Date().getTime();

    if (!lastFetchTime || currentTime - lastFetchTime > fetchInterval) {
      const [xmlResponse, xslResponse] = await Promise.all([fetch(myXmlData), fetch(myXslStylesheet)]);

      xmlText = await xmlResponse.text();
      xslText = await xslResponse.text();

      try {
        // Attempt to store the data in localStorage
        window.localStorage.setItem('xmlText', xmlText);
        window.localStorage.setItem('xslText', xslText);
        window.localStorage.setItem('lastFetchTime', currentTime.toString());
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Unable to store new data.');
          // Handle the error, e.g., by clearing some old data or notifying the user
        } else {
          throw e; // Re-throw other errors
        }
      }
    } else {
      xmlText = window.localStorage.getItem('xmlText');
      xslText = window.localStorage.getItem('xslText');
    }

    const parser = new DOMParser();
    domXMLDocument = parser.parseFromString(xmlText, 'application/xml');
    domXSLTDocument = parser.parseFromString(xslText, 'application/xml');

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(domXSLTDocument);

    xsltProcessor.setParameter(null, 'Date', oDate.value);
    xsltProcessor.setParameter(null, 'Suburb', document.getElementById('Suburb').value);
    xsltProcessor.setParameter(null, 'Type', document.getElementById('Type').value);
    xsltProcessor.setParameter(null, 'PriceRange', document.getElementById('PriceRange').value);
    xsltProcessor.setParameter(null, 'Agent', document.getElementById('Agent').value);

    const fragment = xsltProcessor.transformToFragment(domXMLDocument, document);

    const tmpBox = document.createElement('div');
    tmpBox.appendChild(fragment);

    finishedHTML = tmpBox.innerHTML;

    document.getElementById('results').innerHTML = finishedHTML;

    // Add click event for table to handle multiple row div buttons without multiple event handlers
    document.getElementById('propTable').addEventListener('click', function (event) {
      if (event.target) {
        if (event.target.matches('div.mapBtn')) {
          const mapWindow = fnPNShowMap(event.target);
          console.log('Map Window Opened:', mapWindow);
        } else if (event.target.matches('div.pageBtn')) {
          fnPNShow(event.target);
        } else if (event.target.matches('td') && event.target.parentNode.matches('tr')) {
          const row = event.target.parentElement 
          const id = row.dataset.id;
          
          //row.classList.toggle('clicked');

          customAlert.show (`Clicked: ${id}`);
          console.log ('PropertyData:', row);
        }
      }
    });
  } catch (error) {
    console.error('Error during transformation:', error);
  }
}

async function fnPNBuildSuburbs() {
  const suburbDropdown = document.getElementById('Suburb');
  suburbDropdown.disabled = true;

  // Sort suburbs alphabetically
  const sortedSuburbs = propertiesData.suburbs.sort();

  sortedSuburbs.forEach(suburb => {
    fnPNAddItemToDropDown(suburbDropdown, suburb, suburb);
  });

  suburbDropdown.disabled = false;
}

async function fnPNBuildAgents() {
  const agentDropdown = document.getElementById('Agent');
  agentDropdown.disabled = true;

  // Sort agents alphabetically
  const sortedAgents = propertiesData.agents.sort();

  sortedAgents.forEach(agent => {
    fnPNAddItemToDropDown(agentDropdown, agent, agent);
  });

  agentDropdown.disabled = false;
}


function fnPNBuildPrices() {
  const priceRangeDropdown = document.getElementById('PriceRange');
  priceRangeDropdown.disabled = true;

  // Sort the price ranges
  const sortedPriceRanges = propertiesData.priceRanges.sort((a, b) => {
    const parsePrice = priceRange => {
      if (priceRange.includes('Auction') || priceRange.includes('Price on Application')) {
        return Infinity; // Non-numeric values go to the end
      }
      const match = priceRange.match(/\d+/g);
      return match ? parseInt(match[0], 10) : Infinity;
    };

    return parsePrice(a) - parsePrice(b);
  });

  // Add sorted price ranges to the dropdown
  sortedPriceRanges.forEach(priceRange => {
    fnPNAddItemToDropDown(priceRangeDropdown, priceRange, priceRange);
  });

  priceRangeDropdown.disabled = false;
}


function fnPNBuildDates() {
  const pubDateDropdown = document.getElementById('PubDate');
  pubDateDropdown.disabled = true;

  // Convert date strings to Date objects for sorting
  const sortedDates = propertiesData.pubDates.map(dateString => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  }).sort((a, b) => a - b);

  // Convert sorted Date objects back to strings
  const sortedDateStrings = sortedDates.map(date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  });

  sortedDateStrings.forEach(dateString => {
    fnPNAddItemToDropDown(pubDateDropdown, dateString, dateString);
  });

  pubDateDropdown.disabled = false;
}


function fnPNAddItemToDropDown(oDropDown, cValue, cText) {
  const oOption = document.createElement('option');
  oOption.value = cValue;
  oOption.text = cText;
  oDropDown.add(oOption);
}

window.fnPNBuildDates = fnPNBuildDates;
