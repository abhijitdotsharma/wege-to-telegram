import express from 'express';

import main from './main.js';
import { sendMessageToTelegram } from './telegram.js';


import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("__dirname", __dirname);

// Function to check for an existing file that starts with "listings-"
export function findExistingFile() {
  const directoryPath = __dirname; // Directory where files are stored
  const files = fs.readdirSync(directoryPath);
  console.log("files: ", files);
  const listingsFile = files.find(file => file.startsWith('listings'));
  return listingsFile ? path.join(directoryPath, listingsFile) : null;
}

const app = express();

const FILENAME = findExistingFile();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send("Puppeteer server is up and running");
});

app.get('/get-listings', async (req, res) => {
    // send listings that are saved in the file to the client

    console.log("FILENAME: ", FILENAME);
    if(FILENAME === null){
        res.send("No file found which means its still not scraped");
    }

    if(FILENAME) {
        const data = fs.readFileSync(FILENAME, 'utf8');
        res.send(data);
    }
});


app.listen(PORT, () => {
    console.log(`Server is Listening on port ${PORT}`);
    
    // Run main.js every 10 minutes
    const delay = 10 * 60 * 1000;

    (function startScrapping() {
        try {
          console.log('Running main.js every 10 minutes');
          main();
        } catch (error) {
          console.error('Error running main.js:', error);
        }

        setTimeout(startScrapping, delay);
    })();
});
