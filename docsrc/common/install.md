You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-browser/dist/betajs-browser.min.js"></script>
	<script src="betajs-flash/dist/betajs-flash.min.js"></script>
	<script src="betajs-media/dist/betajs-media.min.js"></script>
	<script src="betajs-dynamics/dist/betajs-dynamics.min.js"></script>
	<script src="betajs-media-components/dist/betajs-media-components.min.js"></script>
``` 

#### Compile

```javascript
	git clone https://github.com/betajs/betajs-media-components.git
	npm install
	grunt
```

#### Fontello

The icons in this library depend on Fontello. In order to update the icons / add icons:

1. Go to [Fontello](https://fontello.com).
2. Drag and Drop `./vendors/fontello/config.json` into the website.
3. Make your selections.
4. Download the new webfont.
5. Overwrite `fontello` folder in `vendors` with downloaded font.
6. Run `grunt`