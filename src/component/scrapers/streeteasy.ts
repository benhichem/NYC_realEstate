import { Page } from "puppeteer";
import PuppeteerScrapper from "../providers/browser";
import logger from "../providers/logger";
import { Payload, Property } from "../../types";

import fs from "node:fs";
import { GetProxyList, Proxy } from "../providers/proxies";
import { PageBlocked } from "../errors/customError";
import { RetryScrapingstreetEasy, sleep } from "../utils";
import { ExportDocument } from "../google/google_sheet";
import Constants from "../config/constants";


export default class StreetEasy extends PuppeteerScrapper<Array<string>> {
    private urls = [


        "https://streeteasy.com/for-rent/manhattan/by_owner:1?sort_by=listed_desc",
        "https://streeteasy.com/for-rent/manhattan/by_owner:1?sort_by=listed_desc&page=2",
        "https://streeteasy.com/for-rent/manhattan/by_owner:1?sort_by=listed_desc&page=3",
        /*"https://streeteasy.com/for-rent/manhattan/by_owner:1?sort_by=listed_desc&page=4",
        "https://streeteasy.com/for-rent/manhattan/by_owner:1?sort_by=listed_desc&page=5",
        "https://streeteasy.com/for-sale/nyc/area:100,200,300,400%7Cdescription:for%20sale%20by%20owner?sort_by=listed_desc",
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=2",
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=3",
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=4",*/
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=5",
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=6",
        "https://streeteasy.com/for-rent/nyc/by_owner:1?sort_by=listed_desc&page=7"
    ]

    constructor() {
        super([],
            {
                protocolTimeout: 999999,
                headless: false,
                userDataDir: "profile"
            }
        )
    }



    protected async $extract(): Promise<void> {
        try {
            for (let index = 0; index < this.urls.length; index++) {
                const url = this.urls[index];
                await this.$page!.goto(url, { timeout: 0, waitUntil: "networkidle2" });
                await this.$page?.waitForSelector('div[data-testid="listing-card"]')
                    .then(async () => {
                        const Articles = await this.$page?.$$('div[data-testid="listing-card"]');
                        if (Articles?.length === 0 || Articles === undefined) return;
                        for (let index = 5; index < Articles.length; index++) {
                            const element = Articles[index];
                            await element.click();
                            await sleep(5000);
                            const pages = await this._browser?.pages();
                            if (pages === undefined) continue
                            // Log details of each page
                            const LastPage = pages[pages.length - 1];
                            await LastPage.waitForNetworkIdle();
                            let isOwnerPresent = await LastPage.evaluate(async () => {
                                function sleep(ms: number): Promise<void> {
                                    return new Promise(resolve => setTimeout(resolve, ms));
                                }
                                try {

                                    let PhoneNumbers: Array<string> = []
                                    let phoneNumber = document.querySelector("#cta");
                                    if (phoneNumber) {

                                        let isPhoneNumberPresent = document.querySelector('div[aria-live="polite"] > button');
                                        if (isPhoneNumberPresent !== null) {
                                            (isPhoneNumberPresent as HTMLButtonElement).click();
                                            await sleep(5000);
                                            let phoneNum = (document.querySelector('#cta')!.querySelector('div[aria-live="polite"]') as HTMLElement).innerText
                                            PhoneNumbers.push(phoneNum);
                                        }

                                        let Type = "Rent";

                                        let address = (document.querySelector('h1[data-testid="address"]') as HTMLElement).innerText;
                                        let Price = (document.querySelector('h4') as HTMLElement).innerText;


                                        let Days_On_Market: string = "";

                                        let Days_On_MarketElement = document.querySelector('#site-content > div > main > div > div.grid_base_y6Dl0 > div.HomeDetailsApp_leftColumnContainer__Zph_w > section.ListingSpecSection_ListingSpecSectionContainer__RDOkX > div > div:nth-child(2) > p.Body_base_gyzqw.RentalListingSpec_bodyWrapper__K_R5w');

                                        if (Days_On_MarketElement) {
                                            Days_On_Market = (Days_On_MarketElement as HTMLElement).innerText;
                                        } else {
                                            Days_On_Market = (document.querySelector('#site-content > div > main > div > div.grid_base_y6Dl0 > div.HomeDetailsApp_leftColumnContainer__Zph_w > section.ListingSpecSection_ListingSpecSectionContainer__RDOkX > div > div:nth-child(1) > div > div > p') as HTMLElement).innerText;
                                            Type = "Buy";
                                        }

                                        return {
                                            Url: document.URL,
                                            Property_Address: address ? address : "",
                                            Price: Price ? Price : "",
                                            Days_On_Market: Days_On_Market !== "" ? Days_On_Market : "",
                                            Email: "",
                                            Phone_Number: PhoneNumbers.length > 0 ? PhoneNumbers[0].toString().toLowerCase().split('+1 ')[1] : "",
                                            OwnerName: "",
                                            Type: Type,
                                            Source: "street easy"
                                        };

                                    } else {
                                        return null
                                    }
                                } catch (error) {
                                    console.log(error)
                                    await sleep(50000)
                                    return null
                                }
                            })
                            console.log(isOwnerPresent)
                            if (isOwnerPresent) {
                                //@ts-ignore
                                await ExportDocument([isOwnerPresent], Constants.Table_Headers, Constants.SHEET_ID)
                            }
                            await LastPage.close();
                            await sleep(5000);
                        }
                    })
                    .catch(async () => {
                        await this._browser?.close();
                        throw new PageBlocked()
                    })
            }

            return
        } catch (error) {
            throw error;
        }
    }
}

