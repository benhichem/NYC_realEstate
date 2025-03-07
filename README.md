# 🏡 StreetEasy & Trulia Scraper  

A web scraper that extracts **owner-listed rental and sold property data** from **StreetEasy** and **Trulia**, bypassing anti-bot measures using **Puppeteer Stealth**, **proxy rotation**, and **2Captcha API**. The extracted data is then sent to a **Google Sheet** for further analysis.  

## 🚀 Why This Project?  
Many property listing websites, including **StreetEasy** and **Trulia**, are filled with broker-listed properties, making it difficult for buyers and renters to find direct owner listings. This scraper helps:  
- **Real estate investors** identify owner-listed deals.  
- **Renters & buyers** avoid broker fees by directly contacting property owners.  
- **Market analysts** gather data on property trends.  

## 🛡️ Anti-Bot Systems & Challenges  
Scraping real estate sites comes with strict anti-bot protections. We had to deal with:  
- **Cloudflare & Akamai Bot Protection** – Uses fingerprinting, headless detection, and challenge pages to verify human users.  
- **ReCaptcha & hCaptcha Challenges** – Displays captchas to block bots from accessing pages.  
- **Rate Limiting & IP Blocking** – Bans IP addresses that make too many requests in a short time.  
- **Browser Fingerprinting** – Detects headless browsers by checking WebRTC, canvas rendering, user-agent, and more.  

## 🔑 How We Bypassed These Challenges  
To successfully extract data while avoiding bans, we implemented the following techniques:  
- **Puppeteer Stealth Plugin** – Modifies Puppeteer to mimic real browser behavior, avoiding bot detection.  
- **Rotating Proxies** – Uses a pool of proxies to distribute requests and prevent IP bans.  
- **2Captcha API** – Automatically solves captchas using AI and human solvers.  
- **Randomized Browser Fingerprints** – Alters browser fingerprints (e.g., user-agent, viewport, WebGL rendering) to avoid detection.  

## 📦 Installation  
```sh  
git clone https://github.com/yourusername/streeteasy-trulia-scraper.git  
cd streeteasy-trulia-scraper  
npm install  
```
## 🔧 Configuration
1. Set up Google Sheets API and get your credentials (credentials.json).
2. Create a .env file and add your 2Captcha API key:
```
CAPTCHA_API_KEY=your_2captcha_api_key
```

3. Configure proxy settings in .env:
```
PROXY_API+your_proxyList_api_key
```
## ▶️ Usage
```sh
npm run start
```
##📊 Output Format
The extracted data is saved to Google Sheets with the following columns:

 * Property Title
 * Price
 * Location
 * Listing Type (Rented/Solld)
 * Owner Name
 * Contact Info
 * URL
 * Source
## 🛠️ Dependencies
 * Puppeteer – Headless browser for web scraping
 * puppeteer-extra – Enhanced Puppeteer with stealth capabilities
 * puppeteer-extra-plugin-stealth – Bypasses bot detection
 * 2Captcha API – Solves captchas automatically
 * Google Sheets API – Stores scraped data

