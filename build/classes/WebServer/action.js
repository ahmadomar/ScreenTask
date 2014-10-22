function FreshUrl(sBaseUrl) {
    var self = this,
        rand = Math.random();
    this.current = function () {
        return sBaseUrl + '?' + rand;
    };
    this.fresh = function () {
        rand = Math.random();
        return self.current();
    };
}

function ScreenShot(oImageelement) {
    var w = 1,
        h = 1,
        resize_flex = resize_full,
        args = [];
    this.load = function (url) {
        oImageelement.attr('src', url);
        var nW = oImageelement.width(),
            nH = oImageelement.height();
        if ((nW != w) || (nH != h)) {
            w = nW;
            h = nH;
            resize_flex.apply(this, args);
        }
        return this;
    };

    this.resize = function () {
        resize_flex.apply(this, args);
    };

    this.setDisplay = function (sType, aArgs) {
        if (sType == 'ratio' || sType == 1) {
            resize_flex = resize_ratio;
            args = aArgs;
        } else if (sType == 'free' || sType == 2) {
            resize_flex = resize_free;
            args = aArgs;
        } else {
            resize_flex = resize_full;
            args = [];
        }
        resize_flex.apply(this, args);
        return this;
    };

    function resize_full() {
        resize_free(0, w, h, 0);
    }

    function resize_ratio(verticalPieces, horizontalPieces, verticalPiece, horizontalPiece) {
        resize_free(
                horizontalPiece * h/horizontalPieces,
                (verticalPiece+1) * w/verticalPieces,
                (horizontalPiece+1) * h/horizontalPieces,
                verticalPiece * w/verticalPieces
        );
    }

    function resize_free(top, right, bottom, left) {
        var imgWidth = right - left,
            imgHeight = bottom - top,
            factor = Math.min(
                window.innerWidth/imgWidth,
                window.innerHeight/imgHeight
            ),
            divCSS = {
                overflow: 'hidden',
                position: 'absolute',
                top:      (window.innerHeight - factor * imgHeight)/2,
                left:     (window.innerWidth  - factor * imgWidth)/2,
                width:    factor * imgWidth,
                height:   factor * imgHeight,
            },
            imgCSS = {
                position: 'absolute',
                display: 'block',
                top:      factor * top,
                left:     factor * left,
                width:    factor * w,
                height:   factor * h
            };
        oImageelement.css(imgCSS).parent().css(divCSS);
    }
}

function Preload(oUrl, iMinInterval, bLoop) {
    var self = this,
        interval = iMinInterval,
        timer = null,
        preload = $('<img>'),
        stat_loaded = false,
        stat_timeout = false,
        begin,
        restart = bLoop === undefined ? false : bLoop,
        actions = [];
    preload.load(loaded);

    this.delta = 0;
    this.changeRate = function (iMinInterval) {
        if (iMinInterval !== undefined) {
            interval = iMinInterval;
        }
        return interval;
    };
    this.loop = function (bLoop) {
        restart = bLoop === undefined ? true : bLoop;
        return this;
    };
    this.stop = function () {
        window.clearInterval(timer);
        stat_timeout = false;
        return this;
    };
    this.on = function (func) {
        actions.push(func);
        return this;
    };
    this.start = function (first) {
        begin = new Date();
        if (first === true) {
            stat_timeout = true;
        } else {
            stat_timeout = false;
            timer = window.setTimeout(timeout, interval); // start Timeout
        }
        stat_loaded = false;
        preload.attr('src', oUrl.fresh()); // start Loading
        return this;
    };
    function loaded() {
        stat_loaded = true;
        checkAction();
    }
    function timeout() {
        stat_timeout = true;
        checkAction();
    }
    function checkAction() {
        if (!stat_timeout || !stat_loaded) {
            return;
        }
        self.delta = (new Date()) - begin;
        fire();
        if (restart) {
            self.start(false);
        }
    }
    function fire() {
        for (var i in actions) {
            actions[i].call(null, oUrl.current());
        }
    }
}

function Menu(oElement, oPreload, oScreenShot) {
    $('i.size', oElement).click(function () {
        $(this).parent().find('i').removeClass("active");
        $(this).addClass("active");
    });
    $('i.play', oElement).click(function () {
        if ($(this).hasClass('fa-play')) {
            $(this)
                .removeClass('fa-play')
                .addClass('fa-pause');
            oPreload.start(true);
        } else {
            $(this)
                .removeClass('fa-pause')
                .addClass('fa-play');
            oPreload.stop();
        }
    });
    $('input', oElement).val(oPreload.changeRate()).change(function () {
        oPreload.changeRate($(this).val());
    });
    oElement.mouseenter(function () {
        oElement.removeClass("low");
    }).mouseleave(function () {
        oElement.addClass("low");
    });
    $('#screenShotHolder').dblclick(function () {
        fullScreen = this.requestFullScreen || this.mozRequestFullScreen || this.webkitRequestFullScreen;
        fullScreen.call($('body').get(0));
    });
    $(window).resize(function () {
        console.log("Fullscreen");
        oScreenShot.resize();
    });
}

function start() {
    var freshUrl = new FreshUrl('http://localhost/ScreenTask/WebServer/ScreenTask.jpg'),
        screenShot = new ScreenShot($('#screenShot')),
        preload = new Preload(freshUrl, 500, true);
    preload.on(screenShot.load.bind(screenShot)).start(true);
    Menu($('#menu'), preload, screenShot);
}
