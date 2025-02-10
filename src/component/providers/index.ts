import Zillow from "../scrapers/zillow"
import StreetEasy from "../scrapers/streeteasy"
import Trulia from "../scrapers/trulia"
import BrokersMust from "../scrapers/brokersmust"
import ScrapeNewData from "../scrapers"

async function Main() {
    try {
        // SCRAPE THE DATA 
        const newData = new ScrapeNewData([
            new Zillow(),
            new StreetEasy(),
            new Trulia(),
            new BrokersMust()
        ]).executeScrapers()

        // SAVE THE DATA 

    } catch (error) {

    }
}