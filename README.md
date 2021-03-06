# Album Backend

## Getting Started

### Installing Dependencies

#### Node 
Follow instructions to install the latest version of node for your platform in the [Node docs](https://nodejs.org/en/)
#### MongoDB
The app is shipped with a docker container for MongoDB, all the configuration is stored in **docker-compose.yml**
#### npm Dependencies

Once you have your node environment setup and running, install dependencies by navigating to the root directory and running:

```bash
npm install
```

This will install all of the required packages we selected within the `package.json` file.

## Running the server
From within the project root directory, run the below commands
using development env
```

```
start MongoDB docker
```
docker-compose up -d
```
start server
```
NODE_ENV=development DB_USER=root DB_PASSWORD=rootpassword npm start
```
production url https://investax-album-backend.herokuapp.com/

## Api documentation

https://documenter.getpostman.com/view/10417219/Szzkcctu?version=latest

## Project configs
there are some specific configurations like hostname and database configuration often needed to be modified. 

project url and database configuration can be modified in config files located at **config** directory

by default, the development enviroment will be applied

```json
{
    "name": "investax album - development",
    "dbUrl": "mongodb://localhost:27017",
    "dbName": "investax_album",
    "host": "http://localhost:8888"
}
```

changing deployed environment by exporting NODE_ENV environment variable with the value of **production** or **development**
## Error logging

all the errors will be recorded in file **logfile.log** using winston middleware

## Running tests
all the tests are located at **./tests** folder

run the below command for executing tests
```
NODE_ENV=test DB_USER=root DB_PASSWORD=rootpassword npm test
```
