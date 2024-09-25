<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="text" encoding="UTF-8" />
    <xsl:param name="Date" select="'*'"></xsl:param>
    <xsl:param name="Suburb" select="'*'"></xsl:param>
    <xsl:param name="Type" select="'*'"></xsl:param>
    <xsl:param name="PriceRange" select="'*'"></xsl:param>
    <xsl:param name="Agent" select="'*'"></xsl:param>

    <!-- Define keys for each attribute -->
    <xsl:key name="pubDateKey" match="property" use="@pubdate" />
    <xsl:key name="suburbKey" match="property" use="@suburb" />
    <xsl:key name="typeKey" match="property" use="@type" />
    <xsl:key name="priceRangeKey" match="property" use="@pricerange" />
    <xsl:key name="agentKey" match="property" use="@agent" />

    <xsl:template match="propnav">
        <xsl:text>{</xsl:text>

        <!-- pubDate List -->
        <xsl:text>"pubDates": [</xsl:text>
        <xsl:for-each select="property[generate-id() = generate-id(key('pubDateKey', @pubdate)[1])]">
            <xsl:if test="position() > 1">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>"</xsl:text><xsl:value-of select="@pubdate"/><xsl:text>"</xsl:text>
        </xsl:for-each>
        <xsl:text>],</xsl:text>

        <!-- Suburb List -->
        <xsl:text>"suburbs": [</xsl:text>
        <xsl:for-each select="property[generate-id() = generate-id(key('suburbKey', @suburb)[1])]">
            <xsl:if test="position() > 1">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>"</xsl:text><xsl:value-of select="@suburb"/><xsl:text>"</xsl:text>
        </xsl:for-each>
        <xsl:text>],</xsl:text>

        <!-- Type List -->
        <xsl:text>"types": [</xsl:text>
        <xsl:for-each select="property[generate-id() = generate-id(key('typeKey', @type)[1])]">
            <xsl:if test="position() > 1">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>"</xsl:text><xsl:value-of select="@type"/><xsl:text>"</xsl:text>
        </xsl:for-each>
        <xsl:text>],</xsl:text>

        <!-- Price Range List -->
        <xsl:text>"priceRanges": [</xsl:text>
        <xsl:for-each select="property[generate-id() = generate-id(key('priceRangeKey', @pricerange)[1])]">
            <xsl:if test="position() > 1">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>"</xsl:text><xsl:value-of select="@pricerange"/><xsl:text>"</xsl:text>
        </xsl:for-each>
        <xsl:text>],</xsl:text>

        <!-- Agent List -->
        <xsl:text>"agents": [</xsl:text>
        <xsl:for-each select="property[generate-id() = generate-id(key('agentKey', @agent)[1])]">
            <xsl:if test="position() > 1">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>"</xsl:text><xsl:value-of select="@agent"/><xsl:text>"</xsl:text>
        </xsl:for-each>
        <xsl:text>]</xsl:text>

        <xsl:text>}</xsl:text>
    </xsl:template>
</xsl:stylesheet>
