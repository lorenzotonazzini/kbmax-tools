# kbmax-tools
A set of useful tools for KBMax (Epicor CPQ)
**Tested on Chrome only**

## List of tools

#### Upload tables from excel
#### Table references
#### Update the table description
#### Configurator references
#### Scene references
#### Safe function references
#### Find breakpoints
#### Find write-logs
#### Delete stuck quote
#### Un-submit stuck quote
#### Delete logs in a quote
#### Stopwatch

## How to build
This project is an extension for Chrome, to add it you must install all the dependencies:

> npm install

Build the project:

> npm run build

To develop, instead of npm run build, it useful to use the command

> npm run watch

## How to install
Go into chrome, and type in the address bar:

> chrome://extensions/

Press "Load unpacked" and select the dist folder of the project.

## How to use
The extension MUST be used in a kbmax page, all the API calls are made from the active tab of the browser, so you don't have to insert your credentials in the extension.