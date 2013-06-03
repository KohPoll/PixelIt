/*!
 * pixelIt.js
 * kohpoll(kongxp920@gmail.com)
 * Released under the MIT License.
 */
(function(window, undefined) {

    var noop = function(){};


    var $imageUtil = {
        rgb2gray: function(r, g, b) {
            return Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
        }
    };


    function $Image(image) {
        this.initialize(image);
    }
    $Image.prototype = {
        constructor: $Image,
        initialize: function (image) {
            var self = this;

            // set the img & width & height
            self.set('image', image);
            self.set('width', image.width);
            self.set('height', image.height);

            // draw it to canvas
            self._drawToCanvas(image);
        },

        pixel: function(x, y, fn) {
            var self = this;
            var oriRGBA, rstRGBA;

            oriRGBA = self._rgba(x, y);
            if (fn == null) {
                return oriRGBA;
            }

            rstRGBA = fn(oriRGBA[0], oriRGBA[1], oriRGBA[2], oriRGBA[3]);
            self._rgba(x, y, rstRGBA);

            self._refresh();

            return self;
        },
        patch: function(left, top, right, bottom, fn) {
            var self = this;
            var oriRGBA, rstRGBAs = [];

            for (var x=left; x<right; ++x) {
                for (var y=top; y<bottom; ++y) {
                    oriRGBA = self._rgba(x, y);

                    if (fn == null) {
                        rstRGBAs.push(oriRGBA);
                    } else {
                        self._rgba(x, y, fn(oriRGBA[0], oriRGBA[1], oriRGBA[2], oriRGBA[3]));
                    }
                }
            }

            if (fn != null) { //refresh it
                self._refresh();
                return self;
            }

            return rstRGBAs;
        },
        all: function (fn) {
            var self = this;
            var width = self.get('width'), height = self.get('height');

            return self.patch(0, 0, width, height, fn);
        },
        reset: function () {
            var self = this;
            var image = self.get('image');

            self._drawToCanvas(image);

            return self;
        },

        _rgba: function (x, y, rgba) {
            var self = this;
            var width = self.get('width');
            var pixelArr = self.get('imageData').data;

            var xy2index = function (x, y) { return x * (width * 4) + (y * 4); };
            var s = xy2index(x, y);

            if (rgba == null) {
                //get
                return [
                    pixelArr[s],
                    pixelArr[s + 1],
                    pixelArr[s + 2],
                    pixelArr[s + 3]
                ];
            }

            //set
            pixelArr[s]     = rgba[0];
            pixelArr[s + 1] = rgba[1];
            pixelArr[s + 2] = rgba[2];
            pixelArr[s + 3] = rgba[3];

            return self;
        },
        _refresh: function () {
            var self = this;
            var ctx = self.get('ctx');
            var imageData = self.get('imageData');

            ctx.putImageData(imageData, 0, 0);

            return self;
        },

        _drawToCanvas: function (image) {
            var self = this;
            var width = self.get('width'), height = self.get('height');
            var ctx = self.get('ctx') || self._getContext(image);

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);

            self.set('ctx', ctx);
            self.set('imageData', ctx.getImageData(0, 0, width, height));

            return self;
        },
        _getContext: function (image) {
            var canvas = document.createElement('canvas');

            canvas.width = image.width;
            canvas.height = image.height;

            image.parentNode.appendChild(canvas);
            image.remove();

            return canvas.getContext('2d');
        },

        _attrs: {},
        get: function (k) {
            return this._attrs[k];
        },
        set: function (k, v) {
            this._attrs[k] = v;
        },

        //util
        util: $imageUtil
    };


    var pixelIt = function (el, fn) {
        var self = this;
        var image = el;

        if (image == null) return;

        fn = fn || noop;

        image.onload = function (evt) {
            fn.call(self, new $Image(this));
            image.onload = null;
            image = null;
        };
    };


    pixelIt.addUtil = function (k, f) {
        if ($imageUtil[k] == null) {
            $imageUtil[k] = f;
        }
    };


    if (typeof window.pixelIt === 'undefined') {
        window.pixelIt = pixelIt;
    }

})(window);
