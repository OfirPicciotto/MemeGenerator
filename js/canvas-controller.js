'use strict'
var gCanvas;
var gCtx;
var gDrag = false;
const STICKER_SIZE = 60;



function initCanvas() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    gCanvas.addEventListener("mousedown", startDrag);
    gCanvas.addEventListener("mousemove", drag);
    gCanvas.addEventListener("mouseup", finishDrag);
    gCanvas.addEventListener("touchmove", startDrag);
    gCanvas.addEventListener("touchmove", drag);
    gCanvas.addEventListener("touchend", finishDrag);

    if (window.innerWidth <= 550) {
        gCanvas.width = 350;
        gCanvas.height = 350;
    }
}

function drawMeme() {
    const meme = getMeme();
    var img = new Image();
    var myImgMeme = getImgById(meme.selectedImgId);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawText();
    }
    img.src = myImgMeme.url;
}

function drawText() {
    const meme = getMeme();
    meme.lines.forEach((line) => {
        const myText = line.txt;
        let mySize = line.size;
        let myAlign = line.align;
        let myColor = line.color;
        let myColorLine = line.colorLine;
        let yPos = line.y;
        let xPos = line.x;
        let font = line.font;
        gCtx.lineWidth = '2';
        gCtx.strokeStyle = myColorLine;
        gCtx.fillStyle = myColor;
        gCtx.font = `${mySize}px ${font}`;
        gCtx.textAlign = myAlign;
        gCtx.fillText(myText, xPos, yPos);
        gCtx.strokeText(myText, xPos, yPos);
    })
}

function getCanvasSize() {
    return { height: gCanvas.height, width: gCanvas.width };
}

function renderCanvas(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}

function onInputText(ev) {
    setNewType(ev.value, 'txt');
    drawMeme();
}

function onAddLine() {
    let elTxtInput = document.querySelector('.input-text');
    if (!elTxtInput.value) return;
    elTxtInput.value = '';
    addLine();
    drawMeme();
}

function onRemoveLine() {
    removeLine();
    drawMeme();
}

function onChangeFont(newFont) {
    setNewType(newFont, 'font');
    drawMeme();
}

function onChangeColor(newColor) {
    setNewType(newColor, 'color');
    drawMeme();
}

function startDrag(ev) {
    const meme = getMeme();
    let { offsetX, offsetY } = ev;
    if (ev.type === "touchmove") {
        ev.preventDefault();
        offsetX = ev.targetTouches[0].pageX;
        offsetY = ev.targetTouches[0].pageY;
        console.log(offsetX);
        console.log(offsetY);
    }
    const clickedLine = meme.lines.find(line => {
        return (offsetY <= line.y + line.size && offsetY >= line.y - line.size
            && offsetX <= line.x + line.widthTxt && offsetX > line.x - line.widthTxt)
    });

    if (!clickedLine) return;
    setCurrLineIdx(clickedLine.id);
    gDrag = true;
}

function finishDrag(ev) {
    if (!gDrag) return;
    drawSign();
    gDrag = false;
}

function drag(ev) {
    if (!gDrag) return;
    var { offsetX, offsetY } = ev;
    if (ev.type === "touchmove") {
        ev.preventDefault();
        offsetX = ev.targetTouches[0].pageX;
        offsetY = ev.targetTouches[0].pageY;
    }
    setPosition(offsetX, offsetY);
    drawMeme();
}


function onSaveMeme(elMeme) {
    let memeId = elMeme.dataset.id;
    let memeIdx = findOnSaveMemes(memeId);
    let memes = loadFromStorage(KEY_MEMES);
    gMeme = memes[memeIdx].gMeme;
    openCanvas();
    drawMeme();
}

function findOnSaveMemes(memeId) {
    let memes = loadFromStorage(KEY_MEMES);
    return memes.findIndex(meme => {
        return meme.id === memeId;
    })
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    var imgSrc = document.getElementById('imgData').src;
    var imgAlt = document.getElementById('imgData').getAttribute.alt;
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn share" href="//www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imgSrc)}&t=${encodeURIComponent(imgAlt)}"
        title="Share on Facebook" target="_blank" onclick="window.open('//www.facebook.com/sharer/sharer.php?u=
        ${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        Share   
        </a>`
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function onSave() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    var meme = {
        id: makeId(),
        img: imgContent,
        gMeme
    }
    _saveMemesToStorage(meme);
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
        var newImgId = addImg(img.src);
        var newMeme = creatMeme(newImgId);
        setMeme(newMeme);
    }
    reader.readAsDataURL(ev.target.files[0]);
}