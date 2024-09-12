// package imports
import puppeteer from 'puppeteer';
import 'dotenv/config';


// project imports
import { 
  acceptCookiesOnLoad, 
  convertDateToTimestamp, 
  getListOfListingsFromPage 
} from './utils.js';
import { 
  sendMessageToTelegram 
} from './telegram.js';
import {
  CITY_NAME
} from './config.js';

import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to check for an existing file that starts with "listings-"
export function findExistingFile() {
  const directoryPath = __dirname; // Directory where files are stored
  const files = fs.readdirSync(directoryPath);
  console.log("files: ", files);
  const listingsFile = files.find(file => file.startsWith('listings'));
  return listingsFile ? path.join(directoryPath, listingsFile) : null;
}

// Function to handle the file logic
function handleFile(scrapedListings) {
  const existingFilePath = findExistingFile();

  if (existingFilePath) {
    // File exists, read its content
    console.log('File exists, reading its content...');
    fs.readFile(existingFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      console.log('file exists, File content:', data);
    });

  } else {
    // File does not exist, create it with a new timestamp
    console.log('File does not exist, creating it...');
    const filename = `listings-${new Date().toISOString()}.json`;
    const filepath = path.join(__dirname, filename);
    fs.writeFile(filepath, JSON.stringify(scrapedListings), (err) => {
      if (err) throw err;
      console.log('File created successfully.');
    });
  }
}





async function main(res) { 
  const timestamp = Date.now();
  const date = new Date(timestamp);

  console.log("running main()", date);

  const isProductionENV = process.env.NODE_ENV === 'production';

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--single-process',
      '--no-zygote',
    ],
    headless: true,
    executablePath: 
    isProductionENV 
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  let listings = [];



  try {

 
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(6000000);

  await page.goto(process.env.WEGE_URL);
  await page.setViewport({ width: 1080, height: 1024 });

  const cookiesAppear = await page.waitForSelector('#cmpbox');
  if (cookiesAppear) {
    await acceptCookiesOnLoad(page, "#cmpbox");
    console.log("accepted cookies");
  }

  // wait for the selector to appear
  // once it appears,
  // click the search button
  // screenshot the page
  await page.waitForSelector('#homepage_quicksearch_form');
  console.log("loaded homepage_quicksearch_form");
  const cityInputBoxSelector = "#formPortal .col-sm-12 .form-group .position-relative #autocompinp";
  await page.waitForSelector(cityInputBoxSelector);

  // todo move the city to come from a config file or env file
  await page.type(cityInputBoxSelector, CITY_NAME, { delay: 120 });
  const buttonSelector = '#search_button';
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
  await page.waitForNavigation();
  console.log("navigated to the search page");

  // new page
  if(!isProductionENV){
    await page.screenshot({ path: `./img/pupss-${CITY_NAME}Listing${convertDateToTimestamp(date)}.png` });
  }
  
  await page.waitForSelector('#filterBox');// wait till the listings appear to be sure the page is loaded

  await page.waitForSelector('#offer_filter_form');

  // todo move all the selectors to a config file or env file
  const maxRentInputSelector = "#rMax";
  await page.waitForSelector(maxRentInputSelector);
  await page.type(maxRentInputSelector, '500', { delay: 120 });

  const APARTMENT_CATEGORY_SELECTOR = "#categories";
  await page.waitForSelector(APARTMENT_CATEGORY_SELECTOR);
  await page.select(APARTMENT_CATEGORY_SELECTOR, "0", "1");

  await page.waitForSelector(".filter_submit_button");
  console.log("loaded filter_submit_button");
  await page.click(".filter_submit_button");
  await page.waitForNavigation();

  if(!isProductionENV){
    await page.screenshot({ path: `./img/pupss-${CITY_NAME}WGAfterMaxRent${convertDateToTimestamp(date)}.png` });
  }
  
  await page.waitForSelector(".wgg_card.offer_list_item");// wait till the listings appear to be sure the page is loaded
  listings = await getListOfListingsFromPage(page);

  // if file exists, overwrite it
  // if file doesnt exist, create it
  handleFile(listings);


  
  } catch (error) {    
    console.log("error", error);
    // sendMessageToTelegram("error in scraping", error);
  } finally {
    await browser.close();   
    const timestamp = Date.now();
    const date = new Date(timestamp);
    console.log("browser closed at - ", date);
  }

  // sendMessageToTelegram("listings");
  
}



export default main;