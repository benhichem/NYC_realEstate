/* import { Browser as PuppeteerBrowser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"; */
import puppeteer from 'puppeteer-extra'
import { Page, Browser } from 'puppeteer'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import Logger from "./logger"


// Get the type of the options parameter for puppeteer.launch
type LaunchOptions = Parameters<typeof puppeteer.launch>[0]

export default class PuppeteerScrapper<T> {
    protected $page: Page | null
    protected _browser: Browser | null
    protected payload: T
    private browser_option: LaunchOptions

    constructor(payl: T, browser_options?: LaunchOptions, private Dev: boolean = true) {
        this.$page = null
        this._browser = null
        this.payload = payl
        this.browser_option = browser_options
            ? browser_options
            : {
                headless: false,
            }
    }

    protected async navigate(url: string): Promise<void> {
        if (this.$page !== null) {
            await this.$page
                .goto(url, { timeout: 0, waitUntil: 'networkidle2' })
                .then(() => {
                    Logger.info(`successfully navigated to ${url}`)
                })
                .catch((err) => {
                    Logger.error('Error happen while navigation ...')
                    throw err
                })
        }
    }
    private async _setup() {
        Logger.info('Initiating Browser ... ');
        puppeteer.use(StealthPlugin())
        this._browser = await puppeteer.launch(this.browser_option)

        this.$page = await this._browser.newPage()
        if (this.$page) {
            await this.$page.setViewport({
                height: 1200,
                width: 1500,
            })
        }
        Logger.info('Browser started successfully ...')
    }

    private async _cleanup() {
        Logger.info('Clean up process started ...')
        if (this.$page && this._browser) {
            await this.$page.close()
            this.$page = null
            await this._browser.close()
            this._browser = null
        }
    }

    protected async $exists(selector: string): Promise<boolean> {
        return await this.$page!.waitForSelector(selector, { timeout: 1000 })
            .then(() => {
                Logger.info('Selector Exists ...')
                return true
            })
            .catch((err) => {
                Logger.info('Selector does not exist ...')
                return false
            })
    }
    protected async $restart() {
        Logger.info('Restarting The puppeteer session ...')
        await this._cleanup()
        await this._setup()
    }
    protected async $extract() { }

    public async exec() {
        await this._setup()
        await this.$extract()
        if (this.Dev) await this._cleanup()
        return this.payload
    }
}