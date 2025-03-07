import { request } from "node:http";
import PuppeteerScrapper from "../providers/browser";
import logger from "../providers/logger";
import { sleep } from "../utils";
import { Proxy } from "../providers/proxies";
import { PageBlocked } from "../errors/customError";
import { Page } from "puppeteer";
import { Property } from "../../types";

export class TrulliaSalePropertyBronxListings {
    constructor() { }

    protected async ScrapeDealings() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";
        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery",
            "variables": {
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "searchDetails": {
                    "searchType": "FOR_SALE",
                    "location": {
                        "cities": [
                            {
                                "city": "Bronx",
                                "state": "NY"
                            }
                        ]
                    },
                    "filters": {
                        "sort": {
                            "type": "DATE",
                            "ascending": false
                        },
                        "page": 1,
                        "limit": 190,
                        "isAlternateListingSource": true,
                        "propertyTypes": [],
                        "listingTypes": [
                            "FSBO"
                        ],
                        "pets": [],
                        "rentalListingTags": [],
                        "foreclosureTypes": [],
                        "buildingAmenities": [],
                        "unitAmenities": [],
                        "landlordPays": [],
                        "propertyAmenityTypes": [],
                        "sceneryTypes": [],
                        "includeOffMarket": false
                    }
                },
                "includeOffMarket": false,
                "includeLocationPolygons": true,
                "includeNearBy": true,
                "enableCommingling": false
            },
            "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    }
    public async exec() {
        const Properties = await this.ScrapeDealings();
        return Properties.data.searchResultMap.homes.map((item: any) => {
            return {
                Url: item.url ? item.url : "",
                Property_Address: item.location.fullLocation ? item.location.fullLocation : "",
                Price: item.price.formattedPrice ? item.price.formattedPrice : "",
                Days_On_Market: item.activeListing.dateListed ? item.activeListing.dateListed : "",
                OwnerName: "",
                Email: "",
                Phone_Number: "",
                Source: "trullia"
            }
        })

    }
}


export class TrulliaPropertyManhatanListing {
    constructor() { }
    protected async GetListing() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";

        const requestbody = {
            "operationName": "WEB_searchResultsMapQuery", "variables": { "heroImageFallbacks": ["STREET_VIEW", "SATELLITE_VIEW"], "searchDetails": { "searchType": "FOR_SALE", "location": { "cities": [{ "city": "Manhattan", "state": "NY" }] }, "filters": { "sort": { "type": "DATE", "ascending": false }, "page": 1, "limit": 190, "isAlternateListingSource": false, "propertyTypes": [], "listingTypes": ["FSBO"], "pets": [], "rentalListingTags": [], "foreclosureTypes": [], "buildingAmenities": [], "unitAmenities": [], "landlordPays": [], "propertyAmenityTypes": [], "sceneryTypes": [], "includeOffMarket": false } }, "includeOffMarket": false, "includeLocationPolygons": true, "includeNearBy": true, "enableCommingling": false }, "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestbody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    };

    public async exec() {
        const Properties = await this.GetListing();
        return Properties.data.searchResultMap.homes.map((item: any) => {
            return {
                Url: item.url ? item.url : "",
                Property_Address: item.location.fullLocation ? item.location.fullLocation : "",
                Price: item.price.formattedPrice ? item.price.formattedPrice : "",
                Days_On_Market: item.activeListing.dateListed ? item.activeListing.dateListed : "",
                OwnerName: "",
                Email: "",
                Phone_Number: "",
                Source: "trullia"
            }
        })

    }
}

export class TrulliaPropertyNyListing {
    constructor() { };
    protected async GetListing() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery"
        const requetBody = {
            "operationName": "WEB_searchResultsMapQuery", "variables": { "heroImageFallbacks": ["STREET_VIEW", "SATELLITE_VIEW"], "searchDetails": { "searchType": "FOR_SALE", "location": { "states": [{ "state": "NY" }] }, "filters": { "sort": { "type": "DATE", "ascending": false }, "page": 1, "limit": 190, "isAlternateListingSource": false, "propertyTypes": [], "listingTypes": ["FSBO"], "pets": [], "rentalListingTags": [], "foreclosureTypes": [], "buildingAmenities": [], "unitAmenities": [], "landlordPays": [], "propertyAmenityTypes": [], "sceneryTypes": [], "includeOffMarket": false } }, "includeOffMarket": false, "includeLocationPolygons": true, "includeNearBy": true, "enableCommingling": false }, "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        };
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requetBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }


    }
    public async exec() {
        const Properties = await this.GetListing();
        return Properties.data.searchResultMap.homes.map((item: any) => {
            return {
                Url: item.url ? item.url : "",
                Property_Address: item.location.fullLocation ? item.location.fullLocation : "",
                Price: item.price.formattedPrice ? item.price.formattedPrice : "",
                Days_On_Market: item.activeListing.dateListed ? item.activeListing.dateListed : "",
                OwnerName: "",
                Email: "",
                Phone_Number: "",
                Source: "trullia"
            }
        })

    }

}

export class TrulliaPropertyBrooklin {
    constructor() { };

    protected async GetListing() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";
        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery", "variables": { "heroImageFallbacks": ["STREET_VIEW", "SATELLITE_VIEW"], "searchDetails": { "searchType": "FOR_SALE", "location": { "cities": [{ "city": "Brooklyn", "state": "NY" }] }, "filters": { "sort": { "type": "DATE", "ascending": false }, "page": 1, "limit": 190, "isAlternateListingSource": false, "propertyTypes": [], "listingTypes": ["FSBO"], "pets": [], "rentalListingTags": [], "foreclosureTypes": [], "buildingAmenities": [], "unitAmenities": [], "landlordPays": [], "propertyAmenityTypes": [], "sceneryTypes": [], "includeOffMarket": false } }, "includeOffMarket": false, "includeLocationPolygons": true, "includeNearBy": true, "enableCommingling": false }, "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    }

    public async exec() {
        const Properties = await this.GetListing();
        return Properties.data.searchResultMap.homes.map((item: any) => {
            return {
                Url: item.url ? item.url : "",
                Property_Address: item.location.fullLocation ? item.location.fullLocation : "",
                Price: item.price.formattedPrice ? item.price.formattedPrice : "",
                Days_On_Market: item.activeListing.dateListed ? item.activeListing.dateListed : "",
                OwnerName: "",
                Email: "",
                Phone_Number: "",
                Source: "trullia"
            }
        })

    }


}


export default class Trulia extends PuppeteerScrapper<Array<string>> {


    constructor(private url: string, private proxy: Proxy) {
        super([], {
            protocolTimeout: 999999, headless: false, args: [
                `--proxy-server=http://${proxy.proxy_address}:${proxy.port}`,
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1500,1200',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ]
        })
    }



    protected async $extract(): Promise<void> {
        await this.$page!.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="133", "Chromium";v="133", "Not-A.Brand";v="24"',
        });
        await this.$page!.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36');

        await this.$page!.setViewport({ width: 1500, height: 1200 });

        // Spoof WebGL and Canvas fingerprints
        await this.$page!.evaluateOnNewDocument(() => {
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (parameter) {
                if (parameter === 37445) return 'Intel Inc.';
                if (parameter === 37446) return 'Intel Iris OpenGL Engine';
                return getParameter(parameter);
            };

            const toBlob = HTMLCanvasElement.prototype.toBlob;
            HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext('2d');
                ctx!.drawImage(this, 0, 0);
                canvas.toBlob(callback, type, quality);
            };
        });
        let PropertyUrls: Array<string> = []
        await this.$page?.authenticate({
            username: this.proxy.username,
            password: this.proxy.password,
        });

        await this.$page?.setRequestInterception(true);

        this.$page?.on('request', async (req) => {
            await req.continue();
        });






        const responseHandler = async (res: any) => {
            try {
                if (res.url().includes('https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery&transactionId')) {
                    let data = await res.json();
                    if (data.data.searchResultMap.homes) {
                        data.data.searchResultMap.homes.map((home: { url: any; }) => { return PropertyUrls.push(home.url) });
                        logger.info(`Property Collected :: ${PropertyUrls.length}`,);
                    } else {
                        console.log('No Home Key ...');
                    }
                    this.$page?.off('response', responseHandler); // Remove the listener after it runs once
                }
            } catch (error) {
                console.log('No Homes ...');
            }
        };
        this.$page?.on('response', responseHandler);


        await this.$page?.goto(this.url, { timeout: 0, waitUntil: "networkidle2" });

        await this.$page!.waitForSelector('h2').then(async () => {


            if (PropertyUrls.length === 0) {
                await sleep(1000000);
                throw new PageBlocked();
            } else {
                this.payload = [...PropertyUrls];
                return
            }
        }).catch(async () => {
            await this._browser?.close();
            throw new PageBlocked()
        })

    }
}


