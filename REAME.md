# PixelIt

Making it more easy to process image by using HTML5 Canvas!
---

## Usage

    <div id="container"></div>

    pixelIt('container')
      .load('image.jpg')
      .process(function(image) {
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

    // initialize
    var imageWrapper = pixelIt(container);

    // load the image to process
    imageWrapper.load('imgae.jpg');

    // process it
    imageWrapper.process(function (image) {
      // methods(if fn is passed, it is the processor; otherwise it is the accessor):
      //  - image.pixel(x, y, fn)
      //  - image.patch(x, y, w, h, fn)
      //  - image.all(fn)

      // props:
      //  - image.width
      //  - image.height
      //  - image.pixelArray(not recommend to operate this)

      // customs:
      //  - util

      image.all(function (r, g, b, a) {
        // you can access the util functions with image!
        return image.util.delta(-30, [r, g, b, a]);
      });

    });

    // reset it(back to the original state)
    imageWrapper.reset();

    // process it again
    imageWrapper.process(function (image) {
      image.all(function (r, g, b, a) {
        return image.util.delta(30, [r, g, b, a]);
      });
    });