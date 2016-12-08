#Storm Modal Gallery 

[![Build Status](https://travis-ci.org/mjbp/storm-modal-gallery.svg?branch=master)](https://travis-ci.org/mjbp/storm-modal-gallery)
[![codecov.io](http://codecov.io/github/mjbp/storm-modal-gallery/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-modal-gallery?branch=master)
[![npm version](https://badge.fury.io/js/storm-modal-gallery.svg)](https://badge.fury.io/js/storm-modal-gallery)

Modal gallery/lightbox.

##Usage
HTML
```
```

JS
```
npm i -S storm-modal-gallery
```
either using es6 import
```
import ModalGallery from 'storm-modal-gallery';

ModalGallery.init('.js-modal-gallery');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-toggler.standalone.js')
    .then(() => {
        StormModalGalllery.init('.js-modal-gallery');
    });
```
or es5 commonjs  (legacy, use the .standalone version in the /dist folder)
```
var ModalGallery = require('./libs/storm-modal-gallery');

ModalGallery.init('.js-modal-gallery');
```


##Example
[https://mjbp.github.io/storm-modal-gallery](https://mjbp.github.io/storm-modal-gallery)


##Options
```
    {
    }
```

e.g.
```
ModalGallery.init('.js-modal-gallery', {
    fullscreen: true
});
```


##API
####`ModalGallery.init(selector, opts)`
Initialise the module with a DOM selector and  options object


##Tests
```
npm run test
```

##Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

The es5 version depends unpon Object.assign, element.classList, and Promises so all evergreen browsers are supported out of the box, ie9+ is supported with polyfills. ie8+ will work with even more polyfils for Array functions and eventListeners.

##Dependencies
None

##License
MIT