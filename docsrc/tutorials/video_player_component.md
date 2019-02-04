Our video player is a dynamic component named `ba-videoplayer`.

Its main parameters are `poster` and `source`, specifying the `poster` image as well as the video `source` file.

Depending on the browser, device and video format at hand, the system will automatically determine whether HTML 5 video can used or whether to fall back to Flash.

If you want to use Flash, make sure to initialize the Flash bridging framework of BetaJS:

```javascript
	BetaJS.Flash.options = {
	    flashFile: "http://betajs.com/betajs-flash.swf" // location of your flash file
	};
```
