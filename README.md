# Open in new tab
Open links in new tab for a list of specified domains

## Steps to build locally
* Install webpack (`npm install -g webpack`)
* Clone the repository (`git clone git@github.com:ramkumar-kr/open-in-new-tab.git`)
* Run npm install in the react-new-tab-firefox directory to install all dependencies (`npm install`)
* Run `webpack` to generate index.js for development

### Testing the extension
* For firefox, you can run `npm run firefox`
* For other browsers, there are 2 steps
  1. run `npm run watch`
  2. Follow the instructions of your browser to load the extension

* Note: For ubuntu, you can run the npm scripts
  * Chromium: `npm run chromium`
  * Opera: `npm run opera`

### Building for production
* Run `npm run production`
* Upload the zip file in the web-ext-artiacts directory to the addon/extension store (Firefox, Chrome, Opera)