export async function fetchTruliaHomeDetails(homeUrl: string) {
    const endpoint = 'https://www.trulia.com/graphql?operation_name=WEB_homeDetailsClientTopThirdLookUp';

    const requestBody = {
        operationName: "WEB_homeDetailsClientTopThirdLookUp",
        variables: {
            enableBuilderCommunityScheduleATour: false,
            includeSurroundingPhotos: true,
            skipLeadForm: false,
            isOffMarket: false,
            displayTimeCheckedOnLoad: false,
            leadFormAbTests: [
                "AB_DIRECT_CONNECT",
                "AB_SCHEDULE_TOUR_CTA"
            ],
            includeReviewHighlights: false,
            heroImageFallbacks: [
                "STREET_VIEW",
                "SATELLITE_VIEW"
            ],
            url: homeUrl,
            providerListingId: null,
            email: null,
            skipConversations: true
        },
        query: "query WEB_homeDetailsClientTopThirdLookUp($url: String!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $providerListingId: String, $email: String, $skipConversations: Boolean!, $enableBuilderCommunityScheduleATour: Boolean = false, $includeSurroundingPhotos: Boolean = false, $skipLeadForm: Boolean = false, $isOffMarket: Boolean = false, $displayTimeCheckedOnLoad: Boolean = true, $leadFormAbTests: [LEADFORM_AB_Tests] = [], $includeReviewHighlights: Boolean = false) {\n  homeDetailsByUrl(url: $url) {\n    url\n    homeUrl\n    ...LeadFormFragment @skip(if: $skipLeadForm)\n    ...HomeDetailsListingProviderFragment\n    ...HomeDetailsListingAgentFragment\n    ...HomeDetailsSurroundingPhotosFragment\n    ...HomeDetailsNearbyOffMarketFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyRentFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbySaleFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyNewListingsFragment @skip(if: $isOffMarket)\n    ...HomeDetailsSimilarHomesFragment @skip(if: $isOffMarket)\n    ...HomeDetailsNeighborhoodOverviewFragment\n    ...HomeDetailsMarketComparisonsFragment\n    ...HomeDetailsSchoolsFragment\n    ...HomeDetailsComparablesFragment\n    ...HomeDetailsMortgageInfoAndHoaFeeFragment\n    ...HomeDetailsRatingsAndReviewsFragment\n    ...HomeDetailsSaveHomeClientFragment\n    ...HiddenHomeClientFragment\n    ...HomeDetailsLastUpdatedAttributionFragment\n    primaryNavigation {\n      ...Header\n      __typename\n    }\n    ...HomeDetailsBackToSearchFragment\n    surroundings {\n      locationId\n      ... on SURROUNDINGS_Neighborhood {\n        ndpType\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      ... on SURROUNDINGS_City {\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  latestConversationsDetailsByProviderListingId(\n    providerListingId: $providerListingId\n    email: $email\n  ) @skip(if: $skipConversations) {\n    ...LatestConversationsDetailsContentFragment\n    __typename\n  }\n}\n\nfragment Agent on LEADFORM_Contact {\n  __typename\n  displayName\n  callPhoneNumber\n  textMessagePhoneNumber\n  ... on LEADFORM_AgentContact {\n    agentType\n    agentId\n    agentRating {\n      averageValue\n      maxValue\n      __typename\n    }\n    numberOfReviews\n    numberOfRecentSales\n    role\n    hasPAL\n    profileURL(pathOnly: false)\n    largeImageUrl\n    profileImageURL\n    broker {\n      name\n      phoneNumber\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormContactFragment on LEADFORM_ContactLayout {\n  callToActionDisplay(appendOneClick: true) {\n    callToActionDisplayLabel\n    supportsCancellableSubmission\n    callToActionType\n    __typename\n  }\n  contactList {\n    ... on LEADFORM_AgentContactList {\n      allowsSelection\n      footer {\n        markdown\n        __typename\n      }\n      __typename\n    }\n    __typename\n    contacts {\n      ...Agent\n      __typename\n    }\n    primaryContactPhoneNumber\n  }\n  additionalComponents {\n    componentId\n    displayLabel\n    __typename\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      isRequired\n      displayLabel\n      displayLabelSelected\n      displayLabelUnselected\n      tooltipText\n      __typename\n    }\n  }\n  formComponents {\n    __typename\n    componentId\n    displayLabel\n    ... on LEADFORM_LongTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_OptionGroupComponent {\n      options {\n        displayLabel\n        value\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      displayLabel\n      componentId\n      tooltipText\n      descriptionText\n      __typename\n    }\n    ... on LEADFORM_SingleSelectOptionGroupComponent {\n      __typename\n      componentId\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n    }\n  }\n  disclaimers {\n    copy\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  lenders {\n    imageURL\n    displayName\n    formattedPhoneNumber\n    formattedNMLSLicense\n    __typename\n  }\n  prequalifier {\n    cta {\n      displayTitle\n      displayMessage\n      callToActionLabel\n      __typename\n    }\n    confirmation {\n      displayTitle\n      displayMessage\n      affirmationLabel\n      cancellationLabel\n      ... on LEADFORM_SubsidizedIncomePrequalifierConfirmation {\n        subsidizedIncomeOptions {\n          formattedIncome\n          totalResidents\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  advertisementDisclaimer\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ScheduleTourLeadFormFragment on LEADFORM_TourScheduleLayout {\n  __typename\n  formComponents {\n    componentId\n    displayLabel\n    ... on LEADFORM_ScheduleSelectComponent {\n      isTimeSelectable\n      tourTypeOptions {\n        tourType\n        options {\n          header\n          footer\n          content\n          timeOptions {\n            label\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      options {\n        header\n        footer\n        content\n        timeOptions {\n          label\n          value\n          __typename\n        }\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_SingleSelectButtonGroupComponent {\n      displayLabel\n      defaultValue\n      options {\n        value\n        displayLabel\n        disclaimerInformation {\n          text\n          __typename\n        }\n        __typename\n      }\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n      optional\n      __typename\n    }\n    __typename\n  }\n  displayHeader\n  tracking {\n    pixelURL\n    transactionID\n    isSponsoredAuctionFeed\n    __typename\n  }\n  virtualTours {\n    title\n    description\n    __typename\n  }\n  ... on LEADFORM_TourScheduleLayout {\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  disclaimers {\n    copy\n    tourType\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tourType\n  submitType\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ScheduleTourFragment on HOME_Details {\n  __typename\n  ... on HOME_Property {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    scheduleATourLeadForm(abTests: $leadFormAbTests) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormFragment on HOME_Details {\n  ...ScheduleTourFragment\n  leadForm(abTests: $leadFormAbTests) {\n    __typename\n    ... on LEADFORM_ButtonLayout {\n      description\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_PartnerLayout {\n      description\n      imageURL\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_DisabledLayout {\n      reason\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ...LeadFormContactFragment\n    tracking {\n      pixelURL\n      transactionID\n      isSponsoredAuctionFeed\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HomeDetailsListingProviderFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        providerHeader\n        providerTitle\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        mls {\n          logoUrl\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    provider {\n      agent {\n        name\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    activeListing {\n      provider {\n        coListingAgent {\n          summary(formatType: FULL_TEXT)\n          __typename\n        }\n        lastModified\n        providerHeader\n        providerTitle\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        listingAgent {\n          name\n          phone\n          imageUrl\n          isAssociatedWithBroker\n          __typename\n        }\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        listingSource {\n          attribution\n          logoUrl\n          __typename\n        }\n        owner {\n          name\n          phone\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    listingAgentContactable\n    __typename\n  }\n  ...ListingProviderByDisclaimerFragment\n  __typename\n}\n\nfragment ListingProviderByDisclaimerFragment on HOME_Details {\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsListingAgentFragment on HOME_Details {\n  displayFlags {\n    listingAgentContactable\n    __typename\n  }\n  __typename\n}\n\nfragment LatestConversationsDetailsContentFragment on CONVERSATIONS_Latest {\n  latestMessage {\n    markdown\n    __typename\n  }\n  iconUrl\n  messageLink {\n    textAttributes {\n      ... on HOME_RichTextAttributeHyperlink {\n        url\n        __typename\n      }\n      __typename\n    }\n    markdown\n    __typename\n  }\n  tracking {\n    key\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSurroundingPhotosFragment on HOME_Details {\n  media {\n    surroundingPhotos @include(if: $includeSurroundingPhotos) {\n      heading\n      photos(limit: 15) {\n        heading\n        distanceDescription\n        url {\n          thumbnail: custom(size: {width: 15, cropMode: fit})\n          extraSmallSrc: custom(size: {width: 375, cropMode: fit})\n          smallSrc: custom(size: {width: 570, cropMode: fit})\n          mediumSrc: custom(size: {width: 768, cropMode: fit})\n          largeSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        webpUrl: url(compression: webp) {\n          extraSmallWebpSrc: custom(size: {width: 375, cropMode: fit})\n          smallWebpSrc: custom(size: {width: 570, cropMode: fit})\n          mediumWebpSrc: custom(size: {width: 768, cropMode: fit})\n          largeWebpSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallWebpSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallWebpSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumWebpSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeWebpSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyOffMarketFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    offMarketHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleOffMarketSearchUrl: forSaleSearchUrl(searchUrlLocationType: CITY_ONLY)\n    nearbyLocationName\n    trackingModuleNames {\n      offMarketHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbySaleFragment on HOME_Details {\n  nearbyHomes(limit: 10) {\n    forSaleHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    nearbyLocationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyRentFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    forRentHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    nearbyLocationName\n    trackingModuleNames {\n      forRentHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyNewListingsFragment on HOME_Details {\n  nearbyHomesNewListings: nearbyHomes(limit: 15) {\n    forSaleNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    forRentNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentCommunities {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    forSaleNewListingTitle\n    nearbyLocationName\n    trackingModuleNames {\n      forRentCommunities\n      forRentNewListingHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSimilarHomesFragment on HOME_Details {\n  similarHomes {\n    homes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    moreHomesSearchUrl\n    searchType\n    locationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNeighborhoodOverviewFragment on HOME_Details {\n  surroundings {\n    ...NeighborhoodCardFragment\n    ... on SURROUNDINGS_Neighborhood {\n      neighborhoodAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment NeighborhoodCardFragment on SURROUNDINGS_Neighborhood {\n  name\n  ndpActive\n  ndpUrl\n  media(includeStoryMedia: false) {\n    heroImage {\n      ... on MEDIA_HeroImageMap {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill}, zoomLevel: 1100)\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImageStory {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImagePhoto {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  localFacts {\n    forSaleStats {\n      min\n      max\n      __typename\n    }\n    homesForSaleCount\n    forRentStats {\n      min\n      max\n      __typename\n    }\n    homesForRentCount\n    soldHomesStats {\n      min\n      max\n      __typename\n    }\n    soldHomesCount\n    __typename\n  }\n  neighborhoodSearchUrlCTA {\n    forSale\n    forRent\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMarketComparisonsFragment on HOME_Details {\n  ... on HOME_Property {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      disclaimer {\n        title\n        body\n        learnMoreCta {\n          target\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      __typename\n    }\n    __typename\n  }\n  surroundings {\n    ... on SURROUNDINGS_Neighborhood {\n      statsAndTrendsAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSchoolsFragment on HOME_Details {\n  assignedSchools {\n    schools {\n      ...SchoolFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolFragment on School {\n  id\n  name\n  districtName\n  categories\n  enrollmentType\n  reviews(limit: 1) {\n    rating\n    maxRating\n    reviewText\n    type\n    relativeDate\n    date\n    __typename\n  }\n  reviewCount\n  providerRating {\n    rating\n    maxRating\n    __typename\n  }\n  studentCount\n  gradesRange\n  streetAddress\n  cityName\n  stateCode\n  zipCode\n  providerUrl\n  url\n  latitude\n  longitude\n  averageParentRating {\n    rating\n    maxRating\n    __typename\n  }\n  __typename\n}\n\nfragment SurroundingLocalUGCFragment on SURROUNDINGS_LocalUGC {\n  title\n  stats {\n    attributes {\n      type\n      name\n      score\n      __typename\n    }\n    minimumResponseCount\n    __typename\n  }\n  localReviews {\n    categories {\n      id\n      displayName\n      reviewCount\n      callToAction\n      __typename\n    }\n    totalReviews\n    reviews(limitPerCategory: 8) {\n      id\n      reviewer {\n        name\n        __typename\n      }\n      text\n      context {\n        displayName\n        __typename\n      }\n      category {\n        id\n        displayName\n        __typename\n      }\n      dateCreated\n      reactionSummary {\n        counts {\n          helpful\n          __typename\n        }\n        viewerReactions {\n          helpful\n          __typename\n        }\n        __typename\n      }\n      flagSummary {\n        totalCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  reviewHighlights @include(if: $includeReviewHighlights) {\n    regionId\n    text\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsComparablesFragment on HOME_Details {\n  ... on HOME_Property {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      attribution\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoFragment on HOME_MortgageInfo {\n  ctaUrls {\n    purchaseRates\n    postLead\n    __typename\n  }\n  mortgageInquiryCta(useRefinancePreQualifyLink: true) {\n    text\n    url\n    __typename\n  }\n  rates {\n    defaultRates {\n      taxRate\n      interestRate\n      __typename\n    }\n    taxRate\n    interestRates(creditScore: EXCELLENT) {\n      loanDuration\n      rate\n      creditScore\n      displayName\n      loanType\n      __typename\n    }\n    __typename\n  }\n  defaults {\n    homePrice {\n      price\n      __typename\n    }\n    loanDuration\n    downPaymentPercentage\n    insurance {\n      price\n      __typename\n    }\n    __typename\n  }\n  mortgageEstimateDisclaimer\n  __typename\n}\n\nfragment HomeDetailsHoaFeeFragment on HOME_HoaFee {\n  period\n  amount {\n    price\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoAndHoaFeeFragment on HOME_Details {\n  ... on HOME_Property {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsRatingsAndReviewsFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    feedback {\n      breakdown {\n        category\n        averageRating\n        description\n        __typename\n      }\n      overallRating\n      bestPossibleRating\n      worstPossibleRating\n      feedbackFromIndividuals {\n        reviewerName\n        averageRating\n        formattedDate\n        reviews {\n          category\n          text\n          rating\n          formattedDateCreated\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Header on PRIMARY_NAVIGATION_NavigationItem {\n  label\n  uri\n  description\n  children {\n    label\n    uri\n    description\n    children {\n      label\n      uri\n      isNoFollow\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsBackToSearchFragment on HOME_Details {\n  backToSearch {\n    urlPath\n    locationText\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSaveHomeClientFragment on HOME_Details {\n  preferences {\n    isSaved\n    __typename\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsLastUpdatedAttributionFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
        //@ts-ignore
        /*   query: document.querySelector('[index="1"]').textContent */ // Using the query from your provided document
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching home details:', error);
        throw error;
    }
}
export class ScrapeTrulProperty extends PuppeteerScrapper<Property[]> {
    constructor(private proxy: Proxy, public url: string) {
        super([], {
            headless: false,
            args: [`--proxy-server=http://${proxy.proxy_address}:${proxy.port}`,
                '--no-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-blink-features=AutomationControlled',
                '--window-size=1500,1200',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ],
        })
    }
    private async fetchTruliaHomeDetails(homeUrl: string) {
        const endpoint = 'https://www.trulia.com/graphql?operation_name=WEB_homeDetailsClientTopThirdLookUp';

        const requestBody = {
            operationName: "WEB_homeDetailsClientTopThirdLookUp",
            variables: {
                enableBuilderCommunityScheduleATour: false,
                includeSurroundingPhotos: true,
                skipLeadForm: false,
                isOffMarket: false,
                displayTimeCheckedOnLoad: false,
                leadFormAbTests: [
                    "AB_DIRECT_CONNECT",
                    "AB_SCHEDULE_TOUR_CTA"
                ],
                includeReviewHighlights: false,
                heroImageFallbacks: [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                url: homeUrl,
                providerListingId: null,
                email: null,
                skipConversations: true
            },
            query: "query WEB_homeDetailsClientTopThirdLookUp($url: String!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $providerListingId: String, $email: String, $skipConversations: Boolean!, $enableBuilderCommunityScheduleATour: Boolean = false, $includeSurroundingPhotos: Boolean = false, $skipLeadForm: Boolean = false, $isOffMarket: Boolean = false, $displayTimeCheckedOnLoad: Boolean = true, $leadFormAbTests: [LEADFORM_AB_Tests] = [], $includeReviewHighlights: Boolean = false) {\n  homeDetailsByUrl(url: $url) {\n    url\n    homeUrl\n    ...LeadFormFragment @skip(if: $skipLeadForm)\n    ...HomeDetailsListingProviderFragment\n    ...HomeDetailsListingAgentFragment\n    ...HomeDetailsSurroundingPhotosFragment\n    ...HomeDetailsNearbyOffMarketFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyRentFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbySaleFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyNewListingsFragment @skip(if: $isOffMarket)\n    ...HomeDetailsSimilarHomesFragment @skip(if: $isOffMarket)\n    ...HomeDetailsNeighborhoodOverviewFragment\n    ...HomeDetailsMarketComparisonsFragment\n    ...HomeDetailsSchoolsFragment\n    ...HomeDetailsComparablesFragment\n    ...HomeDetailsMortgageInfoAndHoaFeeFragment\n    ...HomeDetailsRatingsAndReviewsFragment\n    ...HomeDetailsSaveHomeClientFragment\n    ...HiddenHomeClientFragment\n    ...HomeDetailsLastUpdatedAttributionFragment\n    primaryNavigation {\n      ...Header\n      __typename\n    }\n    ...HomeDetailsBackToSearchFragment\n    surroundings {\n      locationId\n      ... on SURROUNDINGS_Neighborhood {\n        ndpType\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      ... on SURROUNDINGS_City {\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  latestConversationsDetailsByProviderListingId(\n    providerListingId: $providerListingId\n    email: $email\n  ) @skip(if: $skipConversations) {\n    ...LatestConversationsDetailsContentFragment\n    __typename\n  }\n}\n\nfragment Agent on LEADFORM_Contact {\n  __typename\n  displayName\n  callPhoneNumber\n  textMessagePhoneNumber\n  ... on LEADFORM_AgentContact {\n    agentType\n    agentId\n    agentRating {\n      averageValue\n      maxValue\n      __typename\n    }\n    numberOfReviews\n    numberOfRecentSales\n    role\n    hasPAL\n    profileURL(pathOnly: false)\n    largeImageUrl\n    profileImageURL\n    broker {\n      name\n      phoneNumber\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormContactFragment on LEADFORM_ContactLayout {\n  callToActionDisplay(appendOneClick: true) {\n    callToActionDisplayLabel\n    supportsCancellableSubmission\n    callToActionType\n    __typename\n  }\n  contactList {\n    ... on LEADFORM_AgentContactList {\n      allowsSelection\n      footer {\n        markdown\n        __typename\n      }\n      __typename\n    }\n    __typename\n    contacts {\n      ...Agent\n      __typename\n    }\n    primaryContactPhoneNumber\n  }\n  additionalComponents {\n    componentId\n    displayLabel\n    __typename\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      isRequired\n      displayLabel\n      displayLabelSelected\n      displayLabelUnselected\n      tooltipText\n      __typename\n    }\n  }\n  formComponents {\n    __typename\n    componentId\n    displayLabel\n    ... on LEADFORM_LongTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_OptionGroupComponent {\n      options {\n        displayLabel\n        value\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      displayLabel\n      componentId\n      tooltipText\n      descriptionText\n      __typename\n    }\n    ... on LEADFORM_SingleSelectOptionGroupComponent {\n      __typename\n      componentId\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n    }\n  }\n  disclaimers {\n    copy\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  lenders {\n    imageURL\n    displayName\n    formattedPhoneNumber\n    formattedNMLSLicense\n    __typename\n  }\n  prequalifier {\n    cta {\n      displayTitle\n      displayMessage\n      callToActionLabel\n      __typename\n    }\n    confirmation {\n      displayTitle\n      displayMessage\n      affirmationLabel\n      cancellationLabel\n      ... on LEADFORM_SubsidizedIncomePrequalifierConfirmation {\n        subsidizedIncomeOptions {\n          formattedIncome\n          totalResidents\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  advertisementDisclaimer\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ScheduleTourLeadFormFragment on LEADFORM_TourScheduleLayout {\n  __typename\n  formComponents {\n    componentId\n    displayLabel\n    ... on LEADFORM_ScheduleSelectComponent {\n      isTimeSelectable\n      tourTypeOptions {\n        tourType\n        options {\n          header\n          footer\n          content\n          timeOptions {\n            label\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      options {\n        header\n        footer\n        content\n        timeOptions {\n          label\n          value\n          __typename\n        }\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_SingleSelectButtonGroupComponent {\n      displayLabel\n      defaultValue\n      options {\n        value\n        displayLabel\n        disclaimerInformation {\n          text\n          __typename\n        }\n        __typename\n      }\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n      optional\n      __typename\n    }\n    __typename\n  }\n  displayHeader\n  tracking {\n    pixelURL\n    transactionID\n    isSponsoredAuctionFeed\n    __typename\n  }\n  virtualTours {\n    title\n    description\n    __typename\n  }\n  ... on LEADFORM_TourScheduleLayout {\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  disclaimers {\n    copy\n    tourType\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tourType\n  submitType\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ScheduleTourFragment on HOME_Details {\n  __typename\n  ... on HOME_Property {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    scheduleATourLeadForm(abTests: $leadFormAbTests) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormFragment on HOME_Details {\n  ...ScheduleTourFragment\n  leadForm(abTests: $leadFormAbTests) {\n    __typename\n    ... on LEADFORM_ButtonLayout {\n      description\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_PartnerLayout {\n      description\n      imageURL\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_DisabledLayout {\n      reason\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ...LeadFormContactFragment\n    tracking {\n      pixelURL\n      transactionID\n      isSponsoredAuctionFeed\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HomeDetailsListingProviderFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        providerHeader\n        providerTitle\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        mls {\n          logoUrl\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    provider {\n      agent {\n        name\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    activeListing {\n      provider {\n        coListingAgent {\n          summary(formatType: FULL_TEXT)\n          __typename\n        }\n        lastModified\n        providerHeader\n        providerTitle\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        listingAgent {\n          name\n          phone\n          imageUrl\n          isAssociatedWithBroker\n          __typename\n        }\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        listingSource {\n          attribution\n          logoUrl\n          __typename\n        }\n        owner {\n          name\n          phone\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    listingAgentContactable\n    __typename\n  }\n  ...ListingProviderByDisclaimerFragment\n  __typename\n}\n\nfragment ListingProviderByDisclaimerFragment on HOME_Details {\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsListingAgentFragment on HOME_Details {\n  displayFlags {\n    listingAgentContactable\n    __typename\n  }\n  __typename\n}\n\nfragment LatestConversationsDetailsContentFragment on CONVERSATIONS_Latest {\n  latestMessage {\n    markdown\n    __typename\n  }\n  iconUrl\n  messageLink {\n    textAttributes {\n      ... on HOME_RichTextAttributeHyperlink {\n        url\n        __typename\n      }\n      __typename\n    }\n    markdown\n    __typename\n  }\n  tracking {\n    key\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSurroundingPhotosFragment on HOME_Details {\n  media {\n    surroundingPhotos @include(if: $includeSurroundingPhotos) {\n      heading\n      photos(limit: 15) {\n        heading\n        distanceDescription\n        url {\n          thumbnail: custom(size: {width: 15, cropMode: fit})\n          extraSmallSrc: custom(size: {width: 375, cropMode: fit})\n          smallSrc: custom(size: {width: 570, cropMode: fit})\n          mediumSrc: custom(size: {width: 768, cropMode: fit})\n          largeSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        webpUrl: url(compression: webp) {\n          extraSmallWebpSrc: custom(size: {width: 375, cropMode: fit})\n          smallWebpSrc: custom(size: {width: 570, cropMode: fit})\n          mediumWebpSrc: custom(size: {width: 768, cropMode: fit})\n          largeWebpSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallWebpSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallWebpSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumWebpSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeWebpSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyOffMarketFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    offMarketHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleOffMarketSearchUrl: forSaleSearchUrl(searchUrlLocationType: CITY_ONLY)\n    nearbyLocationName\n    trackingModuleNames {\n      offMarketHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbySaleFragment on HOME_Details {\n  nearbyHomes(limit: 10) {\n    forSaleHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    nearbyLocationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyRentFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    forRentHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    nearbyLocationName\n    trackingModuleNames {\n      forRentHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyNewListingsFragment on HOME_Details {\n  nearbyHomesNewListings: nearbyHomes(limit: 15) {\n    forSaleNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    forRentNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentCommunities {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    forSaleNewListingTitle\n    nearbyLocationName\n    trackingModuleNames {\n      forRentCommunities\n      forRentNewListingHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSimilarHomesFragment on HOME_Details {\n  similarHomes {\n    homes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    moreHomesSearchUrl\n    searchType\n    locationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNeighborhoodOverviewFragment on HOME_Details {\n  surroundings {\n    ...NeighborhoodCardFragment\n    ... on SURROUNDINGS_Neighborhood {\n      neighborhoodAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment NeighborhoodCardFragment on SURROUNDINGS_Neighborhood {\n  name\n  ndpActive\n  ndpUrl\n  media(includeStoryMedia: false) {\n    heroImage {\n      ... on MEDIA_HeroImageMap {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill}, zoomLevel: 1100)\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImageStory {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImagePhoto {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  localFacts {\n    forSaleStats {\n      min\n      max\n      __typename\n    }\n    homesForSaleCount\n    forRentStats {\n      min\n      max\n      __typename\n    }\n    homesForRentCount\n    soldHomesStats {\n      min\n      max\n      __typename\n    }\n    soldHomesCount\n    __typename\n  }\n  neighborhoodSearchUrlCTA {\n    forSale\n    forRent\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMarketComparisonsFragment on HOME_Details {\n  ... on HOME_Property {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      disclaimer {\n        title\n        body\n        learnMoreCta {\n          target\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      __typename\n    }\n    __typename\n  }\n  surroundings {\n    ... on SURROUNDINGS_Neighborhood {\n      statsAndTrendsAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSchoolsFragment on HOME_Details {\n  assignedSchools {\n    schools {\n      ...SchoolFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolFragment on School {\n  id\n  name\n  districtName\n  categories\n  enrollmentType\n  reviews(limit: 1) {\n    rating\n    maxRating\n    reviewText\n    type\n    relativeDate\n    date\n    __typename\n  }\n  reviewCount\n  providerRating {\n    rating\n    maxRating\n    __typename\n  }\n  studentCount\n  gradesRange\n  streetAddress\n  cityName\n  stateCode\n  zipCode\n  providerUrl\n  url\n  latitude\n  longitude\n  averageParentRating {\n    rating\n    maxRating\n    __typename\n  }\n  __typename\n}\n\nfragment SurroundingLocalUGCFragment on SURROUNDINGS_LocalUGC {\n  title\n  stats {\n    attributes {\n      type\n      name\n      score\n      __typename\n    }\n    minimumResponseCount\n    __typename\n  }\n  localReviews {\n    categories {\n      id\n      displayName\n      reviewCount\n      callToAction\n      __typename\n    }\n    totalReviews\n    reviews(limitPerCategory: 8) {\n      id\n      reviewer {\n        name\n        __typename\n      }\n      text\n      context {\n        displayName\n        __typename\n      }\n      category {\n        id\n        displayName\n        __typename\n      }\n      dateCreated\n      reactionSummary {\n        counts {\n          helpful\n          __typename\n        }\n        viewerReactions {\n          helpful\n          __typename\n        }\n        __typename\n      }\n      flagSummary {\n        totalCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  reviewHighlights @include(if: $includeReviewHighlights) {\n    regionId\n    text\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsComparablesFragment on HOME_Details {\n  ... on HOME_Property {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      attribution\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoFragment on HOME_MortgageInfo {\n  ctaUrls {\n    purchaseRates\n    postLead\n    __typename\n  }\n  mortgageInquiryCta(useRefinancePreQualifyLink: true) {\n    text\n    url\n    __typename\n  }\n  rates {\n    defaultRates {\n      taxRate\n      interestRate\n      __typename\n    }\n    taxRate\n    interestRates(creditScore: EXCELLENT) {\n      loanDuration\n      rate\n      creditScore\n      displayName\n      loanType\n      __typename\n    }\n    __typename\n  }\n  defaults {\n    homePrice {\n      price\n      __typename\n    }\n    loanDuration\n    downPaymentPercentage\n    insurance {\n      price\n      __typename\n    }\n    __typename\n  }\n  mortgageEstimateDisclaimer\n  __typename\n}\n\nfragment HomeDetailsHoaFeeFragment on HOME_HoaFee {\n  period\n  amount {\n    price\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoAndHoaFeeFragment on HOME_Details {\n  ... on HOME_Property {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsRatingsAndReviewsFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    feedback {\n      breakdown {\n        category\n        averageRating\n        description\n        __typename\n      }\n      overallRating\n      bestPossibleRating\n      worstPossibleRating\n      feedbackFromIndividuals {\n        reviewerName\n        averageRating\n        formattedDate\n        reviews {\n          category\n          text\n          rating\n          formattedDateCreated\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Header on PRIMARY_NAVIGATION_NavigationItem {\n  label\n  uri\n  description\n  children {\n    label\n    uri\n    description\n    children {\n      label\n      uri\n      isNoFollow\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsBackToSearchFragment on HOME_Details {\n  backToSearch {\n    urlPath\n    locationText\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSaveHomeClientFragment on HOME_Details {\n  preferences {\n    isSaved\n    __typename\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsLastUpdatedAttributionFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
            //@ts-ignore
            /*   query: document.querySelector('[index="1"]').textContent */ // Using the query from your provided document
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }
    }


    async $extract(): Promise<any> {

        await this.$page?.authenticate({
            username: this.proxy.username,
            password: this.proxy.password,
        });

        await this.$page!.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="133", "Chromium";v="133", "Not-A.Brand";v="24"',
        });
        await this.$page!.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36');

