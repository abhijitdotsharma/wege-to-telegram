# Wege Scrapper 

This is built to solve my own problem.

I don't want to log in to [ we-gesuct.de](https://www.wg-gesucht.de/) everyday and browse for apartments every time so I do what engineers do best and spend 30-40 hours to build an automation that saves me 30mins / day.

# Architecture ( with bot )
![Untitled Diagram](https://github.com/user-attachments/assets/7c996bc0-6517-4fff-8e09-e46f1fbbd672)



# How it works

### Scrapper
- Has express server, that launches the scrapper file ( `main.js` )
- Scrapper goes to wg-gesuct.de
- Gets the list of listings from the first page ( listings from next pages already have 20-30 messages so it doesn't benefit me)
- Saves the listings to a json file, which is overwritten every 10 mins so I have the latest listings in memory.
> Why Telegram ? I generally open it the most out of my mobile apps and I feel if I have the information there I will be faster to act on it 
![image](https://github.com/user-attachments/assets/c976bdab-fe8d-4111-b1f4-96db20788382)



# Tech used
- Pupeeteer 
- Telegram API ( Bot )
- `express.js` ( so I can communicate with the scrapper **asynchronously** through my [telegram bot](https://github.com/abhijitdotsharma/wg-scrapper-bot/) )


# Branches
- `main` : The main branch which has the working code
- `dev` : The development branch where I will be adding new features and testing them before merging to main
- Other branches are feature branches which I will be creating and **merging to dev** `before merging to main`

# Learnings
While I wanted to solve my own problem I learned a lot of things in the process 

- Web Scrapping : Its really interesting how you can get data from sites that you want for your own use and you dont have an api
- Pupeeter : First time using it and its really cool how you can automate browser actions using nodejs
- Telegram bot api : The docs and the community is really helpful and I was able to get it up and running in a few hours 


# Future plans 
My Friends want to use this for thier own search so I want to

- I want to find a free vps so I can host it to the cloud ( right now I run it as a docker image in my PC, technically its free as I dont disconnect it from power or internet )
- Have a file rotation that ensures no duplicate listings and better experience
- Enable logging so I can debugg it easily 
- far fetched idea is to try and save cookies of login (wg-gesuct.de) and send message to owner within telegram which makes a http request and the owner receives the message.
- Support multiple users, and ensure my asychronous code is able to handle that
