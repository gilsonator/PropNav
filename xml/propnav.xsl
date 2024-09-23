<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:param name="Date"></xsl:param>
    <xsl:param name="Suburb"></xsl:param>
    <xsl:param name="Type"></xsl:param>
    <xsl:param name="PriceRange"></xsl:param>
    <xsl:param name="Agent"></xsl:param>
    <xsl:template match="propnav">
        <table width="100%">
            <tr>
                <th>Suburb</th><th>Type</th><th>Price Range</th><th width="20%">Address</th><th>Agent</th><th>Page</th>
            </tr>
            <xsl:for-each select="property[contains(@pubdate, $Date) and contains(@suburb, $Suburb) and contains(@type, $Type) and contains(@pricerange, $PriceRange) and contains(@agent, $Agent)]">
                <tr>
                    <td><xsl:value-of select="@suburb"/></td>
                    <td><xsl:value-of select="@type"/></td>
                    <td><xsl:value-of select="@pricerange" /></td>
                    <td><a href="" onclick="fnPNShowMap(this)" title="Click to View Map" ><xsl:value-of select="@saddress" /></a></td>
                    <td><xsl:value-of select="@agent" /></td>
                    <td><a href="" onclick="fnPNShow(this)" title="Click to View Page"><xsl:value-of select="@page" /></a></td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
</xsl:stylesheet>
