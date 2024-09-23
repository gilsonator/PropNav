if (typeof XPathEvaluator !== 'undefined') {
  XMLDocument.prototype.selectSingleNode = function (cXPathString, xNode) {
    xNode = xNode || this;

    const xItems = this.selectNodes(cXPathString, xNode);
    return xItems.length > 0 ? xItems[0] : null;
  };
  XMLDocument.prototype.selectNodes = function (cXPathString, xNode) {
    xNode = xNode || this;

    const oNSResolver = this.createNSResolver(this.documentElement);
    const aItems = this.evaluate(cXPathString, xNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const aResult = [];

    for (let i = 0; i < aItems.snapshotLength; i++) {
      aResult.push(aItems.snapshotItem(i));
    }

    return aResult;
  };

  XMLDocument.prototype.selectSingleNode = function (cXPathString, xNode) {
    xNode = xNode || this;

    const xItems = this.selectNodes(cXPathString, xNode);
    return xItems.length > 0 ? xItems[0] : null;
  };

  Element.prototype.selectNodes = function (cXPathString) {
    if (this.ownerDocument.selectNodes) {
      return this.ownerDocument.selectNodes(cXPathString, this);
    } else {
      throw new Error('For XML Elements Only');
    }
  };

  Element.prototype.selectSingleNode = function (cXPathString) {
    if (this.ownerDocument.selectSingleNode) {
      return this.ownerDocument.selectSingleNode(cXPathString, this);
    } else {
      throw new Error('For XML Elements Only');
    }
  };
}
