# EVO Payments NodeJS SDK
This library provides integration access to the EVO Api.

## Quick Start
Payments NodeJS SDK is a small library/sample of NodeJs code that you can use to quickly integrate with the Payments system and submit transactions, check their status and more.

### Before you Begin
Before using the Payments NodeJS SDK you need to be familiar with the contents of the API Specification for Merchant's document as it describes all fields and their meaning within a given payment transaction.

### Prepare your Project
Run `npm i` in the root folder to install project dependence. 
Run `npm run build` to compile the SDK to `dist` folder.

### Pack the project
Run `npm run prepublish` command to generate `ipg-turnkey-sdk-1.0.2.tgz` 

### Run demo website
Switch to the `webapp` folder, and run `npm install` command to install dependence.
Run `npm run dev` or `npm run watch` to start web server.
Visit [http://127.0.0.1:3000](http://127.0.0.1:3000)

#### Merchant Info for demo site
Default merchant info is defined in `webapp/src/routes/index.js`, it can be modified in the file or just input it in the form.

#### Environment
The SDK demo is preset to the development environment. This will need to be changed to 'production' to point to PROD endpoints.

