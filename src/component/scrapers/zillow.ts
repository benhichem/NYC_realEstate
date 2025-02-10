import PuppeteerScrapper from "../providers/browser";


export default class Zillow extends PuppeteerScrapper<any> {
    constructor() {
        super([], { protocolTimeout: 999999, headless: false })
    }

    protected async $extract(): Promise<void> {

    }
}