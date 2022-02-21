# aspirePH
## About
A COVID risk-estimator web application. ASPIRE stands for Activity Safety Planning and Infection Risk Estimator. It aims to estimate the possible risks one can have on their planned activities during the global pandemic. It is heavily based on Jimenez and Peng’s estimator and the Goldberg et al.'s MyCOVIDRisk App.

## How to Deploy
These are the instructions on how to deploy locally or on Heroku. For Heroku, environment variables can be set up in their settings by clicking a button with `Reveal Config Vars` as the text.
### Env
Create a `.env` file inside the root folder of this repository. Here is a sample `.env` file content:
```env
# By default if not specified, port is 8000
PORT=8080

# This runs console.log() on user data and server computation
LOG_SERVER_COMPUTATION="true"

# By default CONNECT_TO_ATLAS is false,
# this allows you to connect to Atlas DB with Mongo DB
# once you provide the necessary values
CONNECT_TO_ATLAS="true"
ATLAS_USERNAME="<username>"
ATLAS_PASSWORD="<password>"
ATLAS_CLUSTER_URL="<url>"
ATLAS_DB_NAME="<db-name>"
```
### Locally
Make sure that [Node.js](https://nodejs.org/) is installed in your system. From your terminal, open this repository and run, `npm install` to install all dependencies. Then run `npm start`.

### Heroku
Login first with `heroku login`. Add the git remote of the app via `heroku git:remote -a <app-name>`, and then push with `git push heroku main`.

## How it Works
Okay so when I got the codebase, they have already done something, now the code could totally look much more beautiful if I use [React](https://reactjs.org/). But I didn't simply because it will take too long. Instead I did a pretty much hacky solution, a.k.a. my own custom single-page-application structure and code. It works as expected. So what actually happens? 

### Views
We have `index.pug` this is the actual page that anyone will actually visit. Moving around pages is thanks to jQuery ajax and my own custom endpoint which gives the title of the page, html content, and path for its scripts if there is any.  That content is inside the `content` folder of the `views` directory.

### CSS
For the css, all of it is already loaded beforehand in `index.pug`. Just make sure there are no conflicting styles in every stylesheet. Also to compile Tailwind CSS properly, use `npm run tailwind.` Before that you have to run `npm run render-views` to generate the entire HTML pages which tailwind needs to figure out what classes to include.

### JS
There is a single JS file that should be customized and is basically on every page, that is `index.js` here you could define global functions. Now for the page-specific scripts, they're named after their actual name inside the `content` directory of `views` but ends in `.js` instead of `.pug`

### Database
For the database, it is MongoDB and you just have to specify on the environment variables the required values for it to work properly. The database just logs every result.

## Scripts
### Building Tailwind
These commands must be ran in order:
- `npm run render-views` - Generates html files inside `./rendered-views/`
- `npm run tailwind` - Generates `tailwind.css` inside `./static/libraries/css/` (requires html files from `./rendered-views/`)
- `npm run postcss` - Generates `tailwind-prefixed.css` inside `./static/libraries/css/` (requires `./static/libraries/css/tailwind.css`)

### Running Server
- `npm start` - Starts the server
