The system supports multiple locales, fully independent of the selected theme.

The current locales is auto-detected by analysing the browser at hand, but can also be overwritten explicitly:

```javascript
	BetaJS.MediaComponents.Assets.strings.setLocale("de");
```

Whenever a particular string asset doesn't exist in the specified locale, the system automatically falls back to the default string in English.

You can also define your own locale:

```javascript
	BetaJS.MediaComponents.Assets.strings.register({
		"ba-videoplayer-playbutton.tooltip": "Klaki ludi video." 
	}, ["language:esperanto"]);
```