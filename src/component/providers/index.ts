/* import Zillow from "../scrapers/zillow"
import StreetEasy from "../scrapers/streeteasy"
import Trulia from "../scrapers/trulia"
import BrokersMust from "../scrapers/brokersmust"


async function Main() {
    try {
        // SCRAPE THE DATA 
        const newData = new ScrapeNewData([

            new StreetEasy(),
            new Trulia(),

        ]).executeScrapers()

    } catch (error) {
        console.log(error);
    }
} */