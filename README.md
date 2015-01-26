# passport-lds-connect-example

A minimal example using passport lds-connect with io.js / node.js to get a user profile.

If you don't have io.js or node.js already installed,
[install it](https://github.com/coolaj86/iojs-install-script) and come back.

Install and Test Manually
=========================

There's 0 config.

You can start working with test user data immediately.

```bash
git clone git@github.com:LDSorg/passport-lds-connect-example.git

pushd passport-lds-connect-example

npm install

node ./serve.js
```

The development test keys are already installed. Once you've fired up the server navigate to <https://local.foobar3000.com:8043>.

**Note**:
It's important that you use `local.foobar3000.com` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.

SSL Warnings
============

This example uses **dummy SSL certificates** that are not recognized
by your browser.

There's nothing wrong with the example.
**The browser security warnings are normal**.
It's simply your browser letting
you know that these certificates are not from a recognized vendor.

![](https://i.imgur.com/d5mXvGa.png)

![](https://i.imgur.com/RDjfEE5.png)

![](https://i.imgur.com/xRnNSDQ.png)

**When you deploy your real app** you should swap them with your own certificates.

**TODO**: Link to video showing how to generate CSR, etc.

**TODO**: During Summer 2015 Mozilla will make basic SSL certificates available
to all web hosts for free be (see [Let's Encrypt](https://letsencrypt.org/)).
Someone remind me to come back and update the instructions for the
free certificates if this notice is still here in August.

Credits
======

Adapted from Jared Hansen's
[passport-facebook example](https://github.com/jaredhanson/passport-facebook/tree/master/examples/login).