        await this.$page!.setViewport({ width: 1500, height: 1200 });
        // Spoof WebGL and Canvas fingerprints
        await this.$page!.evaluateOnNewDocument(() => {
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function (parameter) {
                if (parameter === 37445) return 'Intel Inc.';
                if (parameter === 37446) return 'Intel Iris OpenGL Engine';
                return getParameter(parameter);
            };

            const toBlob = HTMLCanvasElement.prototype.toBlob;
            HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext('2d');
                ctx!.drawImage(this, 0, 0);
                canvas.toBlob(callback, type, quality);
            };
        });
        //await this.$page?.goto('https://bot.sannysoft.com/', { timeout: 0, waitUntil: "networkidle2" });

        try {
            await this.$page!.goto(`https://www.trulia.com/${this.url}`, { timeout: 0, waitUntil: "networkidle2" });
            await this.$page?.waitForSelector('span[data-testid="home-details-summary-headline"]')
                .then(async () => {
                    let propertymetadata = await this.$page?.evaluate(() => {
                        try {
                            let address = (document.querySelector('span[data-testid="home-details-summary-headline"]') as HTMLElement).innerText;
                            let price = (document.querySelector('h2[data-testid="on-market-price-details"]') as HTMLElement).innerText;
                            let DaysOnMarket = (document.querySelector('#main-content > div.BasicPageLayout__BasicPageContent-sc-mfegza-1.WEUCP > div:nth-child(2) > div > div > div > div.Grid__GridContainer-sc-144isrp-1.ccjzpG.sc-d949c334-0.hVlGje > div:nth-child(6) > div > div > div > div.Grid__CellBox-sc-144isrp-0.hA-dmAz > div') as HTMLElement).innerText;
                            return {
                                address, price, DaysOnMarket, url: document.URL,
                            }
                        } catch (error) {
                            return null
                        }
                    });
                    console.log(propertymetadata);
                    if (propertymetadata !== null) {

                        let data = await this.fetchTruliaHomeDetails(this.url);
                        console.log(data);
                        let phonenumber = data.data.homeDetailsByUrl.activeListing.provider.owner.phone;
                        let name = data.data.homeDetailsByUrl.activeListing.provider.owner.name;
                        console.log(phonenumber, name)

                        this.payload.push({
                            Url: propertymetadata?.url ? propertymetadata?.url : "",
                            Property_Address: propertymetadata?.address ? propertymetadata?.address : "",
                            Price: propertymetadata?.price ? propertymetadata?.price : "",
                            Days_On_Market: propertymetadata?.DaysOnMarket ? propertymetadata?.DaysOnMarket : "",
                            OwnerName: name,
                            Phone_Number: phonenumber,
                            Source: "trullia",
                            Email: "",
                            /*     type: "sold", */
                        })
                    }
                })
                .catch(async (err) => {
                    console.log(err)
                    await this._browser?.close();
                    throw new PageBlocked()
                })



        } catch (error) {
            console.log(error)
        }

    }
}


