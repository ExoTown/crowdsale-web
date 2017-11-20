/**
 * Created by d34thkn3ll on 31/10/2017.
 */
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