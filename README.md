# aspirePH
## About
A COVID risk-estimator web application. ASPIRE stands for Activity Safety Planning and Infection Risk Estimator. It aims to estimate the possible risks one can have on their planned activities during the global pandemic. It is heavily based on Jimenez and Peng’s estimator and the Goldberg et al.'s MyCOVIDRisk App.

## How to Deploy
## Env
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

## Heroku
Login first with `heroku login`. Add the git remote of the app via `heroku git:remote -a <app-name>`, and then push with `git push heroku main`.
