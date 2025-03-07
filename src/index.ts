import puppeteer from "puppeteer";
import Constants from "./component/config/constants";
import { ExportDocument } from "./component/google/google_sheet";
import logger from "./component/providers/logger";
import fs from "node:fs";
import { GetProxyList } from "./component/providers/proxies";
import StreetEasy, { ScrapeStreetEasyProperty } from "./component/scrapers/streeteasy";
/* import ScrapeNewData from "./component/scrapers"; */
import Trulia, { fetchTruliaHomeDetails, ScraperTrullyrentedProperty, ScrapeTrullyPropertyForRentUrlsForBronx, ScrapeTrullyPropertyForRentUrlsForManhatan, ScrapeTrullyPropertyForRentUrlsForNewYork, ScrapeTrullyProperyForRentalsForBrooklyn, ScrapeTrulProperty, TrulliaPropertyBrooklin, TrulliaPropertyManhatanListing, TrulliaPropertyNyListing, TrulliaSalePropertyBronxListings } from "./component/scrapers/trulia";
import { RetryScraping, RetryScrapingstreetEasy, RetryScrapingTrullyOfficial, sleep } from "./component/utils";

let proxyApi = "2h08hkevp14nx2gdq71vid8qaq38y4pev2evaxb4"
let proxyApi2 = "h09zfpcrvveldmsut2t5bovbk50wa0b81x1njdu1"
async function Main() {
    console.log(Constants.Table_Headers, Constants.SHEET_ID)
    try {
        let BuyHouses: Array<any> = []
        logger.info('Starting Scraping new Data ...');
        logger.info('Scraping Trullia Property Links ... ');
        const BronxListing = await new TrulliaSalePropertyBronxListings().exec();
        BuyHouses = [...BuyHouses, ...BronxListing];

        const NewYorkListing = await new TrulliaPropertyNyListing().exec();
        BuyHouses = [...BuyHouses, ...NewYorkListing];

        const Manhattan = await new TrulliaPropertyManhatanListing().exec();
        BuyHouses = [...BuyHouses, ...Manhattan];

        const Brooklin = await new TrulliaPropertyBrooklin().exec();
        BuyHouses = [...BuyHouses, ...Brooklin];

        fs.writeFileSync('see.json', JSON.stringify(BuyHouses))
        for (let index = 0; index < BuyHouses.length; index++) {
            const element = BuyHouses[index];
            try {
                if (element.Url) {
                    console.log("Scraping :: ", element.Url);
                    const homeDetails = await fetchTruliaHomeDetails(element.Url);
                    let phonenumber = homeDetails.data.homeDetailsByUrl.activeListing.provider.owner.phone;
                    let name = homeDetails.data.homeDetailsByUrl.activeListing.provider.owner.name;

                    if (phonenumber) {
                        element.Phone_Number = phonenumber;
                        element.OwnerName = name;
                        element.Type = "Buy"
                        console.log(element)
                        await ExportDocument([element], Constants.Table_Headers, Constants.SHEET_ID)

                    }
                }
            } catch (error) {
                console.log(error);
                console.log(element)
            }
        }

        logger.info('[+] Trullia Rented Links Collection Started ...');
        let RentalProperties: Array<any> = []

        let GetRentalPropertiesNewYork = await new ScrapeTrullyPropertyForRentUrlsForNewYork().$exec();
        RentalProperties = [...GetRentalPropertiesNewYork];

        let GetRentalPropertiesBronx = await new ScrapeTrullyPropertyForRentUrlsForBronx().$exec();
        RentalProperties = [...RentalProperties, ...GetRentalPropertiesBronx];

        let GetRentalPropertiesManhatan = await new ScrapeTrullyPropertyForRentUrlsForManhatan().$exec();
        RentalProperties = [...RentalProperties, ...GetRentalPropertiesManhatan];

        let GetRentalPropertiesBrooklyn = await new ScrapeTrullyProperyForRentalsForBrooklyn().$exec();
        RentalProperties = [...RentalProperties, ...GetRentalPropertiesBrooklyn]

        logger.info(`[+] Trullia Rented Property For New york Collected Recently  ${RentalProperties.length}`)

        logger.info('[+] Street Easy Starting to Collect Information ...');
        /* await new StreetEasy().exec(); */
    } catch (error) {
        throw error
    }
}





Main()