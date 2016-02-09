function start(imageUrl) {
    var preload = new Preload(
        new FreshUrl(imageUrl),
        500, true),
    screenShot = new ScreenShot($('#screenShot')),
    tileSelector = new TileSelector(
        '#screenShotHolder',
        screenShot.setDisplay.bind(screenShot, 'ratio')
    ),
    freeSelector = new FreeSelector(
        '#screenShotHolder',
        screenShot.setDisplay.bind(screenShot, 'free')
    );

    preload.on(screenShot.load.bind(screenShot)).start();
    Menu($('#menu'), preload, screenShot, tileSelector, freeSelector);
    screenShot.setDisplay('full', []);
}

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
    $('body').append(preload);
    preload.css('display', 'none').load(loaded);

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
    this.start = function () {
        self.run(true);
    };
    this.run = function (first) {
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
            self.run();
        }
    }
    function fire() {
        for (var i in actions) {
            actions[i].call(null, oUrl.current(), preload.width(), preload.height());
        }
    }
}

function ScreenShot(oImageelement) {
    var w = 1,
    h = 1,
    resize_flex = resize_full,
    args = [];
    this.load = function (url, nW, nH) {
        oImageelement.attr('src', url);
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
        } else { // 'full'
            resize_flex = resize_full;
            args = [];
        }
        resize_flex.apply(this, args);
        return this;
    };

    function resize_full() {
        resize_raw(0, w, h, 0);
    }

    function resize_ratio(tilesVertical, col, tilesHorizontal, row) {
        var tileWidth  = w/tilesVertical,
        tileHeigth = h/tilesHorizontal;
        resize_raw(
            row * tileHeigth,
            (col+1) * tileWidth,
            (row+1) * tileHeigth,
            col * tileWidth
            );
    }

    function resize_free(top, right, bottom, left) {
        resize_raw(
            top * h,
            right * w,
            bottom * h,
            left * w
        );
    }

    function resize_raw(top, right, bottom, left) {
        var imgWidth = right - left,
        imgHeight = bottom - top,
        factor = Math.min(
            window.innerWidth/imgWidth,
            window.innerHeight/imgHeight
            ),
        newHeight = factor * imgHeight,
        newWidth = factor * imgWidth,
        divCSS = {
            top:      Math.round((window.innerHeight - newHeight)/2),
            left:     Math.round((window.innerWidth  - newWidth)/2),
            height:   Math.round(newHeight),
            width:    Math.round(newWidth)
        },
        imgCSS = {
            top:      -Math.round(factor * top),
            left:     -Math.round(factor * left),
            width:    Math.round(factor * w),
            height:   Math.round(factor * h)
        };
        oImageelement.css(imgCSS).parent().css(divCSS);
    }
}

