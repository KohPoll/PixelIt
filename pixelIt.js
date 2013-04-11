
(function(window, undefined) {

    var $imageUtil = {
        rgb2gray: function(r, g, b) {
            return Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
        }
    };

    var pixelIt = function(elem) {
        var container, canvas, ctx;
        var imageToLoad, isImageLoaded = false, checkTimer;
        var $image;

        var init = function(elem) {
            if (elem && typeof elem === 'string') {
                container = document.getElementById(elem);

                canvas = document.createElement('canvas');
                container && container.appendChild(canvas);

                canvas.getContext && (ctx = canvas.getContext('2d'));
            }
        };

        var initImage = function(img) {
            var width = img.width, height = img.height;
            var imageData = ctx.getImageData(0, 0, width, height);
            var pixelArray = imageData.data;

            var dimensionMapper = function(x, y) {
                return x * (width * 4) + (y * 4);
            };
            var getPixelRGBA = function(x, y) {
                var s = dimensionMapper(x, y);

                return [pixelArray[s],
                        pixelArray[s + 1],
                        pixelArray[s + 2],
                        pixelArray[s + 3]];
            };
            var setPixelRGBA = function(x, y, rgba) {
                var s = dimensionMapper(x, y);

                if (rgba && typeof rgba === 'object' && rgba.length === 4) {
                    pixelArray[s    ] = rgba[0];
                    pixelArray[s + 1] = rgba[1];
                    pixelArray[s + 2] = rgba[2];
                    pixelArray[s + 3] = rgba[3]
                }
            };

            // core
            $image = {
                width: width,
                height: height,
                pixelArray: pixelArray,
                pixel: function(x, y, fn) {
                    var oriRGBA, rstRGBA;

                    if (x < 0 || x > width) {
                        throw "x is out of bounds";
                    }
                    if (y < 0 || y > height) {
                        throw "y is out of bounds";
                    }

                    oriRGBA = getPixelRGBA(x, y);
                    if (typeof fn === 'function') {
                        rstRGBA = fn(oriRGBA[0], oriRGBA[1], oriRGBA[2], oriRGBA[3]);
                        setPixelRGBA(x, y, rstRGBA);
                    } else {
                        return oriRGBA;
                    }
                },
                patch: function(left, top, right, bottom, fn) {
                    var rstRGBAs = [];

                    for (var x=left; x<right; ++x) {
                        for (var y=top; y<bottom; ++y) {
                            if (typeof fn === 'function') {
                                this.pixel(x, y, fn);
                            } else {
                                rstRGBAs.push(this.pixel(x, y));
                            }
                        }
                    }

                    return rstRGBAs;
                },
                all: function (fn) {
                    return this.patch(0, 0, width, height, fn);
                },
                draw: function() {
                    ctx.putImageData(imageData, 0, 0);
                }
            };

            // core util
            $image.util = $imageUtil;
        };

        var drawToCanvas = function (img) {
            if (ctx == null) return;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            return this;
        };

        var reset = function () {
            if (imageToLoad == null) return;

            drawToCanvas(imageToLoad);
            initImage(imageToLoad);

            return this;
        };

        var load = function (src) {
            if (ctx == null) return;

            imageToLoad = new Image();
            imageToLoad.onload = function(evt) {
                drawToCanvas(this);
                initImage(this);

                isImageLoaded = true;
                imageToLoad.onload = null;
            };
            imageToLoad.src = src;

            return this;
        };

        var process = function(fn) {
            checkTimer = setInterval(function() {
                if (isImageLoaded) {
                    fn($image);
                    clearInterval(checkTimer);
                }
            }, 100);

            return this;
        };

        init(elem); //init

        // public interface
        return {
            reset: reset,
            /*
             * src {String} : url of image to load.
             */
            load: load,
            /* 
             * fn {Function} - the process function, accept the image argument. fn(image)
             *      --image {Object}
             *          {
             *              width {Number} : the width of loaded image,
             *              height {Number} : the height of loaded image,
             *              pixelArray {CanvasPixelArray} : pixel array(not advised),
             *              pixel {Function} : function(x, y, fn),
             *              patch {Function} : function(left, top, right, bottom, fn),
             *              draw {Function} : draw the image after processed
             *          }
             *      Note:
             *      fn - fn(r, g, b, a) { return [rv, gv, bv, av]; }
             *      r, g, b, a is the component of the according pixel, return a
             *      array of 4 item(the component after processing)
             */
            process: process
        };

    };

    /*
     * extend the util
     * k {String} : name of the util function.
     * f {Function} : the util function.
     */
    pixelIt.addUtil = function (k, f) {
        if ($imageUtil[k] == null) {
            $imageUtil[k] = f;
        }
    };

    if (typeof window.pixelIt === 'undefined') {
        window.pixelIt = pixelIt;
    }

})(window);
