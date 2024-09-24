<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:param name="Date"></xsl:param>
    <xsl:param name="Suburb"></xsl:param>
    <xsl:param name="Type"></xsl:param>
    <xsl:param name="PriceRange"></xsl:param>
    <xsl:param name="Agent"></xsl:param>
    <xsl:template match="propnav">
        <table id="propTable" width="100%">
            <tr>
                <th></th>
                <th>Suburb</th>
                <th>Type</th>
                <th>Price Range</th>
                <th width="20%">Address</th>
                <th>Agent</th>
            </tr>
            <xsl:for-each select="property[contains(@pubdate, $Date) and contains(@suburb, $Suburb) and contains(@type, $Type) and contains(@pricerange, $PriceRange) and contains(@agent, $Agent)]">
                <xsl:variable name="currentPosition" select="position()" />
                <tr>
                    <td>
                        <div class="buttons">
                            <div class="pageBtn" data-id="PageId-{$currentPosition}" data-page="{@page}" data-function="fnPNShow" title="Click to View Page {@page}"></div>
                            <div class="mapBtn" data-id="MapId-{$currentPosition}" data-address="{@saddress},{@suburb}" data-function="fnPNShowMap" title="Click to View Map"></div>
                        </div>
                    </td>
                    <td>
                        <xsl:value-of select="@suburb"/>
                    </td>
                    <td>
                        <xsl:value-of select="@type"/>
                    </td>
                    <td>
                        <xsl:value-of select="@pricerange" />
                    </td>
                    <td>
                        <xsl:value-of select="@saddress" />
                    </td>
                    <td>
                        <xsl:value-of select="@agent" />
                    </td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
</xsl:stylesheet>
