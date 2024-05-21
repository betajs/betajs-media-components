# betajs-media-components 0.0.480
[![Code Climate](https://codeclimate.com/github/betajs/betajs-media-components/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-media-components)
[![NPM](https://img.shields.io/npm/v/betajs-media-components.svg?style=flat)](https://www.npmjs.com/package/betajs-media-components)
[![Gitter Chat](https://badges.gitter.im/betajs/betajs-media-components.svg)](https://gitter.im/betajs/betajs-media-components)

BetaJS-Media-Components is a JavaScript media UI components framework



## Getting Started


You can use the library in the browser and compile it as well.

#### Browser

```javascript
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="betajs/dist/betajs.min.js"></script>
	<script src="betajs-browser/dist/betajs-browser.min.js"></script>
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



## Basic Usage


```html

	<ba-videoplayer ba-poster="sample-cover.png" ba-source="sample-video.mp4" ba-theme="modern"></ba-videoplayer>
```

```js

    BetaJS.Dynamics.Dynamic.activate();
    
```



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [https://betajs.com](https://betajs.com) |
| Git        | [git://github.com/betajs/betajs-media-components.git](git://github.com/betajs/betajs-media-components.git) |
| Repository | [https://github.com/betajs/betajs-media-components](https://github.com/betajs/betajs-media-components) |
| Blog       | [https://blog.betajs.com](https://blog.betajs.com) | 
| Twitter    | [https://twitter.com/thebetajs](https://twitter.com/thebetajs) | 
| Gitter     | [https://gitter.im/betajs/betajs-media-components](https://gitter.im/betajs/betajs-media-components) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| Firefox | 4 - Latest |
| Chrome | 18 - Latest |
| Safari | 4 - Latest |
| Opera | 12 - Latest |
| Internet Explorer | 8 - Latest |
| Edge | 12 - Latest |
| iOS | 4.0 - Latest |
| Android | 2.3 - Latest |


## CDN
| Resource | URL |
| :----- | -------: |
| betajs-media-components.js | [http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components.js](http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components.js) |
| betajs-media-components.min.js | [http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components.min.js](http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components.min.js) |
| betajs-media-components-noscoped.js | [http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components-noscoped.js](http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components-noscoped.js) |
| betajs-media-components-noscoped.min.js | [http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components-noscoped.min.js](http://cdn.rawgit.com/betajs/betajs-media/master/dist/betajs-media-components-noscoped.min.js) |


## Unit Tests
| Resource | URL |
| :----- | -------: |
| Test Suite | [Run](http://rawgit.com/betajs/betajs-media-components/master/tests/tests.html) |


## Dependencies
| Name | URL |
| :----- | -------: |
| betajs | [Open](https://github.com/betajs/betajs) |
| betajs-browser | [Open](https://github.com/betajs/betajs-browser) |
| betajs-media | [Open](https://github.com/betajs/betajs-media) |
| betajs-dynamics | [Open](https://github.com/betajs/betajs-dynamics) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |
| betajs-shims | [Open](https://github.com/betajs/betajs-shims) |


## Main Contributors

- Ziggeo
- Oliver Friedmann
- Rashad Aliyev

## License

Apache-2.0


## Credits

This software may include modified and unmodified portions of:
- VAST Client, (c) Olivier Poitrey, MIT License, https://github.com/dailymotion/vast-client-js




## Sponsors

- Ziggeo
- Browserstack


