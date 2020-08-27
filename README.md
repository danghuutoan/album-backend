# Album Backend

## Getting Started

### Installing Dependencies

#### Node 
Follow instructions to install the latest version of node for your platform in the [Node docs](https://nodejs.org/en/)
#### MongoDB

Follow instructions to install and run the latest version of mongodb for your platform in the [MongoDB docs](https://docs.mongodb.com/manual/installation/)


#### npm Dependencies

Once you have your node environment setup and running, install dependencies by navigating to the root directory and running:

```bash
npm install
```

This will install all of the required packages we selected within the `package.json` file.

## Running the server
Make sure that mongodb is up and running in your system

From within the project root directory, run the below command
```
node index.js
```

## Api documentation

https://documenter.getpostman.com/view/10417219/Szzkcctu?version=latest

url : http://localhost:8888

project url and database configuration can be modified in config files located at **config** directory

by default, the development enviroment will be applied

```json
{
    "name": "investax album - development",
    "dbUrl": "mongodb://localhost/investax_album",
    "host": "http://localhost:8888"
}
```

