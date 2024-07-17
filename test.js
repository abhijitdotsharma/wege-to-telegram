import puppeteer from 'puppeteer';

import { acceptCookiesOnLoad, convertDateToTimestamp } from './utils.js';


// function convertDateToTimestamp(date) {
//   return date.getTime();
// }

// console.log("line 4")

(async () => {
  console.log("running")

  const timestamp = Date.now();
  const date = new Date(timestamp);
 
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.wg-gesucht.de/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Wait for the page to load
  const cookiesAppear = await page.waitForSelector('#cmpbox');

  
  if(cookiesAppear){
    await acceptCookiesOnLoad(page, "#cmpbox");
  }
 
  // #homepage_quicksearch_form 
  //   #formPortal
  //   #formCityAutocomplete
  
  // wait for the selector to appear
  // once it appears,
    // click the search button
    // screenshot the page

  await page.waitForSelector('#homepage_quicksearch_form');


  const cityInputBoxSelector = "#formPortal .col-sm-12 .form-group .position-relative #autocompinp";
  await page.waitForSelector(cityInputBoxSelector);
  console.log("cityInputBoxSelector", cityInputBoxSelector)
  await page.type(cityInputBoxSelector, 'Hamburg', {delay: 120}); 
  const buttonSelector = '#search_button';
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);
  await page.waitForNavigation();

  // new page
  await page.screenshot({path: `pupss-HamburgLsiting${convertDateToTimestamp(date)}.png`});

  await page.waitForSelector('#offer_filter_form');

  const maxRentInputSelector = "#rMax";
  await page.waitForSelector(maxRentInputSelector);
  await page.type(maxRentInputSelector, '500', {delay: 120});

  const APARTMENT_CATEGORY_SELECTOR = "#categories";
  await page.waitForSelector(APARTMENT_CATEGORY_SELECTOR);
  await page.select(APARTMENT_CATEGORY_SELECTOR, "0", "1");

  await page.click(".filter_submit_button");

  await page.waitForNavigation();

  await page.screenshot({path: `pupss-HamburgWGAfterMaxRent${convertDateToTimestamp(date)}.png`});


  //




  /*

  // once in the page, llok for history -> get history
  const history = await page.evaluate(() => {
    return document.querySelector("#Software").textContent;
  })


  // Type into search box
  await page.type('.devsite-search-field', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = '.devsite-result-item-link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);
   */

  

  await browser.close();
})();

