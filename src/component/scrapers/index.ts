import PuppeteerScrapper from "../providers/browser";

export default class ScrapeNewData {
    private payload: Array<unknown>
    constructor(private scrapers: Array<PuppeteerScrapper<unknown>>) {
        this.payload = []
    }

    async executeScrapers() {
        for (let index = 0; index < this.scrapers.length; index++) {
            const element = this.scrapers[index];
            try {
                const payload = await element.exec();
                this.payload.push(payload)
            } catch (error) {
                // TODO: Will need to implement some kind of fail system to get notified if it fails.
            }

        }
    }
}