As always with the dynamics system, there are two ways to to activate it.

You can embed it somewhere in the HTML dom and active the dynamic system on of its parent nodes (here: on the document body):

```html
	<ba-videoplayer ba-loop ba-poster="..." ba-source="...">
	</ba-videoplayer>
```

```javascript
	BetaJS.Dynamics.Dynamic.activate();
```

The other way is to define a parent dom node and embed it via JavaScript:

```html
	<div id='parent'></div>
```

```javascript
	var player = BetaJS.MediaComponents.VideoPlayer.Dynamics.Player({
		element: document.getElementById('parent'),
		attrs: {
			poster: "...",
			source: "..."
		}
	});
	player.activate();
```

The particular sizing of the player can be set by adding normal css classes or styles to the `ba-videoplayer` element.