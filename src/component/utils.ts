import { GetProxyList, Proxy } from "./providers/proxies";
import { ScrapeStreetEasyProperty } from "./scrapers/streeteasy";
import Trulia, { ScraperTrullyrentedProperty, ScrapeTrulProperty } from "./scrapers/trulia";

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function getRandomProxy(ProxyList: Array<Proxy>): Proxy {
    return ProxyList[Math.floor(Math.random() * ProxyList.length)];
}


export async function RetryScraping(scrapeFn: typeof ScrapeTrulProperty, apiKey: string, maxRetries: number = 3, url: string) {
    /*     let finished = false;
        let proxies = await GetProxyList(apiKey); */
    let currentTry = 0;
    let proxies: Proxy[] = await GetProxyList(apiKey);

    if (!proxies.length) {
        throw new Error('No proxies available');
    }
    while (currentTry < maxRetries) {
        const proxy = getRandomProxy(proxies);

        try {
            const scraper = new scrapeFn(proxy, url); // Add your target URL here
            const result = await scraper.exec();

            // If we get here, the scraping was successful
            return result;
        } catch (error) {
            currentTry++;
            console.error(`Attempt ${currentTry} failed:`, error);

            if (currentTry === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts`);
            }

            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, currentTry), 10000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

}


export async function RetryScrapingTrullyOfficial(scrapeFn: typeof Trulia, apiKey: string, maxRetries: number = 3, url: string) {
    /*     let finished = false;
        let proxies = await GetProxyList(apiKey); */
    let currentTry = 0;
    let proxies: Proxy[] = await GetProxyList(apiKey);

    if (!proxies.length) {
        throw new Error('No proxies available');
    }
    while (currentTry < maxRetries) {
        const proxy = getRandomProxy(proxies);

        try {
            const scraper = new scrapeFn(url, proxy); // Add your target URL here
            const result = await scraper.exec();

            // If we get here, the scraping was successful
            return result;
        } catch (error) {
            currentTry++;
            console.error(`Attempt ${currentTry} failed:`, error);

            if (currentTry === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts`);
            }

            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, currentTry), 10000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

}


export async function RetryScrapingstreetEasy(scrapeFn: typeof ScrapeStreetEasyProperty, apiKey: string, maxRetries: number = 3, url: string) {
    /*     let finished = false;
       let proxies = await GetProxyList(apiKey); */
    let currentTry = 0;
    let proxies: Proxy[] = await GetProxyList(apiKey);

    if (!proxies.length) {
        throw new Error('No proxies available');
    }
    while (currentTry < maxRetries) {
        const proxy = getRandomProxy(proxies);

        try {
            const scraper = new scrapeFn(url, proxy); // Add your target URL here
            const result = await scraper.exec();

            // If we get here, the scraping was successful
            return result;
        } catch (error) {
            currentTry++;
            console.error(`Attempt ${currentTry} failed:`, error);

            if (currentTry === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts`);
            }

            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, currentTry), 10000);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
}




/* RetryScraping(ScrapeTrulProperty, ) */