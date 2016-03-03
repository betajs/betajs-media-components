# betajs-media-components 0.0.16
[![Code Climate](https://codeclimate.com/github/betajs/betajs-media-components/badges/gpa.svg)](https://codeclimate.com/github/betajs/betajs-media-components)


BetaJS-Media-Components is a JavaScript media UI components framework



## Getting Started


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



## Basic Usage


```html

	<ba-videoplayer ba-poster="sample-cover.png" ba-source="sample-video.mp4" ba-theme="modern"></ba-videoplayer>
```

```js

	// For fallback
    BetaJS.Flash.options = {
        flashFile: "betajs-flash.swf"
    };
    
    BetaJS.Dynamics.Dynamic.activate();
    
```



## Links
| Resource   | URL |
| :--------- | --: |
| Homepage   | [http://betajs.com](http://betajs.com) |
| Git        | [git://github.com/betajs/betajs-media-components.git](git://github.com/betajs/betajs-media-components.git) |
| Repository | [http://github.com/betajs/betajs-media-components](http://github.com/betajs/betajs-media-components) |
| Blog       | [http://blog.betajs.com](http://blog.betajs.com) | 
| Twitter    | [http://twitter.com/thebetajs](http://twitter.com/thebetajs) | 



## Compatability
| Target | Versions |
| :----- | -------: |
| Firefox | 4 - Latest |
| Chrome | 15 - Latest |
| Safari | 4 - Latest |
| Opera | 12 - Latest |
| Internet Explorer | 8 - Latest |
| Edge | 12 - Latest |
| iOS | 7.0 - Latest |
| Android | 4.0 - Latest |


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
| betajs-flash | [Open](https://github.com/betajs/betajs-flash) |
| betajs-media | [Open](https://github.com/betajs/betajs-media) |
| betajs-dynamics | [Open](https://github.com/betajs/betajs-dynamics) |


## Weak Dependencies
| Name | URL |
| :----- | -------: |
| betajs-scoped | [Open](https://github.com/betajs/betajs-scoped) |


## Contributors

- Ziggeo
- Oliver Friedmann


## License

Apache-2.0


