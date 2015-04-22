# LDS API OAuth2 node.js example

A minimal backend example using [passport-oauth3](https://github.com/OAuth3/node-passport-oauth3)
to get an lds.org user profile via [LDS I/O](https://lds.io).

This backend is part of the LDS API
[Choose your own Adventure](https://github.com/LDSorg/choose-your-own-adventure) series.

That means that you can **couple this backend** with **any compatible frontend** example and start
developing with Zero Configuration.

Zero-Config Install and Run
================

You can start working with test user data immediately.

```bash
curl -fsSL https://bit.ly/lds-api-adventure -o adventure.bash
bash ./adventure.bash node angular
```

No configuration changes are required and working test API keys are provided.

You will be able to experiment at <https://local.ldsconnect.org:8043>

The "Hard" Way
==============

If you don't have io.js or node.js already installed,
[install it](https://github.com/coolaj86/iojs-install-script) and come back.

1. Clone Backend
----------------

See [github.com/ldsorg](https://github.com/ldsorg?query=backend-) for a list of backends examples / seed projects.

```bash
git clone https://github.com/LDSorg/backend-oauth2-node-passport-example.git ./backend-oauth2-node

pushd ./backend-oauth2-node

npm install
```

2. Clone SSL Certs
------------------

These certs are authentically valid for `local.ldsconnect.org`, which you are required to use during development.

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
git clone https://github.com/LDSorg/frontend-oauth2-jquery-example.git ./frontend-oauth2-jquery
rm -f public
ln -s frontend-oauth2-jquery public
```

```bash
npm install -g bower

pushd ./frontend-oauth2-jquery
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

The development test keys are already installed. Once you've fired up the
server navigate to <https://local.ldsconnect.org:8043>.

**Note**:
It's important that you use `local.ldsconnect.org` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.