export class ScrapeTrullyPropertyForRentUrlsForNewYork {
    constructor() {

    }
    public async GetNewYorkRentals() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";


        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery",
            "variables": {
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "searchDetails": {
                    "searchType": "FOR_RENT",
                    "location": {
                        "cities": [
                            {
                                "city": "New York",
                                "state": "NY"
                            }
                        ]
                    },
                    "filters": {
                        "sort": {
                            "type": "DATE",
                            "ascending": false
                        },
                        "page": 1,
                        "limit": 30,
                        "propertyTypes": [],
                        "keywords": [
                            "owner"
                        ],
                        "listingTypes": [],
                        "pets": [],
                        "rentalListingTags": [],
                        "isInverseSearch": false,
                        "foreclosureTypes": [],
                        "buildingAmenities": [],
                        "unitAmenities": [],
                        "landlordPays": [],
                        "includeOffMarket": false,
                        "propertyAmenityTypes": [],
                        "sceneryTypes": []
                    }
                },
                "includeOffMarket": false,
                "includeLocationPolygons": false,
                "includeNearBy": true,
                "enableCommingling": false
            },
            "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    }



    public async $exec(): Promise<Array<Property>> {
        try {
            const RentalHomes = await this.GetNewYorkRentals();
            let homes = RentalHomes.data.searchResultMap.homes;
            let homeUrls = homes.map((item: any) => {
                return {
                    Url: item.url,
                    Property_Address: item.location.fullLocation,
                    Price: item.price.formattedPrice,
                    Days_On_Market: item.activeListing.dateListed,
                    OwnerName: "",
                    Phone_Number: "",
                    Email: "",
                    Source: "trullia"
                }
            });
            return homeUrls

        } catch (err) {
            console.log(err)
            return [];
        }
    }

}


