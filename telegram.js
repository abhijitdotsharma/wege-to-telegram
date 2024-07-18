// package imports
import fetch from 'node-fetch';

// project imports
import { getFormattedListingData } from './utils.js';

/**
 * 
 * @param {*} text - The message to send to the telegram group
 * 
 * Sends listing data to telegram group via a bot.
 * Usage example - sendMessageToTelegram('Hello, World!');
 */
async function sendMessageToTelegram(listings) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatID = process.env.TELEGRAM_GROUP_CHAT_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const listingData = getFormattedListingData(listings);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatID,
        text: listingData,
      }),
    });

    const data = await response.json();
    console.log('Message sent to Telegram:', data);
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}


export { sendMessageToTelegram };