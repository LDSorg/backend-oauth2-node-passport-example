# passport-lds-connect-example

A minimal example using passport lds-connect with io.js / node.js to get an lds.org user profile.

If you don't have io.js or node.js already installed,
[install it](https://github.com/coolaj86/iojs-install-script) and come back.

Install and Test Manually
=========================

There's 0 config.

You can start working with test user data immediately.

1. Clone Backend
----------------

```bash
git clone git@github.com:LDSorg/passport-lds-connect-example.git

pushd passport-lds-connect-example

npm install
```

2. Clone Frontend
-----------------

You need to clone the frontend 

See [github.com/ldsorg](https://github.com/ldsorg?query=oauth2-) for a list of frontends examples / seed projects.

```bash
# The jQuery Example
git clone git@github.com:LDSorg/oauth2-jquery public
```

**Note**: If you use the AngularJS frontend you will also need to run `bower install`.

```bash
npm install -g bower

pushd public
bower install
popd
```

3. Run Server
-------------

```bash
node ./serve.js
```

4. Go to <https://local.ldsconnect.org:8043>
----------

**This domain points to YOUR computer**.

**DO NOT USE 127.0.0.1 or localhost**.

<https://local.ldsconnect.org:8043> uses a valid SSL certificate for
HTTPS and points to 127.0.0.1.

Even in development you should never be using insecure connections.
Welcome to 2015. [Get used to it](https://letsencrypt.org)!

The development test keys are already installed. Once you've fired up the server navigate to <https://local.ldsconnect.org:8043>.

**Note**:
It's important that you use `local.foobar3000.com` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.

5. Login as dumbledore
-----------

You **cannot** login as a real lds.org user as a test application.
If you try, you will get an error.

The login you must use for test applications is `dumbledore` with the passphrase `secret`.

Credits
======

Adapted from Jared Hansen's
[passport-facebook example](https://github.com/jaredhanson/passport-facebook/tree/master/examples/login).
