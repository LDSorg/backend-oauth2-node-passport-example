$(function () {
  'use strict';

  function testLogin() {
    $.getJSON('/account.json').then(function (data) {
      if (!data || !data.user) {
        return;
      }

      $('.js-login').hide();
      $('.js-login-dialog').modal('hide');
      $('.js-profile').html(JSON.stringify(data, null, '  '));
      $('.js-profile-container').fadeIn();

      if (data.user && data.user.photos.length) {
        $('img.js-headshot').attr('src', data.user.photos[0].value);
        $('img.js-headshot').show();
      }
    });
  }

  $('.js-open-login').click('body', function () {
    // handling this in the browser instead of on the server
    // means swapping a redirect for an http request,
    // so don't believe an fanatic's fallacy that this is slower.
    window.completeLogin = function (/*name, href*/) {
      // name can be used to disambiguate if you have multiple login strategies
      // href will contain 'code', 'token', or an error you may want to display to the user
      testLogin();
    };

    // Due to security issues surrounding iframes (click-jacking, etc),
    // we currently only support opening a new window for OAuth2.
    // Admitedly, it's a little more visual distracting that the normal double-redirect,
    // but that makes it much more difficult to bring the user back to their present experience
    // so we highly recommend this method.
    // Once the security issues are figured out, we'll support iframes (like facebook)
    window.open('/auth/ldsconnect');
    // alternate method <iframe src="frame.htm" allowtransparency="true">
  });

  function init() {
    $('img.js-headshot').hide();
    $('.js-profile-container').hide();

    testLogin();
  }

  init();
});
