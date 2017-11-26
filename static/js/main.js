/**
 * Created by d34thkn3ll on 31/10/2017.
 */
var $window = $(window);

$(function() {
    $('.js-reveal-offering-terms').on('click', function() {
        $('#offering-terms').removeClass('offer-private offer-pre offer-public offer-maintenance');
        $('.js-reveal-offering-terms').hide();
        return false;
    });

    /* Countdown */
    $('[data-countdown]').each(function() {
        var that = $(this),
            countdown = that.data('countdown'),
            datetime = new Date(countdown);
        var interval = setInterval(function() {
            var now = new Date();
            if (now.getTime() >= datetime.getTime()) {
                clearInterval(interval);
            }
            that.html(daysBetween(now, datetime));
        }, 1000);

    });

    /* Contribute */
    $('.button-contribute').on('click', function() {
        $('#contribute-form').show();
    });

    $('.button-contribute-close').on('click', function() {
        $('#contribute-form').hide();
    });

    (function contract_clipboard() {
        var sel = '.js-copy-address',
            btn = $(sel);

        var contractClipboard = new Clipboard(sel);
        contractClipboard.on('success', function(e) {
            e.clearSelection();
        });

        contractClipboard.on('error', function(e) {
        });
    })();

    /* Subscribe */

    (function() {
        var button = $('.js-subscribe-btn'),
            email = $('.js-subscribe-email');

        if (localStorage.getItem("subscribed")) {
            subscribed();
        }

        button.on('click', function() {
            var addr = email.val().trim();
            subscribe(addr);
        });

        email.keypress(function(e) {
            if(e.which === 13) {
                e.preventDefault();
                button.trigger('click');
            }
        });

        function subscribed() {
            button.off("click", subscribe);
            email.hide();
            button.val("Subscribed");
            $('#subscribe-form').addClass('subscribed');

            $('.subscribe-email-cont').hide();

            email.removeClass("incorrect");
            localStorage.setItem("subscribed", true);
        }

        function subscribe(addr) {
            if (subscribe.pending) return false;
            subscribe.pending = true;

            email.removeClass("incorrect");
            button.addClass("pending");

            $.ajax({
                type: "POST",
                url: '/subscribe',
                dataType: 'json',
                data: {
                    email: addr
                }
            }).done(function() {
                subscribed();
            }).fail(function() {
                email.addClass("incorrect");
            }).always(function() {
                subscribe.pending = false;
                button.removeClass("pending");
            });
        }
    })();

    /* Animations */

    $('[data-onscroll]').each(function() {
        var $this = $(this);
        var onScroll = et.onScrolledIntoView($this);
        onScroll.done(function() {
            if ($this.data('class-add')) {
                $this.addClass($this.data('class-add'));
            }
            if ($this.data('class-remove')) {
                $this.removeClass($this.data('class-remove'));
            }
            setTimeout(function() {
                $this.removeClass('transition-default');
            }, 1500);
        })
    });

    setTimeout(function() {
        $window.trigger('scroll');
    }, 500);

});

function daysBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
}

var ET = function() {
    this.onScrolledIntoView = onScrolledIntoView;

    function onScrolledIntoView($el) {
        var $promise = $.Deferred();
        var throttled = _.throttle(onScroll, 300);

        $window.on('scroll', throttled);

        $promise.done(function() {
            $window.off('scroll', throttled);
        });

        function onScroll() {
            var hT = $el.offset().top,
                hH = $el.height(),
                wH = $window.height(),
                wS = $window.scrollTop();
            if (wS + wH * 0.9 > hT) {
                $promise.resolve();
            }
        }

        return $promise;
    }
};

var et = new ET();