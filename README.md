# PixelIt

Making it more easy to process image by using HTML5 Canvas!
---

## Usage

    <img src="http://xxx.com/img.png" id="J_img">

    pixelIt('J_img', function (image) {
        // image is the enhanced image.
        image.all(function(r, g, b, a) {
            var gray = image.util.rgb2gray(r, g, b);
            return [gray, gray, gray, a - 100];
        });
    });

## Note

It is can be used in browser with HTML5 Canvas supported. :)

## API
    // add the util function
    pixelIt.addUtil('delta', function (v, rgba) {
      return [rgba[0] + v, rgba[1] + v, rgba[2] + v, rgba[3]];
    });

    // initialize (el is the image element or the id of the image element).
    pixelIt(el, function (image) {
        // here, the image is the enhanced image.
        console.log(image);

        // methods(if fn is passed, it is the processor; otherwise it is the accessor):
          //  - image.pixel(x, y, fn)
          //  - image.patch(x, y, w, h, fn)
          //  - image.all(fn)
          //  - image.reset()
          //  - the callback fn accept the (r,g,b,a) of the image, eg: fn(r, g, b, a);
                you need return the result (r,g,b,a) after processing, eg: return [rr, rg, rb, ra].

        // props:
          //  - image.get('width')
          //  - image.get('height')
          //  - image.get('imageData') (not recommend to operate this)

        // customs:
          //  - image.util

        image.all(function (r, g, b, a) {
            // you can access the util functions with image.
            return image.util.delta(-30, [r, g, b, a]);
        });

        // reset it(back to the original state)
        image.reset();

        // process it again
        image.all(function (r, g, b, a) {
            return image.util.delta(30, [r, g, b, a]);
        });

    });

