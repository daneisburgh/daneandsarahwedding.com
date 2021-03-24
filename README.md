# Dane and Sarah's wedding website

This web application was built for our guests to easily access wedding info, RSVP, and set certain
preferences.
The site was originally available at our domain, daneandsarahwedding.com, but is no longer active.
The static content can be found on my personal website [here](https://daneisburgh.com/assets/websites/daneandsarahwedding.com/index.html).
The application uses the [Serverless](https://www.serverless.com/) framework to host the Angular frontend 
and Node.js backend in AWS with a PostgreSQL database in RDS.
Please review the [run.sh](run.sh) script for helpful commands, including dependency installation, database 
initialization, local development, linting, testing, and stage/production deployment.

## Configuration
The project has four configuration files for setting environment variables used in local development
as well as the stage/production environments.  The files include *default.conf* for variables used
in every environment as well as *dev/stage/prod.conf* files for variables specific to the local development,
stage, and production environments respectively.

## Dependencies
1) [Node.js](https://nodejs.org/en/)
2) Global Node module [concurrently](https://www.npmjs.com/package/concurrently): `npm install -g concurrently`
3) Frontend and backend Node modules: `./run.sh install-dependencies`

## Development
1) Retrieve *default.conf* and *dev.conf* configuration files and place in **keys** directory
2) Start local development: `./run.sh start-dev`

## Deployment
1) Retrieve *default.conf* as well as *stage.conf* and/or *prod.conf* configuration files and place in **keys** directory
2) Deploy to given environment: `./run.sh deploy ENV` where `ENV` is **stage** or **prod**
