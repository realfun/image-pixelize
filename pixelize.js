function clampWidthAndHeight(w, h) {
    var maxWidth = 600;
    var maxHeight = 600;
    var newW = w;
    var newH = h;
    if (w > h) {
        newW = Math.min(maxWidth, w);
        newH = h * newW / w;
    } else {
        newH = Math.min(maxHeight, h);
        newW = w * newH / h;
    }
    return [newW, newH];
}

// refer to: https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_getimagedata2
function pixelize(ctx1, w, h) {
    var board1 = document.getElementById('board1');
    var board2 = document.getElementById('board2');
    board1.width = w;
    board1.height = h;
    board2.width = w;
    board2.height = h;
    var ctxBoard1 = board1.getContext('2d');
    var ctxBoard2 = board2.getContext('2d');
    var grid = 10;
    var img1 = ctx1.getImageData(0, 0, w, h);
    for (var col1=0; col1<w; col1+=grid) {
        for (var row1=0; row1<h; row1+=grid) {
            var r = 0;
            var g = 0;
            var b = 0;
            var a = 0;
            for (var col2=0; col2<grid; col2++) {
                for (var row2=0; row2<grid; row2++) {
                    var offset = ((row1 + row2) * w + col1 + col2) * 4; //rgba
                    r += img1.data[offset+0];
                    g += img1.data[offset+1];
                    b += img1.data[offset+2];
                    a += img1.data[offset+3];
                }
            }
            r = r / grid / grid;
            g = g / grid / grid;
            b = b / grid / grid;
            a = a / grid / grid;
            ctxBoard1.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ',' + a + ')';
            ctxBoard1.fillRect(col1, row1, grid, grid);
            var gs = r * 0.2126 + g * 0.7152 + b * 0.0722;
            ctxBoard2.fillStyle = 'rgb(' + gs + ',' + gs + ',' + gs + ',' + a + ')';
            ctxBoard2.fillRect(col1, row1, grid, grid);
        }
    }
}

document.getElementById('load-button').onclick = function(){
    var imageUrl = document.getElementById('image-url').value;
    if (document.URL.indexOf('http://0.0.0.0:8000/') == 0) {
        imageUrl = 'http://0.0.0.0:8000/v1/image?image=' + imageUrl; //load from python proxy
    }
    var origin = document.getElementById('origin');
    var ctxOrigin = origin.getContext('2d');
    var img = new Image();
    img.setAttribute('crossOrigin', 'Anonymous');
    img.onload = function() {
      var wh = clampWidthAndHeight(img.width, img.height);
      origin.width = wh[0];
      origin.height = wh[1];
      ctxOrigin.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        wh[0],
        wh[1]);
      pixelize(ctxOrigin, wh[0], wh[1]);
    };
    img.src = imageUrl;
};

