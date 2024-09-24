# PropNav
Archived Property Navigator Website Upgraded
## Summary
In my search for employment, I've been busy completely rewriting and upgrading some code I developed a while back, taking advantage of new technology to showcase my skills.

Uses `XML` and `XSLT` to search and transform, producing an `HTML` fragment that shows results in a `<table>`. 

Data is stored in `localStorage` to save downloading, checks last time downloaded and redownloads every 24 hrs from last time.

[`XSLT file (xml/propnav.xsl)`](xml/propnav.xsl)
[`XML Processing Code (scripts/propnav.js)`](scripts/propnav.js)

JavaScript Extract:
```JavaScript
const parser = new DOMParser();
domXMLDocument = parser.parseFromString(xmlText, 'application/xml');
domXSLTDocument = parser.parseFromString(xslText, 'application/xml');

const xsltProcessor = new XSLTProcessor();
xsltProcessor.importStylesheet(domXSLTDocument);
xsltProcessor.transformToFragment(domXMLDocument, document);
```



### Archive Links

https://web.archive.org/web/20091007071916/https://www.townsvillebulletin.com.au/sections/propnav.html

https://web.archive.org/web/20090929152748/http://static.townsvillebulletin.com.au/realestate/Propnav/index2.html

https://web.archive.org/web/*/http://static.townsvillebulletin.com.au/realestate/Propnav*

better:
https://web.archive.org/web/20110222001222/http://www.townsvillebulletin.com.au/sections/propnav.html
