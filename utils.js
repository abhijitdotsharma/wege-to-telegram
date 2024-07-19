export const acceptCookiesOnLoad = async (page, selector) => {
  // Wait for the selector to appear
  await page.waitForSelector(selector);

  // Click on the accept button
  // await page.click('.cmpboxinner .cmpboxbtns .cmpwelcomebtnyes .cmpboxbtn');

  await page.waitForSelector('.cmpboxinner .cmpboxbtns #cmpwelcomebtnyes')

  await page.click('.cmpboxinner .cmpboxbtns #cmpwelcomebtnyes .cmpboxbtn');
  const timestamp = Date.now();
  const date = new Date(timestamp);
  console.log("clicked on accept cookies")
}


export const convertDateToTimestamp = (date) => {
  // Get hours, minutes, and seconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();

  // Return time as a string (HH:MM:SS format)
  const timeString = `${day}-${hours}-${minutes}-${seconds}`;
  console.log(timeString);

  return timeString;

}

export const getListOfListingsFromPage = async(currentPage) => {
  const listingsWithURL = await currentPage.evaluate(() => {

    //================================================================================
    //   page.evaluate runs in the browser context                                   |
    //   so this function needs to be defined inside the evaluate function to avoid  |
    //   ReferenceError: getDateFromAvailabilityDiv is not defined                   |
    //================================================================================
    function getDateFromAvailabilityDiv(element) {
      const textContent = element.querySelector("b:nth-child(1)").textContent.trim();
      const dateRegex = /\d{2}\.\d{2}\.\d{4}/;
      const dateMatched = textContent.match(dateRegex);

      if (dateMatched) {
        return dateMatched[0]; // Return the first match, which should be the date
      }
      return null;

    }

    function getRentAndSize(rentAndSizeDiv) {
      const rent = rentAndSizeDiv.querySelector("b:nth-child(1)").textContent.trim().split(" ")[0];// get only the rent number not the currency
      const size = rentAndSizeDiv.querySelector("b:nth-child(2)").textContent.trim();
      return { rent, size };
    }

    const listings = [];
    const listingCards = document.querySelectorAll(".wgg_card.offer_list_item");
    listingCards.forEach((listingElement) => {
      const listing = {};
      const printOnlyElement = listingElement.querySelector(".printonly");
      const detailansichtElement = printOnlyElement.querySelector(".detailansicht");
      const rentAndSizeDiv = printOnlyElement.querySelector("div:nth-child(3)");
      const availabilityDiv = printOnlyElement.querySelector("div:nth-child(5)");
      const availableFrom = getDateFromAvailabilityDiv(availabilityDiv);

      const { rent, size } = getRentAndSize(rentAndSizeDiv);

      listing.url = detailansichtElement.getAttribute("href");
      listing.rent = rent;
      listing.availableFrom = availableFrom;
      listing.size = size;

      listings.push(listing);
    });
    return listings;
  });
  return listingsWithURL
}

export const getFormattedListingData = (listings) => {
  let formattedMessage = "Here are the latest listings:\n\n";
  listings.forEach(listing => {
    const { url, rent, availableFrom, size } = listing;
    const baseUrl = "https://www.wg-gesucht.de"; 
    formattedMessage += `[${size} for €${rent}, available from ${availableFrom}](${baseUrl}${url})\n\n`;
  });
  return formattedMessage;

}