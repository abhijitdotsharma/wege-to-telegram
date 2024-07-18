# Wege Scrapper 

This is built to solve my own problem.

I don't want to log in to we-gesuct.de everyday and browse for apartments every time so I do what engineers do best and spend 30-40 hours to build an automation that saves me 30mins / day.

# How it works
- Goes to wg-gesuct.de
- Gets the list of listings from the first page ( listings from next pages already have 20-30 messages so it doesn't benefit me or you)
- Sends the listings to my personal telegram group which I can view instantly and think of what to do. 
> Why Telegram ? I generally open it the most out of my mobile apps and I feel if I have the information there I will be faster to act on it 

# Tech used
- Pupeeteer 
- Telegram bot api
- node fetch

# How to use
- Clone the repo
- Create a telegram bot and get the token
- Create a telegram group and add the bot to the group
- Get the group id by sending a message to the group and then going to `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` and getting the chat id
- Create a `.env` file and add the following
```
TELEGRAM_BOT_TOKEN=<YOUR TELEGRAM BOT TOKEN>
TELEGRAM_GROUP_ID=<YOUR TELEGRAM GROUP ID>
```
- Run `npm install`
- Run `npm start`



# Learnings
While I wanted to solve my own problem I learned a lot of things in the process 

- Web Scrapping : Its really interesting how you can get data from sites that you want for your own use and you dont have an api
- Pupeeter : First time using it and its really cool how you can automate browser actions using nodejs
- Telegram bot api : The docs and the community is really helpful and I was able to get it up and running in a few hours 
- Node fetch : I was using axios before but I wanted to try out node fetch and it was really easy to use and I will be using it in the future


# Future plans 
My Friends want to use this for thier own search so I want to 


- Make use of telegram ecosystem to make the messages more informative ( v0 only sends data as text with some links )
- Host the scrapper online so its not local ( and have a cron job that runs every 12 hours OR webhook that listens to the site and sends message to telegram group )
- Ensure the bot responds to commands
    - send - will send newest listing
    - details - will open the listing within the telegram group ( translated in english ) so one can read in depth.

- Have a file rotation that ensures no duplicate listings and better experience
- Enable logging so I can debugg it easily 
- far fetched idea is to try and save cookies of login (wg-gesuct.de) and send message to owner within telegram which makes a http request and the owner receives the message. 