export class ScrapeTrullyPropertyForRentUrlsForBronx {
    constructor() { };
    protected async GetNewYorkRentals(): Promise<any> {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";
        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery",
            "variables": {
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "searchDetails": {
                    "searchType": "FOR_RENT",
                    "location": {
                        "cities": [
                            {
                                "city": "Bronx",
                                "state": "NY"
                            }
                        ]
                    },
                    "filters": {
                        "sort": {
                            "type": "RENTAL_PRIORITY_SCORE",
                            "ascending": false
                        },
                        "page": 1,
                        "limit": 30,
                        "propertyTypes": [],
                        "keywords": [
                            "owner"
                        ],
                        "listingTypes": [],
                        "pets": [],
                        "rentalListingTags": [],
                        "foreclosureTypes": [],
                        "buildingAmenities": [],
                        "unitAmenities": [],
                        "landlordPays": [],
                        "propertyAmenityTypes": [],
                        "sceneryTypes": [],
                        "includeOffMarket": false
                    }
                },
                "includeOffMarket": false,
                "includeLocationPolygons": true,
                "includeNearBy": true,
                "enableCommingling": false
            },
            "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    }

    public async $exec(): Promise<Array<Property>> {
        try {
            const RentalHomes = await this.GetNewYorkRentals();
            let homes = RentalHomes.data.searchResultMap.homes;
            let homeUrls = homes.map((item: any) => {
                return {
                    Url: item.url,
                    Property_Address: item.location.fullLocation,
                    Price: item.price.formattedPrice,
                    Days_On_Market: item.activeListing.dateListed,
                    OwnerName: "",
                    Phone_Number: "",
                    Email: "",
                    Source: "trullia"
                }
            });
            return homeUrls

        } catch (err) {
            console.log(err)
            return [];
        }
    }
}


export class ScrapeTrullyPropertyForRentUrlsForManhatan {
    constructor() { }
    protected async GetNewYorkRentals(): Promise<any> {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery"
        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery",
            "variables": {
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "searchDetails": {
                    "searchType": "FOR_RENT",
                    "location": {
                        "cities": [
                            {
                                "city": "Manhattan",
                                "state": "NY"
                            }
                        ]
                    },
                    "filters": {
                        "sort": {
                            "type": "DATE",
                            "ascending": false
                        },
                        "page": 1,
                        "limit": 30,
                        "propertyTypes": [],
                        "keywords": [
                            "owner"
                        ],
                        "listingTypes": [],
                        "pets": [],
                        "rentalListingTags": [],
                        "foreclosureTypes": [],
                        "buildingAmenities": [],
                        "unitAmenities": [],
                        "landlordPays": [],
                        "propertyAmenityTypes": [],
                        "sceneryTypes": [],
                        "includeOffMarket": false
                    }
                },
                "includeOffMarket": false,
                "includeLocationPolygons": true,
                "includeNearBy": true,
                "enableCommingling": false
            },
            "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }
    }
    public async $exec(): Promise<Array<Property>> {
        try {
            const RentalHomes = await this.GetNewYorkRentals();
            let homes = RentalHomes.data.searchResultMap.homes;
            let homeUrls = homes.map((item: any) => {
                return {
                    Url: item.url,
                    Property_Address: item.location.fullLocation,
                    Price: item.price.formattedPrice,
                    Days_On_Market: item.activeListing.dateListed,
                    OwnerName: "",
                    Phone_Number: "",
                    Email: "",
                    Source: "trullia"
                }
            });
            return homeUrls

        } catch (err) {
            console.log(err)
            return [];
        }
    }
}


export class ScrapeTrullyProperyForRentalsForBrooklyn {
    constructor() { }
    protected async GetNewYorkRentals(): Promise<any> {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";
        const requestBody = {
            "operationName": "WEB_searchResultsMapQuery",
            "variables": {
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "searchDetails": {
                    "searchType": "FOR_RENT",
                    "location": {
                        "cities": [
                            {
                                "city": "Brooklyn",
                                "state": "NY"
                            }
                        ]
                    },
                    "filters": {
                        "sort": {
                            "type": "DATE",
                            "ascending": false
                        },
                        "page": 1,
                        "limit": 30,
                        "propertyTypes": [],
                        "keywords": [
                            "owner"
                        ],
                        "listingTypes": [],
                        "pets": [],
                        "rentalListingTags": [],
                        "foreclosureTypes": [],
                        "buildingAmenities": [],
                        "unitAmenities": [],
                        "landlordPays": [],
                        "propertyAmenityTypes": [],
                        "sceneryTypes": [],
                        "includeOffMarket": false
                    }
                },
                "includeOffMarket": false,
                "includeLocationPolygons": true,
                "includeNearBy": true,
                "enableCommingling": false
            },
            "query": "query WEB_searchResultsMapQuery($searchDetails: SEARCHDETAILS_Input!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $includeOffMarket: Boolean!, $includeLocationPolygons: Boolean!, $includeNearBy: Boolean!, $enableCommingling: Boolean!) {\n  searchResultMap: searchHomesByDetails(\n    searchDetails: $searchDetails\n    includeNearBy: $includeNearBy\n    enableCommingling: $enableCommingling\n  ) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    ...SearchLocationBoundaryFragment @include(if: $includeLocationPolygons)\n    ...SchoolSearchMarkerLayerFragment\n    ...TransitLayerFragment\n    homes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    nearByHomes {\n      ...HiddenHomeClientFragment\n      __typename\n    }\n    __typename\n  }\n  offMarketHomes: searchOffMarketHomes(searchDetails: $searchDetails) @include(if: $includeOffMarket) {\n    ...HomeMarkerLayersContainerFragment\n    ...HoverCardLayerFragment\n    __typename\n  }\n}\n\nfragment HomeMarkerLayersContainerFragment on SEARCH_Result {\n  ...HomeMarkersLayerFragment\n  __typename\n}\n\nfragment HomeMarkersLayerFragment on SEARCH_Result {\n  homes {\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    url\n    metadata {\n      compositeId\n      __typename\n    }\n    ...HomeMarkerFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeMarkerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeMarkerFragment on HOME_Details {\n  media {\n    hasThreeDHome\n    __typename\n  }\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    __typename\n  }\n  price {\n    calloutMarkerPrice: formattedPrice(formatType: SHORT_ABBREVIATION)\n    __typename\n  }\n  url\n  ... on HOME_Property {\n    activeForSaleListing {\n      openHouses {\n        formattedDay\n        __typename\n      }\n      __typename\n    }\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    hideMapMarkerAtZoomLevel {\n      zoomLevel\n      hide\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HoverCardLayerFragment on SEARCH_Result {\n  homes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  nearByHomes {\n    ...HomeHoverCardFragment\n    __typename\n  }\n  __typename\n}\n\nfragment HomeHoverCardFragment on HOME_Details {\n  ...HomeDetailsCardFragment\n  ...HomeDetailsCardHeroFragment\n  ...HomeDetailsCardPhotosFragment\n  location {\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    enableMapPin\n    showMLSLogoOnMapMarkerCard\n    __typename\n  }\n  preferences {\n    isHomePreviouslyViewed\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardPhotosFragment on HOME_Details {\n  media {\n    __typename\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n    photos {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        medium\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment SearchLocationBoundaryFragment on SEARCH_Result {\n  location {\n    encodedPolygon\n    ... on SEARCH_ResultLocationCity {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationCounty {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationNeighborhood {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationPostalCode {\n      locationId\n      __typename\n    }\n    ... on SEARCH_ResultLocationState {\n      locationId\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolSearchMarkerLayerFragment on SEARCH_Result {\n  schools {\n    ...SchoolMarkersLayerFragment\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolMarkersLayerFragment on School {\n  id\n  latitude\n  longitude\n  categories\n  ...SchoolHoverCardFragment\n  __typename\n}\n\nfragment SchoolHoverCardFragment on School {\n  id\n  name\n  gradesRange\n  providerRating {\n    rating\n    __typename\n  }\n  streetAddress\n  studentCount\n  latitude\n  longitude\n  __typename\n}\n\nfragment TransitLayerFragment on SEARCH_Result {\n  transitStations {\n    stationName\n    iconUrl\n    coordinates {\n      latitude\n      longitude\n      __typename\n    }\n    radius\n    __typename\n  }\n  __typename\n}"
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }

    }
    public async $exec(): Promise<Array<Property>> {
        try {
            const RentalHomes = await this.GetNewYorkRentals();
            let homes = RentalHomes.data.searchResultMap.homes;
            let homeUrls = homes.map((item: any) => {
                return {
                    Url: item.url,
                    Property_Address: item.location.fullLocation,
                    Price: item.price.formattedPrice,
                    Days_On_Market: item.activeListing.dateListed,
                    OwnerName: "",
                    Phone_Number: "",
                    Email: "",
                    Source: "trullia"
                }
            });
            return homeUrls

        } catch (err) {
            console.log(err)
            return [];
        }
    }
}

export class ScraperTrullyrentedProperty {
    constructor(private url: string) {

    }



