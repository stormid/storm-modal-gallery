# Storm Modal Gallery 

[![Build Status](https://travis-ci.org/mjbp/storm-modal-gallery.svg?branch=master)](https://travis-ci.org/mjbp/storm-modal-gallery)
[![codecov.io](http://codecov.io/github/mjbp/storm-modal-gallery/coverage.svg?branch=master)](http://codecov.io/github/mjbp/storm-modal-gallery?branch=master)
[![npm version](https://badge.fury.io/js/storm-modal-gallery.svg)](https://badge.fury.io/js/storm-modal-gallery)

Modal gallery/lightbox.

## Example
[https://mjbp.github.io/storm-modal-gallery](https://mjbp.github.io/storm-modal-gallery)


## Usage
A modal gallery can be created with DOM elements, or programmatically created from a JS Object

To create from HTML:
```
<ul>
    <li><a class="js-modal-gallery" href="http://placehold.it/500x500" data-title="Image 1" data-description="Description 1" data-srcset="http://placehold.it/800x800 800w, http://placehold.it/500x500 320w">Image one</a></li>
    <li><a class="js-modal-gallery" href="http://placehold.it/300x800" data-title="Image 2" data-description="Description 2" data-srcset="http://placehold.it/500x800 800w, http://placehold.it/300x500 320w">Image two</a></li>
</ul>
```

CSS
```
.modal-gallery__outer {
    display: none;
    opacity: 0;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000000;
    background-color: rgba(0,0,0,.9);
    transition: opacity .5s ease;
}
.modal-gallery__outer.active {
    display: block;
    opacity: 1;
}
.modal-gallery__img-container {
    text-align:center;
}
.modal-gallery__img {
    margin:80px auto 0 auto;
    max-width:80%;
    max-height: 80vh;
}
.modal-gallery__item {
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    opacity:0;
    visibility:hidden;
}
.modal-gallery__item.active {
    opacity:1;
    visibility:visible;
}
.modal-gallery__next {
    position: fixed;
    bottom:50%;
    right:25px;
}
.modal-gallery__previous {
    position: fixed;
    bottom:50%;
    left:25px;
}
.modal-gallery__close {
    position: fixed;
    top:15px;
    right:25px;
}
.modal-gallery__close:hover svg,
.modal-gallery__previous:hover svg,
.modal-gallery__next:hover svg{
    opacity:.8
}
.modal-gallery__total {
    position: absolute;
    bottom:25px;
    right:25px;
    color:#fff
}
.modal-gallery__details {
    position: fixed;
    bottom:0;
    left:120px;
    right:120px;
    padding:0 0 40px 0;
    color:#fff;
}
.loading:after {
    color:#fff;
    z-index:1;
    width:100%;
    position: fixed;
    display: block;
    text-align:center;
    top:45%;
    content:'Loading...'
}
.gallery__item {
    display: inline-block;
}
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
or aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-toggler.standalone.js')
    .then(() => {
        StormModalGalllery.init('.js-modal-gallery');
    });
```

To create from pure JS and triggered from any event:
```
import ModalGallery from 'storm-modal-gallery';

let gallery = ModalGallery.init([
    {
        src: 'http://placehold.it/500x500',
        srcset:'http://placehold.it/800x800 800w, http://placehold.it/500x500 320w',
        title: 'Image 1',
        description: 'Description 1'
    },
    {
        src: 'http://placehold.it/300x800',
        srcset:'http://placehold.it/500x800 800w, http://placehold.it/300x500 320w',
        title: 'Image 2',
        description: 'Description 2'
    }]);

//e.g. Open the gallery by clicking on a button with the className 'js-modal-gallery__trigger'
document.querySelector('.js-modal-gallery__trigger').addEventListener('click', gallery.open.bind(gallery, 0));
```



## Options
```
{
    fullscreen: false,
    preload: false,
    totals: true //show current and totalnumber of images
    scrollable: false, //add className to apply CSS to support scrollable content
    single: false // separate single images, do not collect into a gallery
}
```

e.g.
```
ModalGallery.init('.js-modal-gallery', {
    fullscreen: true
});
```

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

This module depends upon Object.assign, element.classList, and Promises, available in all evergreen browsers. ie9+ is supported with polyfills, ie8+ will work with even more polyfills for Array functions and eventListeners.


## Dependencies
None

## License
MIT