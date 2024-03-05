# kbmax-tools
A set of useful tools for kbmax (Epicor CPQ)

## How to install
This project is an extension for chrome, to add it you must install all the dependecies:

> npm install

Build the project:

> npm run build

Go in chrome, type in the adress bar:

> chrome://extensions/

Press "Load unpacked" and select the dist folder of the project.

To develop, insted of npm run build, it usefull to use the command

> npm run watch

## How to use
The extension MUST be used in a kbmax page, all the API calls are made from the active tab of the browser, so you don't have to insert your credentials in the extension.