function Menu(oElement, oPreload, oScreenShot, oTileSelector, oFreeSelector) {
    $('i.size', oElement).click(function () {
        var el = $(this);
        el.parent().find('i').removeClass("active");
        switch (el.data('select')) {
            case 'ratio':
            oScreenShot.setDisplay('full', []);
            oTileSelector.activate();
            break;
            case 'free':
            oScreenShot.setDisplay('full', []);
            oFreeSelector.activate();
            break;
            default:
            oScreenShot.setDisplay('full', []);
            break;
        }
        el.addClass("active");
    });
    $('i.play', oElement).click(function () {
        if ($(this).hasClass('fa-play')) {
            $(this)
            .removeClass('fa-play')
            .addClass('fa-pause');
            oPreload.start();
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
        oScreenShot.resize();
    });
}

function TileSelector(sParent, fnAction) {
    var self = this,
    dim = {
        row: 1,
        col: 1
    },
    container = $('<div id="selectRatio">'),
    table = $('<table>');
    $(sParent).append(container);
    container.append(table).css('display', 'none');

    container.on('click', 'button', function () {
        var button = $(this);
        if (button.data('what') == 'inc') {
            dim[button.data('who')]++;
        } else {
            if (dim[button.data('who')] == 1)
                return;
            dim[button.data('who')]--;
        }

        draw();
    }).on('click', 'td', function () {
        var td = $(this);
        fnAction([dim.col, td.data('col'), dim.row, td.data('row')]);
        container.css('display', 'none');
    });

    this.activate = function () {
        container.css('display', 'block');
    };

    function button(who, what) {
        return '<button data-who="'+who+'" data-what="'+what+'" class="'+what+' '+who+'">'+
        '<i class="fa fa-'+(what=='inc'?'plus':'minus')+'"> </i>'+
        '</button>';
    }

    function draw() {
        table.empty();
        for (var r = 0; r < dim.row; r++) {
            var tr = $('<tr>');
            for (var c = 0; c < dim.col; c++) {
                tr.append('<td data-col="'+c+'" data-row="'+r+'">'+(r*dim.col+c+1)+'</td>');
            }
            table.append(tr);
        }
        container.remove('button');
        for (var key in dim) {
            container.append(button(key, 'inc'));
            if (dim[key] > 1) {
                container.append(button(key, 'dec'));
            }
        }
    }
    draw();
}

function FreeSelector(sParent, fnAction) {
    var parent = $(sParent),
        Width = 0,
        Height = 0,
        Left = 0,
        Top = 0,
        top = 0.25,
        right = 0.75,
        bottom = 0.75,
        left = 0.25,
        div = $('<div id="selectFree">'),
        buttons = {
            left: 'arrow-left',
            right: 'arrow-right',
            up: 'arrow-up',
            down: 'arrow-down',
            accept: 'check',
            move: 'arrows'
        },
        key, bnt;

    parent.append(div);
    div.css('display', 'none');

    for (key in buttons) {
        btn = $('<button class="'+key+'" data-action="'+key+'">'+
            '<i class="fa fa-'+buttons[key]+'"> </i>'+
            '</button>'
        );
        buttons[key] = div.append(btn);
        if (key == 'accept') {
            btn.click(deactivate);
            continue;
        }
        btn.mousedown(resizeBegin.bind(this, key));
    }


    /* Resize */
    var resizeDirection;
    function resizeBegin(key) {
        resizeDirection = key;
        $(document).mousemove(resize);
        $(document).mouseup(resizeEnd);
    }
    function resize(e) {
            setAttribute(e.clientX, e.clientY);
    }
    function resizeEnd(e) {
            setAttribute(e.clientX, e.clientY);
            $(document).unbind('mousemove').unbind('mouseup');
    }
    function setAttribute(x, y) {
        var width;
        switch (resizeDirection) {
            case 'up':
                top = Math.min(bottom, Math.max(0, (y - Top)/Height));
                break;
            case 'right':
                right = Math.max(left, Math.min(1, (x - Left)/Width));
                break;
            case 'down':
                bottom = Math.max(top, Math.min(1, (y - Top)/Height));
                break;
            case 'left':
                left = Math.min(right, Math.max(0, (x - Left)/Width));
                break;
            case 'move':
                width = right - left;
                t_left = Math.max(0, (x - Left)/Width - width/2);
                right = Math.min(1, t_left + width);
                left = right - width;

                height = bottom - top;
                t_top = Math.max(0, (y - Top)/Height - height/2);
                bottom = Math.min(1, t_top + height);
                top = bottom - height;
                break;
        }
        positionDiv();
    }
    /* End Resize */

    function deactivate() {
        fnAction([top, right, bottom, left]);
        div.css('display', 'none');
    }

    function positionDiv() {
        css = {
            top: top * Height,
            right: (1-right) * Width,
            bottom: (1-bottom) * Height,
            left: left * Width
        };
        div.css(css);
    }

    this.activate = function () {
        div.css('display', 'block');
        Width = parent.width();
        Height = parent.height();
        var offset = parent.offset();
        Left = offset.left;
        Top = offset.top;
        positionDiv();
    };

    fnAction([0, 0, 1, 1]);
}
