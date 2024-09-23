
// Written by David Gilson.

function fnRightNavSearch() {
  const oDate = document.getElementById('PubDate');

  if (!oDate.value) {
      alert('Please choose a date...');
      oDate.focus();
      return;
  }

  const params = new URLSearchParams();
  params.append('PubDate', oDate.value);

  const suburb = document.getElementById('Suburb').value;
  if (suburb) params.append('Suburb', suburb);

  const type = document.getElementById('Type').value;
  if (type) params.append('Type', type);

  const priceRange = document.getElementById('PriceRange').value;
  if (priceRange) params.append('PriceRange', priceRange);

  const agent = document.getElementById('Agent').value;
  if (agent) params.append('Agent', agent);

  window.open(`propnav.html?${params.toString()}`);
}

function fnPNShow(elm) {
  let sDate = document.getElementById('PubDate').value;
  sDate = sDate.replace(/\//g, '-');

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;

  const sOptions = `status=no,scrollbars=yes,resizable=yes,left=0,top=0,width=${width},height=${height}`;

  window.open(`../${sDate}/${elm.innerHTML}.pdf`, 'propprev', sOptions);
}


function fnPNShowMap(elem) {
  const sAddress = elem.innerText;

  const width = 800;
  const height = 600;

  const top = (window.screen.availHeight - height) / 2;
  const left = (window.screen.availWidth - width) / 2;

  const sOptions = `status=no,scrollbars=no,resizable=no,left=${left},top=${top},width=${width},height=${height}`;

  window.open(`map.html?adr=${encodeURIComponent(sAddress)}`, 'propmap', sOptions);
}

async function fnPNDoSearch() {
  const oDate = document.getElementById("PubDate");

  if (!oDate.value) {
      alert('Please choose a date...');
      oDate.focus();
      return;
  }

  const myXmlData = './xml/propnav.xml';
  const myXslStylesheet = './xml/propnav.xsl';

  let finishedHTML = '';

  try {
      const [xmlResponse, xslResponse] = await Promise.all([
          fetch(myXmlData),
          fetch(myXslStylesheet)
      ]);

      const xmlText = await xmlResponse.text();
      const xslText = await xslResponse.text();

      const parser = new DOMParser();
      const domXMLDocument = parser.parseFromString(xmlText, 'application/xml');
      const domXSLTDocument = parser.parseFromString(xslText, 'application/xml');

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
  } catch (error) {
      console.error('Error during transformation:', error);
  }

  document.getElementById('results').innerHTML = finishedHTML;
}

async function fnPNBuildSuburbs() {
  const myXmlData = './xml/suburbs.xml';
  const suburbDropdown = document.getElementById('Suburb');

  window.status = 'Loading Suburbs...';
  suburbDropdown.disabled = true;

  try {
      const response = await fetch(myXmlData);
      const xmlText = await response.text();

      const parser = new DOMParser();
      const domXMLDocument = parser.parseFromString(xmlText, 'application/xml');

      const xmlNodes = domXMLDocument.querySelectorAll('suburb');

      xmlNodes.forEach(node => {
          fnPNAddItemToDropDown(suburbDropdown, node.getAttribute('name'), node.getAttribute('name'));
      });
  } catch (error) {
      console.error('Error loading suburbs:', error);
  }

  window.status = '';
  suburbDropdown.disabled = false;
}

async function fnPNBuildAgents() {
  const myXmlData = './xml/agents.xml';
  const agentDropdown = document.getElementById('Agent');

  window.status = 'Loading Agents...';
  agentDropdown.disabled = true;

  try {
      const response = await fetch(myXmlData);
      const xmlText = await response.text();

      const parser = new DOMParser();
      const domXMLDocument = parser.parseFromString(xmlText, 'application/xml');

      const xmlNodes = domXMLDocument.querySelectorAll('agent');

      xmlNodes.forEach(node => {
          fnPNAddItemToDropDown(agentDropdown, node.getAttribute('name'), node.getAttribute('name'));
      });
  } catch (error) {
      console.error('Error loading agents:', error);
  }

  window.status = '';
  agentDropdown.disabled = false;
}

async function fnPNBuildDates() {
  const myXmlData = './xml/dates.xml';
  const pubDateDropdown = document.getElementById('PubDate');

  window.status = 'Loading Dates...';
  pubDateDropdown.disabled = true;

  try {
      const response = await fetch(myXmlData);
      const xmlText = await response.text();

      const parser = new DOMParser();
      const domXMLDocument = parser.parseFromString(xmlText, 'application/xml');

      const xmlNodes = domXMLDocument.querySelectorAll('date');

      xmlNodes.forEach(node => {
          fnPNAddItemToDropDown(pubDateDropdown, node.getAttribute('datestring'), node.getAttribute('datestring'));
      });
  } catch (error) {
      console.error('Error loading dates:', error);
  }

  window.status = '';
  pubDateDropdown.disabled = false;
}

function fnPNAddItemToDropDown(oDropDown, cValue, cText) {
  const oOption = document.createElement('option');
  oOption.value = cValue;
  oOption.text = cText;
  oDropDown.add(oOption);
}
