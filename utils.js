
export const acceptCookiesOnLoad = async (page, selector) => {
  // Wait for the selector to appear
  await page.waitForSelector(selector);

    // Click on the accept button
    // await page.click('.cmpboxinner .cmpboxbtns .cmpwelcomebtnyes .cmpboxbtn');

    await page.waitForSelector('.cmpboxinner .cmpboxbtns #cmpwelcomebtnyes')

    await page.click('.cmpboxinner .cmpboxbtns #cmpwelcomebtnyes .cmpboxbtn');
    const timestamp = Date.now();
    const date = new Date(timestamp);
    // take a screenshot
    await page.screenshot({path: `pupss-${convertDateToTimestamp(date)}.png`});
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