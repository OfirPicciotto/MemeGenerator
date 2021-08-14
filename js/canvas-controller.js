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

function onMoveUp() {
    const currLine = getCurrentLine();
    setPosition(currLine.x, currLine.y - 5)
    drawMeme();
}

function onMoveDown() {
    const currLine = getCurrentLine();
    setPosition(currLine.x, currLine.y + 5)
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

function onSwitchLines() {
    const meme = getMeme();
    console.log(meme);
    if (meme.selectedLineIdx === 0) {
        if (meme.lines.length > 0) meme.selectedLineIdx = meme.lines.length - 1;
    } else {
        meme.selectedLineIdx = meme.selectedLineIdx - 1;
    }
    document.querySelector('.input-text').value = meme.lines[gMeme.selectedLineIdx].txt;
}

function onChangeSize(newVal) {
    setNewType(newVal, 'size');
    drawMeme();
}


function onLeft() {
    const currLine = getCurrentLine();
    setPosition(currLine.x - 5, currLine.y);
    drawMeme();
}

function onCenter() {
    const currLine = getCurrentLine();
    setPosition(gCanvas.width / 2, currLine.y)
    drawMeme();
}

function onRight() {
    const currLine = getCurrentLine();
    setPosition(currLine.x + 5, currLine.y);
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

function onCreateSticker(sticker) {
    addSticker(gCanvas.width / 2, gCanvas.height / 2, sticker, STICKER_SIZE);
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

function onDownload(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function findOnSaveMemes(memeId) {
    let memes = loadFromStorage(KEY_MEMES);
    return memes.findIndex(meme => {
        return meme.id === memeId;
    })
}

function drawSign() {
    const currLineIdx = getCurrentIdx();
    const meme = getMeme();
    let width = meme.lines[currLineIdx].widthTxt;
    let height = meme.lines[currLineIdx].size * 1.2;
    let posX = meme.lines[currLineIdx].x - meme.lines[currLineIdx].widthTxt / 2;
    let posY = meme.lines[currLineIdx].y - meme.lines[currLineIdx].size;
    gCtx.beginPath();
    gCtx.rect(posX, posY, width, height);
    gCtx.strokeStyle = "black";
    gCtx.fillStyle = "rgb(0, 0, 0, 0.25)";
    gCtx.lineWidth = '2';
    gCtx.strokeRect(posX, posY, width, height);
    gCtx.fillRect(posX, posY, width, height);
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

function onSave() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    var meme = {
        id: makeId(),
        img: imgContent,
        gMeme
    }
    _saveMemesToStorage(meme);
}

