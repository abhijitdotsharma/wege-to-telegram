// package imports
import puppeteer from 'puppeteer';
import 'dotenv/config';
import fs from 'fs';

// project imports
import { 
  acceptCookiesOnLoad, 
  convertDateToTimestamp, 
  getListOfListingsFromPage 
} from './utils.js';
import { 
  sendMessageToTelegram 
} from './telegram.js';


async function main() {

  const timestamp = Date.now();
  const date = new Date(timestamp);

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(6000000);

  await page.goto(process.env.WEGE_URL);
  await page.setViewport({ width: 1080, height: 1024 });

  const cookiesAppear = await page.waitForSelector('#cmpbox');
  if (cookiesAppear) {
    await acceptCookiesOnLoad(page, "#cmpbox");
  }

  // wait for the selector to appear
  // once it appears,
  // click the search button
  // screenshot the page
  await page.waitForSelector('#homepage_quicksearch_form');

  const cityInputBoxSelector = "#formPortal .col-sm-12 .form-group .position-relative #autocompinp";
  await page.waitForSelector(cityInputBoxSelector);

  // todo move the city to come from a config file or env file
  await page.type(cityInputBoxSelector, 'Hamburg', { delay: 120 });
  const buttonSelector = '#search_button';
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
  await page.waitForNavigation();

  // new page
  await page.screenshot({ path: `./img/pupss-HamburgLsiting${convertDateToTimestamp(date)}.png` });

  await page.waitForSelector('#offer_filter_form');

  // todo move all the selectors to a config file or env file
  const maxRentInputSelector = "#rMax";
  await page.waitForSelector(maxRentInputSelector);
  await page.type(maxRentInputSelector, '500', { delay: 120 });

  const APARTMENT_CATEGORY_SELECTOR = "#categories";
  await page.waitForSelector(APARTMENT_CATEGORY_SELECTOR);
  await page.select(APARTMENT_CATEGORY_SELECTOR, "0", "1");

  await page.click(".filter_submit_button");
  await page.waitForNavigation();

  await page.screenshot({ path: `./img/pupss-HamburgWGAfterMaxRent${convertDateToTimestamp(date)}.png` });

  await page.waitForSelector(".wgg_card.offer_list_item");// wait till the listings appear to be sure the page is loaded
  const listings = await getListOfListingsFromPage(page);

  // todo if folder doesnt exist, create it
  fs.writeFileSync(`./data/listings-${convertDateToTimestamp(date)}.json`, JSON.stringify(listings, null, 2));


  await browser.close();

  // send a message through telegram bot
  sendMessageToTelegram(listings);
}

main();