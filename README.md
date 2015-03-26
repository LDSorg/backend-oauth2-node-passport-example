# passport-lds-connect-example

A minimal example using passport-lds-io with io.js / node.js to get an lds.org user profile.

If you don't have io.js or node.js already installed,
[install it](https://github.com/coolaj86/iojs-install-script) and come back.

Zero-Config Install and Run
================

You can start working with test user data immediately.

1. Clone Backend
----------------

```bash
git clone https://github.com/LDSorg/backend-oauth2-node-passport-example.git ./oauth2-backend-example

pushd ./oauth2-backend-example

npm install
```

2. Clone SSL Certs
------------------

```bash
# Clone the example HTTPS/SSL certificates into ./certs
git clone https://github.com/LDSorg/local.ldsconnect.org-certificates.git ./certs
tree -I .git ./certs
```

3. Clone Frontend
-----------------

You need to clone the frontend 

See [github.com/ldsorg](https://github.com/ldsorg?query=frontend-) for a list of frontends examples / seed projects.

```bash
# The jQuery Example
git clone https://github.com/LDSorg/frontend-oauth2-jquery-example.git ./public
```

**Follow the Frontend instructions**

**For Example**: If you use the **AngularJS frontend** you will also need to run `bower install`.

```bash
npm install -g bower

pushd public
bower install
popd
```

4. Run Server
-------------

```bash
node ./serve.js
```

5. Go to <https://local.ldsconnect.org:8043>
----------

**This domain points to YOUR computer**.

**DO NOT USE 127.0.0.1 or localhost**.

<https://local.ldsconnect.org:8043> uses a valid SSL certificate for
HTTPS and points to 127.0.0.1.

Even in development you should never be using insecure connections.
Welcome to 2015. [Get used to it](https://letsencrypt.org)!

The development test keys are already installed. Once you've fired up the server navigate to <https://local.ldsconnect.org:8043>.

**Note**:
It's important that you use `local.ldsconnect.org` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.

6. Login as dumbledore
-----------

You **cannot** login as a real lds.org user as a test application.
If you try, you will get an error.

The login you must use for test applications is `dumbledore` with the passphrase `secret`.

Credits
======

Adapted from Jared Hansen's
[passport-facebook example](https://github.com/jaredhanson/passport-facebook/tree/master/examples/login).
