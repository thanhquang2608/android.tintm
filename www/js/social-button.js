/*============================================================================
  Social Icon Buttons v1.0
  Author:
    Carson Shold | @cshold
    http://www.carsonshold.com
  MIT License
==============================================================================*/
window.CSbuttons = window.CSbuttons || {};

CSbuttons.cache = {
    shareButtons: $('.social-sharing')
}

CSbuttons.init = function () {
    CSbuttons.socialSharing();
}

CSbuttons.kFormatter = function (num) {
    return num > 999 ? (num % 1000 < 50 ? (num / 1000).toFixed(0) + 'k' : (num / 1000).toFixed(1) + 'k') : num;
}

CSbuttons.fixUrl = function (url) {
    if (url && url.indexOf('/') === 0) {
        url = window.location.hostname + url;
    }

    return url;
}

CSbuttons.socialSharing = function (btns, permalink) {

    var buttons = btns || $('.social-sharing'),
        permalink = buttons.attr('data-permalink'),
        shareLinks = buttons.find('a').addClass('tester'),
        socialCounts = buttons.find('span.share-count');

    // Get share stats from respective APIs
    var fbLink = $('.share-facebook'),
        twitLink = $('.share-twitter'),
        pinLink = $('.share-pinterest'),
        googleLink = $('.share-google');

    buttons.each(function () {
        var fbShareCount = $(this).find('.share-facebook .share-count');
        var link = $(this).attr('data-permalink') || $(this).attr('permalink') || permalink;

        if (link) {
            $.getJSON('https://graph.facebook.com/?id=' + CSbuttons.fixUrl(link), function (data) {
                if (data.share && data.share.share_count > 0) {
                    var count = CSbuttons.kFormatter(data.share.share_count)
                    var countFormat = CSbuttons.kFormatter(count);
                    $(fbShareCount).text(countFormat).removeClass('hide').addClass('is-loaded');
                } else {
                    $(fbShareCount).text('').addClass('hide');
                }
            });
        } else {
            $(fbShareCount).text('').addClass('hide');
        }
    });

    // for (var i = 0, len = buttons.length; i < len; i++) {
    //   var button = $(buttons[i]);
    //   var fb = $(button.find('.share-facebook')[0]);
    //   var link = button.attr('data-permalink');
    //   if (fb) {
    //     $.getJSON('https://graph.facebook.com/?id=' + CSbuttons.fixUrl(link), function(data) {
    //       if (data.share && data.share.share_count > 0) {
    //         var count = CSbuttons.kFormatter(data.share.share_count)
    //         var countFormat = CSbuttons.kFormatter(count);
    //         fb.find('.share-count').text(countFormat).addClass('is-loaded');
    //       } else {
    //         fb.find('.share-count').remove();
    //       }
    //     });
    //   }

    // }

    // if ( fbLink.length ) {
    //   $.getJSON('https://graph.facebook.com/?id=' + CSbuttons.fixUrl(permalink), function(data) {
    //     console.log(data);
    //     if (data.share && data.share.share_count > 0) {
    //       var count = CSbuttons.kFormatter(data.share.share_count)
    //       var countFormat = CSbuttons.kFormatter(count);
    //       fbLink.find('.share-count').text(countFormat).addClass('is-loaded');
    //     } else {
    //       fbLink.find('.share-count').remove();
    //     }
    //   });
    // };

    if (twitLink.length) {
        $.getJSON('https://cdn.api.twitter.com/1/urls/count.json?url=' + permalink + '&callback=?', function (data) {
            if (data.count > 0) {
                twitLink.find('.share-count').text(data.count).addClass('is-loaded');
            } else {
                twitLink.find('.share-count').remove();
            }
        });
    };

    if (pinLink.length) {
        $.getJSON('https://api.pinterest.com/v1/urls/count.json?url=' + permalink + '&callback=?', function (data) {
            if (data.count > 0) {
                pinLink.find('.share-count').text(pinShares).addClass('is-loaded');
            } else {
                pinLink.find('.share-count').remove();
            }
        });
    };

    if (googleLink.length) {
        // Can't currently get Google+ count with JS, so just pretend it loaded
        googleLink.find('.share-count').addClass('is-loaded');
    }

    // Share popups
    shareLinks.on('click', function (e) {
        console.log("click");
        e.preventDefault();
        var el = $(this),
            popup = el.attr('class').replace('-', '_'),
            link = el.attr('href'),
            w = 700,
            h = 400;

        // Set popup sizes
        switch (popup) {
            case 'share-twitter':
                h = 300;
                break;
            case 'share-fancy':
                w = 480;
                h = 720;
                break;
            case 'share-google':
                w = 500;
                break;
        }

        window.open(link, popup, 'width=' + w + ', height=' + h);
    });
}

CSbuttons.socialSharingFacebook = function (selector, permalink) {

    var button = $(selector),
        buttonCount = $(selector + ' .share-facebook .share-count');
    // $.getJSON('/foundbuttouncount/' + buttonCount.length);

    if (permalink) {
        $.getJSON('https://graph.facebook.com/?id=' + CSbuttons.fixUrl(permalink), function (data) {
            if (data.share && data.share.share_count > 0) {
                // $.getJSON('/share/' + data.share.share_count);
                var count = CSbuttons.kFormatter(data.share.share_count)
                var countFormat = CSbuttons.kFormatter(count);
                $(buttonCount).text(countFormat).removeClass('hide').addClass('is-loaded');
            } else {
                $(buttonCount).text('').addClass('hide');
            }
        })
        .error(function () { $(buttonCount).text('').addClass('hide'); });
    } else {
        $(buttonCount).text('').addClass('hide');
    }
}

$(function () {
    window.CSbuttons.init();
});
