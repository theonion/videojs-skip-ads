var SkipAds = require('./skip_ads');

describe('SkipAds', function() {
  var skipAds, player;

  beforeEach(function(done) {
    var video = document.createElement('video');
    video.id = 'video';
    video.className = 'video-js';
    document.body.appendChild(video);

    player = videojs('video');
    player.ready(function() {
      done();
    });
  });

  afterEach(function() {
    player.dispose();
  });

  describe('options', function() {
    describe('defaults', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, {});
      });

      it('allows preroll skip after 5 seconds', function() {
        expect(skipAds.settings.delayInSeconds).to.equal(5);
      });

      it('allows preroll skip by default', function() {
        expect(skipAds.settings.skip).to.be.true;
      });
    });

    describe('can override preroll skip', function() {
      it('allows preroll skip to be configured', function() {
        skipAds = new SkipAds(player, { delayInSeconds: 10 });
        expect(skipAds.settings.delayInSeconds).to.equal(10);
      });

      it('allows skippability to be configured', function() {
        skipAds = new SkipAds(player, { skip: false });
        expect(skipAds.settings.skip).to.be.false;
      });
    });
  });

  describe('new SkipAds', function() {
    it('calls #init on new', function() {
      stub(SkipAds.prototype, 'init');
      skipAds = new SkipAds(player, {});
      expect(SkipAds.prototype.init.called).to.be.true;
    });
  });

  describe('#init', function() {
    beforeEach(function() {
      stub(SkipAds.prototype, 'createButton');
      stub(SkipAds.prototype, 'setupEventHandlers');
      skipAds = new SkipAds(player, {});
    });

    it('calls createButton', function() {
      expect(SkipAds.prototype.createButton.called).to.be.true;
    });

    it('calls setupEventHandlers', function() {
      expect(SkipAds.prototype.setupEventHandlers.called).to.be.true;
    });
  });

  describe('#createButton', function() {
    beforeEach(function() {
      skipAds = new SkipAds(player, {});
    });

    it('appends a div at the bottom of the videojs div', function() {
      expect($('#video .videojs-ads-info').length).to.equal(1);
    });

    it('sets a reference to adsInfo on the object', function() {
      expect(skipAds.adsInfo).to.equal($('.videojs-ads-info')[0]);
    });

    it('sets a reference to skip button on the object', function() {
      expect(skipAds.skipButton).to.equal($('.videojs-ads-info a')[0]);
    });

    it('sets a reference to the time left span on the object', function() {
      expect(skipAds.timeLeftInfo).to.equal($('.videojs-ads-info span')[0]);
    });
  });

  describe('#skipButtonClicked', function() {
    beforeEach(function() {
      skipAds.player.vpApi = {
        skipAd: function(){}
      };

      stub(skipAds.player.vpApi, 'skipAd');
      skipAds.skipButtonClicked();
    });

    it('skips the ad', function() {
      expect(skipAds.player.vpApi.skipAd.called).to.be.true;
    });
  });

  describe('#timeUpdate', function() {
    describe('not ad state playback', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, {});
        skipAds.timeLeft = undefined;
        skipAds.player.ads = {
          state: null
        };
        skipAds.timeUpdate();
      });

      it('does not do anything', function() {
        expect(skipAds.timeLeft).to.be.undefined;
      });
    });

    describe('ad state playback', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, {});
        skipAds.timeLeft = undefined;
        skipAds.player.ads = {
          state: 'ad-playback'
        };
        stub(skipAds.player, 'currentTime', 5);
        stub(skipAds.player, 'duration', 30);
        skipAds.timeUpdate();
      });

      it('adds enabled class to info div', function() {
        expect($(skipAds.adsInfo).hasClass('enabled')).to.be.true;
      });

      it('sets timeLeft and updates the user info', function() {
        expect(skipAds.timeLeft).to.equal(25);
        expect(skipAds.timeLeftInfo.innerHTML).to.equal('Your video will resume in 25 seconds');
      });
    });

    describe('skip disabled, but past setting', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, { skip: false });
        skipAds.timeLeft = undefined;
        skipAds.player.ads = {
          state: 'ad-playback'
        };
        stub(skipAds.player, 'currentTime', 15);
        stub(skipAds.player, 'duration', 30);
        skipAds.timeUpdate();
      });

      it('will not add class to skipButton', function() {
        expect($(skipAds.skipButton).hasClass('enabled')).to.be.false;
      });
    });

    describe('skip enabled but not past delay', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, {});
        skipAds.timeLeft = undefined;
        skipAds.player.ads = {
          state: 'ad-playback'
        };
        stub(skipAds.player, 'currentTime', 4);
        stub(skipAds.player, 'duration', 30);
        skipAds.timeUpdate();
      });

      it('will not add class to skipButton', function() {
        expect($(skipAds.skipButton).hasClass('enabled')).to.be.false;
      });
    });

    describe('skip enabled and past delay', function() {
      beforeEach(function() {
        skipAds = new SkipAds(player, {});
        skipAds.timeLeft = undefined;
        skipAds.player.ads = {
          state: 'ad-playback'
        };
        stub(skipAds.player, 'currentTime', 15);
        stub(skipAds.player, 'duration', 30);
        skipAds.timeUpdate();
      });

      it('will add class to skipButton', function() {
        expect($(skipAds.skipButton).hasClass('enabled')).to.be.true;
      });
    });
  });

  describe('#adEnd', function() {
    beforeEach(function() {
      skipAds = new SkipAds(player, {});
      skipAds.addClass(skipAds.adsInfo, 'enabled');
      skipAds.adEnd();
    });

    it('remove "enabled" class to adsInfo', function() {
      expect($(skipAds.adsInfo).hasClass('enabled')).to.be.false;
    });
  });

  describe('#setupEventHandlers', function() {
    it('calls adEnd on adend event', function() {
      stub(SkipAds.prototype, 'adEnd');
      skipAds = new SkipAds(player, {});
      skipAds.player.trigger('adend');
      expect(SkipAds.prototype.adEnd.called).to.be.true;
    });

    it('calls timeUpdate on timeupdate event', function() {
      stub(SkipAds.prototype, 'timeUpdate');
      skipAds = new SkipAds(player, {});
      skipAds.player.trigger('timeupdate');
      expect(SkipAds.prototype.timeUpdate.called).to.be.true;
    });
  });
});
