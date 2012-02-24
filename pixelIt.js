//alert('hello');

(function(window, undefined) {

    var pixelIt = function(elem) {
        var container, canvas, ctx,
            imageToLoad, isImageLoaded = false, checkTimer,
            x, y, $image;

        var init = function(elem) {
                if (elem && typeof elem === 'string') {
                    container = document.getElementById(elem);

                    canvas = document.createElement('canvas');
                    container && container.appendChild(canvas);

                    canvas.getContext && (ctx = canvas.getContext('2d'));
                }
            },
            initImage = function(img) {
                var width = img.width, height = img.height,
                    imageData = ctx.getImageData(x, y, width, height),
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
                
                // core
                $image = {
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
                    draw: function() {
                        ctx.putImageData(imageData, x, y);
                    }
                };

                // core util
                $image.util = {
                    rgb2gray: function(r, g, b) {
                        var gray = Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
                        return gray;
                    }
                };
            },
            resetCanvasSize = function(img) {
                var pad = 50,
                    width = img.width + pad, 
                    height = img.height + pad;
                    
                if (typeof container !== 'undefined') {
                    container.style.width = width + 'px';
                    container.style.height = height + 'px';

                    canvas.width = width;
                    canvas.height = height;
                }
            },
            drawToCenter = function(img) {
                x = (canvas.width - img.width) / 2;
                y = (canvas.height - img.height) / 2;

                ctx.drawImage(img, x, y);
            },
            load = function(src) {
                if (typeof ctx === 'undefined') return;

                imageToLoad = new Image();
                imageToLoad.onload = function(evt) {
                    resetCanvasSize(this);
                    drawToCenter(this);

                    initImage(this);

                    isImageLoaded = true;
                    imageToLoad.onload = null;
                };
                imageToLoad.src = src;

                return this;
            },
            process = function(fn) {
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

    if (typeof window.pixelIt === 'undefined') {
        window.pixelIt = pixelIt;
    }

})(window);
