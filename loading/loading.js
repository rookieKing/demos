(function () {
    function $(selector, element) {
        return (element || document).querySelector(selector);
    }

    function Loading(element) {
        if (!(this instanceof Loading)) return new Loading(element);
        extend(this, {
            lr: $('.loading-r', element),
            lrc: $('.loading-r-cover', element),
            ll: $('.loading-l', element),
            llc: $('.loading-l-cover', element),
            lt: $('.loading-top', element),
            percentage: 0
        });
    }
    Loading.getRotate = function (percentage) {
        return 'scale(8) rotate({0}deg)'.format(Math.round(percentage * 3.6));
    };
    Loading.prototype.rate = function (percentage) {
        this.lt.setAttribute('data-percentage', Math.round(percentage));
        this.percentage = percentage;
        if (percentage < 50) {
            this.llc.style.display = '';
            this.lrc.style.transform = Loading.getRotate(percentage);
            this.llc.style.transform = Loading.getRotate(0);
        } else {
            this.llc.style.display = 'block';
            this.lrc.style.transform = Loading.getRotate(50);
            this.llc.style.transform = Loading.getRotate(percentage - 50);
        }
    }


    var l1 = new Loading($('#loading1'));
    function run1() {
        eachAsync(createArr(360), function (next, v) {
            setTimeout(function () {
                l1.rate((v + 1) / 3.6);
                next();
            }, 40);
        }, 1, function () {
            setTimeout(function () {
                l1.rate(0);
                run1();
            }, 2000);
        });
    }
    run1();

    
    var el2 = $('#loading2');
    var l2 = new Loading(el2);
    var running = false;
    var tmr;
    el2.onclick = function () {
        running = !running;
        if (running) {
            var cur = l2.percentage;
            tmr = setInterval(function () {
                if ((cur += 0.28) < 100) {
                    l2.rate(cur);
                } else {
                    l2.rate(100);
                    clearInterval(tmr);
                    el2.onclick = null;
                }
            }, 40);
        } else {
            clearInterval(tmr);
        }
    };

    var controller = $('#range1');
    var l3 = new Loading($('#loading3'));
    controller.onchange = function () {
        l3.rate(this.value / 3.6);
    }
})();