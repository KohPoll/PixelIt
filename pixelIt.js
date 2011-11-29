//alert('hello');

(function(window, undefined) {

    var container, canvas, ctx,
        imageToLoad, isImageLoaded = false, checkTimer,
        DEFAULT_WIDTH = 800, DEFAULT_HEIGHT = 600,
        image, api;

    var init = function(elem) {
            if (elem && typeof elem === 'string') {
                container = document.getElementById(elem);

                canvas = document.createElement('canvas');
                canvas.width = DEFAULT_WIDTH;
                canvas.height = DEFAULT_HEIGHT;
                container && container.appendChild(canvas);

                canvas.getContext && (ctx = canvas.getContext('2d'));
            }

            return this;
        },
        getterSetter = function(k, v) {
            if (typeof v === 'undefined') {
                return canvas[k];
            } else {
                canvas && (canvas[k] = v);
                return this;
            }
        },
        width = function(w) {
            return getterSetter.apply(this, ['width', Number(w)]);
        },
        height = function(h) {
            return getterSetter.apply(this, ['height', Number(h)]);
        },
        initImage = function(img) {
            var width = img.width, height = img.height,
                imageData = ctx.getImageData(0, 0, width, height),
                pixelArray = imageData.data;

            var dimensionMapper = function(x, y) {
                    return x * (width * 4) + (y * 4);
                },
                getPixelRGBA = function(x, y) {
                    var s = dimensionMapper(x, y);

                    return [pixelArray[s],
                            pixelArray[s + 1],
                            pixelArray[s + 2],
                            pixelArray[s + 3]];
                },
                setPixelRGBA = function(x, y, rgba) {
                    var s = dimensionMapper(x, y);

                    if (rgba && typeof rgba === 'object' && rgba.length === 4) {
                        pixelArray[s    ] = rgba[0];
                        pixelArray[s + 1] = rgba[1];
                        pixelArray[s + 2] = rgba[2];
                        pixelArray[s + 3] = rgba[3]
                    }
                };
            
            image = {
                width: width,
                height: height,
                pixelArray: pixelArray,
                pixel: function(x, y, fn) {
                    var oriRGBA, rstRGBA;
                        
                    oriRGBA = getPixelRGBA(x, y);
                    if (typeof fn === 'function') {
                        rstRGBA = fn(oriRGBA[0], oriRGBA[1], oriRGBA[2], oriRGBA[3]);
                        setPixelRGBA(x, y, rstRGBA);
                    } else {
                        return oriRGBA;
                    }
                },
                patch: function(left, top, right, bottom, fn) {
                    for (var x=left; x<right; ++x) {
                        for (var y=top; y<bottom; ++y) {
                            this.pixel(x, y, fn);
                        }
                    }
                },
                draw: function() {
                    ctx.putImageData(imageData, 0, 0);
                }
            };

            // core util
            image.util = {
                rgbToGray: function(r, g, b) {
                    var gray = Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
                    return gray;
                }
            };

            return this;
        },
        load = function(src) {
            if (typeof ctx === 'undefined') return;

            imageToLoad = new Image();
            imageToLoad.onload = function(evt) {
                ctx.drawImage(this, 0, 0);

                initImage(this);
                isImageLoaded = true;
            };
            imageToLoad.src = src;

            return this;
        },
        process = function(fn) {
            checkTimer = setInterval(function() {
                if (isImageLoaded) {
                    fn(image);
                    clearInterval(checkTimer);
                }
            }, 100);

            return this;
        };

    // public interface
    api = {
        /*
         * width {Number} : width of canvas (set)
         * @return {Number} : width of canvas (get)
         */
        width: width,
        /*
         * height {Number} : height of canvas (set)
         * @return {Number} : height of canvas (get)
         */
        height: height,
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

    // handy usage.
    var pixelIt = function(elem) {
        return init.apply(api, [elem]);
    };
    
    if (typeof window.pixelIt === 'undefined') {
        window.pixelIt = pixelIt;
    }

})(window);
