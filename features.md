# **NYC Real Estate Scraper - Project Plan**

## **Phase 1: Research & Setup (1-2 Days)**

### 1. Analyze Website Structures
   - Inspect HTML & API responses for each site.  
   - Identify anti-bot measures (CAPTCHAs, rate limits).  

### 2. Tech Stack Decisions
   - **Scraping:** NodeJs (puppeteer puppeteer-extra) 
   - **Data Storage:** Google Sheets API for integration.  
   - **Automation:** Cron (Linux cron jobs or cloud-based scheduler).  

---

## **Phase 2: Build Scrapers (4-6 Days)**

### 1. Develop Individual Scrapers  
   - [ ] **Zillow** (Static/Dynamic Scraping based on site behavior).  
   - [ ] **Streeteasy** (Analyze API usage, scrape accordingly).  
   - [ ] **Trulia** (Adapt Zillow logic, as they are similar).  
   - [ ] **Brokersmust** (Determine scraping method).  

### 2. Handle Anti-Scraping Measures  
   - Use rotating proxies & user-agents.  
   - Implement request throttling & session management.  

### 3. Data Extraction & Cleaning  
   - Extract: **Property address, price, days on market, owner’s name, email, phone number, URL.** 

---

## **Phase 3: Google Sheets Integration (2 Days)**

### 1. Setup Google Sheets API  
   - [ ] Authenticate & establish a connection.  
   - [ ] Create a structured Google Sheets template.  

### 2. Push Data to Google Sheets  
   - [ ] Format and validate data before insertion.  
   - [ ] Ensure deduplication before writing.  

---

## **Phase 4: Automate with Cron (1 Day)**

### 1. Write a cron job to run scraper daily  
   - Store logs & send alerts for failures.  

---

## **Phase 5: Testing & Deployment (2-3 Days)**

### 1. Test Each Scraper Separately  
   - Verify data accuracy & completeness.  
   - Handle unexpected changes in website structure.  

### 2. Full Workflow Testing  
   - Ensure all scrapers run without conflicts.  
   - Validate data insertion into Google Sheets.  

### 3. Deploy on Server (Cloud or VPS)  
   - Set up monitoring for script failures.  

---