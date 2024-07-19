import express from 'express';

import main from './main.js';

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send("Puppeteer server is up and running");
});

app.get('/scrape', (req, res) => {
    main(res);
});


app.listen(PORT, () => {
    console.log(`Server is Listening on port ${PORT}`);
});