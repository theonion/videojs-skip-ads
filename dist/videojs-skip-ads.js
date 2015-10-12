(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var extend = function(obj) {
  var arg, i, k;
  for (i = 1; i < arguments.length; i++) {
    arg = arguments[i];
    for (k in arg) {
      if (arg.hasOwnProperty(k)) {
        obj[k] = arg[k];
      }
    }
  }
  return obj;
};

var SkipAds = function (player, options) {
  this.player = player;
  this.settings = extend(this.defaults(), options || {});
  this.init();
};

SkipAds.prototype.hasClass = function (el, className) {
  return el.className && !!el.className.match('(^|\\s)' + className + '($|\\s)');
};

SkipAds.prototype.removeClass = function (el, className) {
  el.className = el.className.replace(new RegExp('(^|\\s)' + className + '($|\\s)', 'g'), ' ');
};

SkipAds.prototype.addClass = function (el, className) {
  if (!this.hasClass(el, className)) {
    el.className += ' ' + className;
  }
};

SkipAds.prototype.defaults = function() {
  return {
    skip: true,
    delayInSeconds: 5
  };
};

SkipAds.prototype.init = function() {
  this.createButton();
  this.setupEventHandlers();
};

SkipAds.prototype.createButton = function() {
  var adsInfo = document.createElement('div');
  adsInfo.className = "videojs-ads-info";

  var timeLeftInfo = document.createElement('span');
  timeLeftInfo.innerHTML = "";
  adsInfo.appendChild(timeLeftInfo);

  if (this.settings.skip) {
    var skipButton = document.createElement('a');
    skipButton.innerHTML = 'Skip Ad';
    skipButton.onclick = this.skipButtonClicked.bind(this);
    adsInfo.appendChild(skipButton);
    this.skipButton = skipButton;
  }

  this.player.el().appendChild(adsInfo);
  this.adsInfo = adsInfo;
  this.timeLeftInfo = timeLeftInfo;
};

SkipAds.prototype.skipButtonClicked = function(event) {
  this.player.ads.endLinearAdMode();
};

SkipAds.prototype.timeUpdate = function(event) {
  var player = this.player;

  if (player.ads.state === 'ad-playback') {
    var elapsedTime =  player.currentTime();
    var duration = player.duration();
    var timeLeft = Math.round(duration - elapsedTime);

    if (timeLeft !== this.timeLeft) {
      this.timeLeft = timeLeft;
      this.timeLeftInfo.innerHTML = 'Your video will resume in ' + timeLeft + ' seconds';
    }

    if (this.settings.skip && (elapsedTime > this.settings.delayInSeconds)) {
      this.addClass(this.skipButton, 'enabled');
    }
  }
};

SkipAds.prototype.adStart = function(event) {
  this.addClass(this.adsInfo, 'enabled');
};

SkipAds.prototype.adEnd = function(event) {
  this.removeClass(this.adsInfo, 'enabled');
};

SkipAds.prototype.setupEventHandlers = function() {
  this.player.on('adstart', this.adStart.bind(this));
  this.player.on('adend', this.adEnd.bind(this));
  this.player.on('timeupdate', this.timeUpdate.bind(this));
};

module.exports = SkipAds;

},{}],2:[function(require,module,exports){
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

},{"./skip_ads":1}]},{},[2]);
