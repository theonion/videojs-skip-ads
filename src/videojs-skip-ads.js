var SkipAds = require('./skip_ads');

(function (vjs) {
  'use strict';

  var initSkipButton = function (options) {
    var player = this;

    if (player.ads === undefined) {
      console.error('This plugin requires videojs-contrib-ads');
      return null;
    }

    var skipAds = new SkipAds(player, options);
  };

  vjs.plugin('skipAds', initSkipButton);
}(window.videojs));
