videojs-skip-ads
=====================

# Usage

```
var player = videojs('my-player-id', {});
player.skipAds({});
```
	
## Options

`delayInSeconds`: How many seconds after preroll starts before you want to allow skip.  Default is 5.

```
player.skipAds({ delayInSeconds: 10 }); // Example
```
	
`skip`: Disable ability to skip preroll but still display informational overlay.  Default is true, e.g. allow skipping

```
player.skipAds({ skip: false }); // Example
```

## Styling

Have left styling up to implementers.  The markup below can be positioned wherever within the player.  The `videojs-ads-info` div will have a class of `enabled` during ad playback.  The skip button will have a class of `enabled` whenever skipping is allowed.

```
<div class="videojs-ads-info enabled">
	<span>Your video will resume in 23 seconds</span>
	<a class="enabled">Skip Ad</a>
</div>
```

# Getting Started

```
npm install
bower install
```

# Dependencies

This relies on [videojs](https://github.com/videojs/video.js) and [videojs-contrib-ads](https://github.com/videojs/videojs-contrib-ads).

# Running Tests

```
npm test
```


Open `localhost:9876/debug.html` in a browser.  Note: known issue is getting tests to pass in CLI with PhantomJS.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request