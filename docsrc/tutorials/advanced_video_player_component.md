The advanced options allow you to configure the player even more precisely:
- forceflash: Always use Flash instead of HTML5
- noflash: Never use Flash
- autoplay: Immediately play the video back
- preload: Preload the video file immediately
- loop: Loop the video file
- nofullscreen: Disallow the fullscreen button
- stretch: Stretch the video to fill the surrounding container 

For example:
```html
	<ba-videoplayer ba-stretch ba-nofullscreen ba-loop ba-poster="..." ba-source="...">
	</ba-videoplayer>
```