new StreetEasy().exec()



export class ScrapeStreetEasyProperty extends PuppeteerScrapper<Property[]> {
    constructor(private url: string, private proxy: Proxy) {
        super([], {
            headless: false,
            protocolTimeout: 999999,
            /*         userDataDir: "profile", */
            args: [
                /*    '--no-sandbox', */
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

        await this.$page?.authenticate({
            username: this.proxy.username,
            password: this.proxy.password
        });
        await this.$page!.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="133", "Chromium";v="133", "Not-A.Brand";v="24"',
        });
        await this.$page!.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36');
        await this.$page!.setViewport({ width: 1500, height: 1200 });
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

        await this.$page?.goto('https://streeteasy.com/', { timeout: 0, waitUntil: "networkidle2" });
        await this.$page?.waitForSelector('h1').catch(async () => {
            await this._browser?.close();
            throw new PageBlocked();
        });
        const New_Page = await this._browser?.newPage();
        New_Page?.setViewport({
            height: 900,
            width: 16000
        })
        await New_Page!.goto(this.url, { timeout: 0, waitUntil: "networkidle2" });

        await New_Page?.waitForSelector('h1[data-testid="address"]')
            .then(async () => {
                let results = await New_Page!.evaluate(async () => {
                    const address = document.querySelector('h1[data-testid="address"]') ? (document.querySelector('h1[data-testid="address"]') as HTMLElement).innerText : null;

                    const priceInfo = document.querySelector('div[data-testid="priceInfo"] > h4') ? (document.querySelector('div[data-testid="priceInfo"] > h4') as HTMLElement).innerText : null;

                    const DaysOnMarket = document.querySelector('div[data-testid="rentalListingSpec-daysOnMarket"] > p:nth-child(2)') ? (document.querySelector('div[data-testid="rentalListingSpec-daysOnMarket"] > p:nth-child(2)') as HTMLElement).innerText : null;

                    let phoneNumber = document.querySelector("#cta")
                    let PhoneNumbers: Array<string> = []

                    return {
                        url: document.URL,
                        address,
                        priceInfo,
                        DaysOnMarket,
                        PhoneNumbers,
                        ownersName: "",
                        ownersEmail: "",
                    }
                })

                let doc = {
                    Url: New_Page?.url() ? New_Page?.url() : "",
                    Property_Address: results.address ? results.address : "N/A",
                    Price: results.priceInfo ? results.priceInfo : "N/A",
                    Days_On_Market: results.DaysOnMarket ? results.DaysOnMarket : "N/A",
                    OwnerName: results.ownersName ? results.ownersName : "N/A",
                    Email: "",
                    Phone_Number: results.PhoneNumbers[0] ? results.PhoneNumbers[0] : "N/A",
                    Source: "street easy",
                    Type: "Buy"
                }

                //@ts-ignore
                await ExportDocument([doc], Constants.Table_Headers, Constants.SHEET_ID)
                //this.payload = ;
                return
            })
            .catch(async () => {
                let Title = await New_Page?.title();
                console.log(Title);
                await this._browser?.close();
                throw new PageBlocked();
            })


    }
}