    async $extract() {
        const endpoint = "https://www.trulia.com/graphql?operation_name=WEB_searchResultsMapQuery";
        const requestBody = {
            "operationName": "WEB_homeDetailsClientTopThirdLookUp",
            "variables": {
                "enableBuilderCommunityScheduleATour": false,
                "includeSurroundingPhotos": true,
                "skipLeadForm": false,
                "isOffMarket": false,
                "displayTimeCheckedOnLoad": false,
                "leadFormAbTests": [
                    "AB_DIRECT_CONNECT",
                    "AB_SCHEDULE_TOUR_CTA"
                ],
                "includeReviewHighlights": false,
                "heroImageFallbacks": [
                    "STREET_VIEW",
                    "SATELLITE_VIEW"
                ],
                "url": this.url,
                "providerListingId": "4uprmhxu2hwmv",
                "email": null,
                "skipConversations": true
            },
            "query": "query WEB_homeDetailsClientTopThirdLookUp($url: String!, $heroImageFallbacks: [MEDIA_HeroImageFallbackTypes!], $providerListingId: String, $email: String, $skipConversations: Boolean!, $enableBuilderCommunityScheduleATour: Boolean = false, $includeSurroundingPhotos: Boolean = false, $skipLeadForm: Boolean = false, $isOffMarket: Boolean = false, $displayTimeCheckedOnLoad: Boolean = true, $leadFormAbTests: [LEADFORM_AB_Tests] = [], $includeReviewHighlights: Boolean = false) {\n  homeDetailsByUrl(url: $url) {\n    url\n    homeUrl\n    ...LeadFormFragment @skip(if: $skipLeadForm)\n    ...HomeDetailsListingProviderFragment\n    ...HomeDetailsListingAgentFragment\n    ...HomeDetailsSurroundingPhotosFragment\n    ...HomeDetailsNearbyOffMarketFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyRentFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbySaleFragment @include(if: $isOffMarket)\n    ...HomeDetailsNearbyNewListingsFragment @skip(if: $isOffMarket)\n    ...HomeDetailsSimilarHomesFragment @skip(if: $isOffMarket)\n    ...HomeDetailsNeighborhoodOverviewFragment\n    ...HomeDetailsMarketComparisonsFragment\n    ...HomeDetailsSchoolsFragment\n    ...HomeDetailsComparablesFragment\n    ...HomeDetailsMortgageInfoAndHoaFeeFragment\n    ...HomeDetailsRatingsAndReviewsFragment\n    ...HomeDetailsSaveHomeClientFragment\n    ...HiddenHomeClientFragment\n    ...HomeDetailsLastUpdatedAttributionFragment\n    primaryNavigation {\n      ...Header\n      __typename\n    }\n    ...HomeDetailsBackToSearchFragment\n    surroundings {\n      locationId\n      ... on SURROUNDINGS_Neighborhood {\n        ndpType\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      ... on SURROUNDINGS_City {\n        localUGC {\n          ...SurroundingLocalUGCFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  latestConversationsDetailsByProviderListingId(\n    providerListingId: $providerListingId\n    email: $email\n  ) @skip(if: $skipConversations) {\n    ...LatestConversationsDetailsContentFragment\n    __typename\n  }\n}\n\nfragment Agent on LEADFORM_Contact {\n  __typename\n  displayName\n  callPhoneNumber\n  textMessagePhoneNumber\n  ... on LEADFORM_AgentContact {\n    agentType\n    agentId\n    agentRating {\n      averageValue\n      maxValue\n      __typename\n    }\n    numberOfReviews\n    numberOfRecentSales\n    role\n    hasPAL\n    profileURL(pathOnly: false)\n    largeImageUrl\n    profileImageURL\n    broker {\n      name\n      phoneNumber\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormContactFragment on LEADFORM_ContactLayout {\n  callToActionDisplay(appendOneClick: true) {\n    callToActionDisplayLabel\n    supportsCancellableSubmission\n    callToActionType\n    __typename\n  }\n  contactList {\n    ... on LEADFORM_AgentContactList {\n      allowsSelection\n      footer {\n        markdown\n        __typename\n      }\n      __typename\n    }\n    __typename\n    contacts {\n      ...Agent\n      __typename\n    }\n    primaryContactPhoneNumber\n  }\n  additionalComponents {\n    componentId\n    displayLabel\n    __typename\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      isRequired\n      displayLabel\n      displayLabelSelected\n      displayLabelUnselected\n      tooltipText\n      __typename\n    }\n  }\n  formComponents {\n    __typename\n    componentId\n    displayLabel\n    ... on LEADFORM_LongTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_OptionGroupComponent {\n      options {\n        displayLabel\n        value\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_CheckboxComponent {\n      isChecked\n      displayLabel\n      componentId\n      tooltipText\n      descriptionText\n      __typename\n    }\n    ... on LEADFORM_SingleSelectOptionGroupComponent {\n      __typename\n      componentId\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n    }\n  }\n  disclaimers {\n    copy\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  lenders {\n    imageURL\n    displayName\n    formattedPhoneNumber\n    formattedNMLSLicense\n    __typename\n  }\n  prequalifier {\n    cta {\n      displayTitle\n      displayMessage\n      callToActionLabel\n      __typename\n    }\n    confirmation {\n      displayTitle\n      displayMessage\n      affirmationLabel\n      cancellationLabel\n      ... on LEADFORM_SubsidizedIncomePrequalifierConfirmation {\n        subsidizedIncomeOptions {\n          formattedIncome\n          totalResidents\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  advertisementDisclaimer\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ScheduleTourLeadFormFragment on LEADFORM_TourScheduleLayout {\n  __typename\n  formComponents {\n    componentId\n    displayLabel\n    ... on LEADFORM_ScheduleSelectComponent {\n      isTimeSelectable\n      tourTypeOptions {\n        tourType\n        options {\n          header\n          footer\n          content\n          timeOptions {\n            label\n            value\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      options {\n        header\n        footer\n        content\n        timeOptions {\n          label\n          value\n          __typename\n        }\n        __typename\n      }\n      optional\n      __typename\n    }\n    ... on LEADFORM_ShortTextInputComponent {\n      optional\n      defaultValue\n      validationRegex\n      validationErrorMessage\n      placeholder\n      __typename\n    }\n    ... on LEADFORM_SingleSelectButtonGroupComponent {\n      displayLabel\n      defaultValue\n      options {\n        value\n        displayLabel\n        disclaimerInformation {\n          text\n          __typename\n        }\n        __typename\n      }\n      disclaimerInformation {\n        displayLabel\n        detailsLabel\n        __typename\n      }\n      optional\n      __typename\n    }\n    __typename\n  }\n  displayHeader\n  tracking {\n    pixelURL\n    transactionID\n    isSponsoredAuctionFeed\n    __typename\n  }\n  virtualTours {\n    title\n    description\n    __typename\n  }\n  ... on LEADFORM_TourScheduleLayout {\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n  disclaimers {\n    copy\n    tourType\n    links {\n      target\n      ... on LEADFORM_DisclaimerLinkURL {\n        destinationURL\n        __typename\n      }\n      ... on LEADFORM_DisclaimerLinkTooltip {\n        body\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tourType\n  submitType\n  additionalScreens {\n    type\n    heading\n    subHeading\n    description\n    image {\n      svg\n      __typename\n    }\n    submitType\n    autoSubmitTimeout\n    formComponents {\n      displayLabel\n      componentId\n      ... on LEADFORM_RadioOptionComponent {\n        optional\n        options {\n          displayLabel\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    callToActionDisplay {\n      callToActionDisplayLabel\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ScheduleTourFragment on HOME_Details {\n  __typename\n  ... on HOME_Property {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    scheduleATourLeadForm(abTests: $leadFormAbTests) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    scheduleATourLeadForm(\n      enableBuilderCommunityScheduleATour: $enableBuilderCommunityScheduleATour\n      abTests: $leadFormAbTests\n    ) {\n      ...ScheduleTourLeadFormFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment LeadFormFragment on HOME_Details {\n  ...ScheduleTourFragment\n  leadForm(abTests: $leadFormAbTests) {\n    __typename\n    ... on LEADFORM_ButtonLayout {\n      description\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_PartnerLayout {\n      description\n      imageURL\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ... on LEADFORM_DisabledLayout {\n      reason\n      formComponents {\n        componentId\n        displayLabel\n        actionType\n        actionURL\n        __typename\n      }\n      __typename\n    }\n    ...LeadFormContactFragment\n    tracking {\n      pixelURL\n      transactionID\n      isSponsoredAuctionFeed\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment HomeDetailsListingProviderFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        providerHeader\n        providerTitle\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        mls {\n          logoUrl\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    provider {\n      agent {\n        name\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    activeListing {\n      provider {\n        coListingAgent {\n          summary(formatType: FULL_TEXT)\n          __typename\n        }\n        lastModified\n        providerHeader\n        providerTitle\n        disclaimer {\n          name\n          value\n          __typename\n        }\n        listingAgent {\n          name\n          phone\n          imageUrl\n          isAssociatedWithBroker\n          __typename\n        }\n        broker {\n          name\n          phone\n          email\n          logoUrl\n          url\n          __typename\n        }\n        listingSource {\n          attribution\n          logoUrl\n          __typename\n        }\n        owner {\n          name\n          phone\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    listingAgentContactable\n    __typename\n  }\n  ...ListingProviderByDisclaimerFragment\n  __typename\n}\n\nfragment ListingProviderByDisclaimerFragment on HOME_Details {\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          disclaimer {\n            markdown\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  displayFlags {\n    showDisclaimerBelowAttribution\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsListingAgentFragment on HOME_Details {\n  displayFlags {\n    listingAgentContactable\n    __typename\n  }\n  __typename\n}\n\nfragment LatestConversationsDetailsContentFragment on CONVERSATIONS_Latest {\n  latestMessage {\n    markdown\n    __typename\n  }\n  iconUrl\n  messageLink {\n    textAttributes {\n      ... on HOME_RichTextAttributeHyperlink {\n        url\n        __typename\n      }\n      __typename\n    }\n    markdown\n    __typename\n  }\n  tracking {\n    key\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSurroundingPhotosFragment on HOME_Details {\n  media {\n    surroundingPhotos @include(if: $includeSurroundingPhotos) {\n      heading\n      photos(limit: 15) {\n        heading\n        distanceDescription\n        url {\n          thumbnail: custom(size: {width: 15, cropMode: fit})\n          extraSmallSrc: custom(size: {width: 375, cropMode: fit})\n          smallSrc: custom(size: {width: 570, cropMode: fit})\n          mediumSrc: custom(size: {width: 768, cropMode: fit})\n          largeSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        webpUrl: url(compression: webp) {\n          extraSmallWebpSrc: custom(size: {width: 375, cropMode: fit})\n          smallWebpSrc: custom(size: {width: 570, cropMode: fit})\n          mediumWebpSrc: custom(size: {width: 768, cropMode: fit})\n          largeWebpSrc: custom(size: {width: 992, cropMode: fit})\n          hiDipExtraSmallWebpSrc: custom(size: {width: 750, cropMode: fit})\n          hiDpiSmallWebpSrc: custom(size: {width: 1140, cropMode: fit})\n          hiDpiMediumWebpSrc: custom(size: {width: 1536, cropMode: fit})\n          hiDpiLargeWebpSrc: custom(size: {width: 1984, cropMode: fit})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyOffMarketFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    offMarketHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleOffMarketSearchUrl: forSaleSearchUrl(searchUrlLocationType: CITY_ONLY)\n    nearbyLocationName\n    trackingModuleNames {\n      offMarketHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsCardFragment on HOME_Details {\n  __typename\n  location {\n    city\n    stateCode\n    zipCode\n    streetAddress\n    fullLocation: formattedLocation(formatType: STREET_CITY_STATE_ZIP)\n    partialLocation: formattedLocation(formatType: STREET_ONLY)\n    __typename\n  }\n  price {\n    formattedPrice\n    ... on HOME_ValuationPrice {\n      typeDescription(abbreviate: true)\n      __typename\n    }\n    __typename\n  }\n  url\n  homeUrl\n  tags(include: MINIMAL) {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  fullTags: tags {\n    level\n    formattedName\n    icon {\n      vectorImage {\n        svg\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  floorSpace {\n    formattedDimension\n    __typename\n  }\n  lotSize {\n    ... on HOME_SingleDimension {\n      formattedDimension(minDecimalDigits: 2, maxDecimalDigits: 2)\n      __typename\n    }\n    __typename\n  }\n  bedrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  bathrooms {\n    formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n    __typename\n  }\n  isSaveable\n  preferences {\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    legacyIdForSave\n    unifiedListingType\n    typedHomeId\n    __typename\n  }\n  typedHomeId\n  tracking {\n    key\n    value\n    __typename\n  }\n  displayFlags {\n    showMLSLogoOnListingCard\n    addAttributionProminenceOnListCard\n    __typename\n  }\n  ... on HOME_RoomForRent {\n    numberOfRoommates\n    availableDate: formattedAvailableDate(dateFormat: \"MMM D\")\n    providerListingId\n    __typename\n  }\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    location {\n      communityLocation: formattedLocation(formatType: STREET_COMMUNITY_NAME)\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_Property {\n    currentStatus {\n      isRecentlySold\n      isRecentlyRented\n      isActiveForRent\n      isActiveForSale\n      isOffMarket\n      isForeclosure\n      __typename\n    }\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    activeListing {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      dateListed\n      __typename\n    }\n    lastSold {\n      provider {\n        summary(formatType: SHORT)\n        extraShortSummary: summary(formatType: EXTRA_SHORT)\n        listingSource {\n          logoUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    providerListingId\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    priceChange {\n      priceChangeDirection\n      __typename\n    }\n    provider {\n      summary(formatType: SHORT)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment HomeDetailsCardHeroFragment on HOME_Details {\n  media {\n    heroImage(fallbacks: $heroImageFallbacks) {\n      url {\n        small\n        medium\n        __typename\n      }\n      webpUrl: url(compression: webp) {\n        small\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbySaleFragment on HOME_Details {\n  nearbyHomes(limit: 10) {\n    forSaleHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    nearbyLocationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyRentFragment on HOME_Property {\n  nearbyHomes(limit: 10) {\n    forRentHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    nearbyLocationName\n    trackingModuleNames {\n      forRentHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNearbyNewListingsFragment on HOME_Details {\n  nearbyHomesNewListings: nearbyHomes(limit: 15) {\n    forSaleNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forSaleSearchUrl\n    forRentNewListingHomes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentCommunities {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    forRentSearchUrl\n    forSaleNewListingTitle\n    nearbyLocationName\n    trackingModuleNames {\n      forRentCommunities\n      forRentNewListingHomes\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSimilarHomesFragment on HOME_Details {\n  similarHomes {\n    homes {\n      ...HomeDetailsCardFragment\n      ...HomeDetailsCardHeroFragment\n      __typename\n    }\n    moreHomesSearchUrl\n    searchType\n    locationName\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsNeighborhoodOverviewFragment on HOME_Details {\n  surroundings {\n    ...NeighborhoodCardFragment\n    ... on SURROUNDINGS_Neighborhood {\n      neighborhoodAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment NeighborhoodCardFragment on SURROUNDINGS_Neighborhood {\n  name\n  ndpActive\n  ndpUrl\n  media(includeStoryMedia: false) {\n    heroImage {\n      ... on MEDIA_HeroImageMap {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill}, zoomLevel: 1100)\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImageStory {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      ... on MEDIA_HeroImagePhoto {\n        url {\n          path: custom(size: {width: 136, height: 136, cropMode: fill})\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  localFacts {\n    forSaleStats {\n      min\n      max\n      __typename\n    }\n    homesForSaleCount\n    forRentStats {\n      min\n      max\n      __typename\n    }\n    homesForRentCount\n    soldHomesStats {\n      min\n      max\n      __typename\n    }\n    soldHomesCount\n    __typename\n  }\n  neighborhoodSearchUrlCTA {\n    forSale\n    forRent\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMarketComparisonsFragment on HOME_Details {\n  ... on HOME_Property {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      disclaimer {\n        title\n        body\n        learnMoreCta {\n          target\n          url\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    marketComparisons {\n      trends {\n        ... on MARKET_COMPARISONS_TrendsHomeValueSqftPrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        ... on MARKET_COMPARISONS_TrendsHomeValuePrice {\n          formattedComparedFromPrice\n          formattedComparedToPrice\n          percentageDifference\n          formattedPercentageDifference\n          __typename\n        }\n        __typename\n      }\n      summary\n      __typename\n    }\n    __typename\n  }\n  surroundings {\n    ... on SURROUNDINGS_Neighborhood {\n      statsAndTrendsAttribution\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSchoolsFragment on HOME_Details {\n  assignedSchools {\n    schools {\n      ...SchoolFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SchoolFragment on School {\n  id\n  name\n  districtName\n  categories\n  enrollmentType\n  reviews(limit: 1) {\n    rating\n    maxRating\n    reviewText\n    type\n    relativeDate\n    date\n    __typename\n  }\n  reviewCount\n  providerRating {\n    rating\n    maxRating\n    __typename\n  }\n  studentCount\n  gradesRange\n  streetAddress\n  cityName\n  stateCode\n  zipCode\n  providerUrl\n  url\n  latitude\n  longitude\n  averageParentRating {\n    rating\n    maxRating\n    __typename\n  }\n  __typename\n}\n\nfragment SurroundingLocalUGCFragment on SURROUNDINGS_LocalUGC {\n  title\n  stats {\n    attributes {\n      type\n      name\n      score\n      __typename\n    }\n    minimumResponseCount\n    __typename\n  }\n  localReviews {\n    categories {\n      id\n      displayName\n      reviewCount\n      callToAction\n      __typename\n    }\n    totalReviews\n    reviews(limitPerCategory: 8) {\n      id\n      reviewer {\n        name\n        __typename\n      }\n      text\n      context {\n        displayName\n        __typename\n      }\n      category {\n        id\n        displayName\n        __typename\n      }\n      dateCreated\n      reactionSummary {\n        counts {\n          helpful\n          __typename\n        }\n        viewerReactions {\n          helpful\n          __typename\n        }\n        __typename\n      }\n      flagSummary {\n        totalCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  reviewHighlights @include(if: $includeReviewHighlights) {\n    regionId\n    text\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsComparablesFragment on HOME_Details {\n  ... on HOME_Property {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      attribution\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    displayFlags {\n      enableMapPin\n      __typename\n    }\n    location {\n      coordinates {\n        latitude\n        longitude\n        __typename\n      }\n      __typename\n    }\n    comparables {\n      title\n      homes {\n        ... on HOME_Property {\n          lastSold {\n            formattedSoldDate(dateFormat: \"MM/DD/YY\")\n            soldPrice {\n              formattedPrice\n              __typename\n            }\n            __typename\n          }\n          propertyType {\n            formattedValue\n            __typename\n          }\n          __typename\n        }\n        url\n        bedrooms {\n          ... on HOME_FixedBedrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        bathrooms {\n          ... on HOME_FixedBathrooms {\n            value\n            __typename\n          }\n          formattedValue(formatType: TWO_LETTER_ABBREVIATION)\n          __typename\n        }\n        floorSpace {\n          formattedDimension(formatType: NO_SUFFIX)\n          __typename\n        }\n        location {\n          streetAddress\n          formattedLocation(formatType: STREET_CITY_STATE)\n          coordinates {\n            latitude\n            longitude\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoFragment on HOME_MortgageInfo {\n  ctaUrls {\n    purchaseRates\n    postLead\n    __typename\n  }\n  mortgageInquiryCta(useRefinancePreQualifyLink: true) {\n    text\n    url\n    __typename\n  }\n  rates {\n    defaultRates {\n      taxRate\n      interestRate\n      __typename\n    }\n    taxRate\n    interestRates(creditScore: EXCELLENT) {\n      loanDuration\n      rate\n      creditScore\n      displayName\n      loanType\n      __typename\n    }\n    __typename\n  }\n  defaults {\n    homePrice {\n      price\n      __typename\n    }\n    loanDuration\n    downPaymentPercentage\n    insurance {\n      price\n      __typename\n    }\n    __typename\n  }\n  mortgageEstimateDisclaimer\n  __typename\n}\n\nfragment HomeDetailsHoaFeeFragment on HOME_HoaFee {\n  period\n  amount {\n    price\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsMortgageInfoAndHoaFeeFragment on HOME_Details {\n  ... on HOME_Property {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_FloorPlan {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_BuilderCommunity {\n    hoaFee {\n      ...HomeDetailsHoaFeeFragment\n      __typename\n    }\n    mortgageInfo {\n      ...HomeDetailsMortgageInfoFragment\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsRatingsAndReviewsFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    feedback {\n      breakdown {\n        category\n        averageRating\n        description\n        __typename\n      }\n      overallRating\n      bestPossibleRating\n      worstPossibleRating\n      feedbackFromIndividuals {\n        reviewerName\n        averageRating\n        formattedDate\n        reviews {\n          category\n          text\n          rating\n          formattedDateCreated\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment Header on PRIMARY_NAVIGATION_NavigationItem {\n  label\n  uri\n  description\n  children {\n    label\n    uri\n    description\n    children {\n      label\n      uri\n      isNoFollow\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsBackToSearchFragment on HOME_Details {\n  backToSearch {\n    urlPath\n    locationText\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsSaveHomeClientFragment on HOME_Details {\n  preferences {\n    isSaved\n    __typename\n  }\n  __typename\n}\n\nfragment HiddenHomeClientFragment on HOME_Details {\n  isHideable\n  typedHomeId\n  preferences {\n    isHidden\n    isSaved\n    __typename\n  }\n  metadata {\n    compositeId\n    __typename\n  }\n  __typename\n}\n\nfragment HomeDetailsLastUpdatedAttributionFragment on HOME_Details {\n  ... on HOME_RentalCommunity {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  ... on HOME_Property {\n    activeListing {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    lastSold {\n      provider {\n        listingSource {\n          formattedTimeLastChecked @include(if: $displayTimeCheckedOnLoad)\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching home details:', error);
            throw error;
        }
    }


    public async $exec(): Promise<{ DisplayName: string | null; PhoneNumber: string | null } | null> {
        try {
            const HomeInfo = await this.$extract();
            const constacts = HomeInfo.data.homeDetailsByUrl.leadForm.contactList.contacts;
            if (constacts.length > 0) {
                console.log(constacts[0].displayName);
                console.log(constacts[0].callPhoneNumber);
                return {
                    DisplayName: constacts[0].displayName ? constacts[0].displayName : null,
                    PhoneNumber: constacts[0].callPhoneNumber ? constacts[0].callPhoneNumber : null
                }
            }

            return null
        } catch (error) {
            return null
        }
    }
}




