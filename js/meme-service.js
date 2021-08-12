'use strict'
const KEY_MEMES = 'memes';
var gMeme;
var gColor = 'white';
var gColorLine = 'black';
var gFontFamily = 'impact';
var gAlign = 'center';
var gCurrLine = 0;
var gId = 0;
var gMemes = [];
var gLinesNoSticker = 0;

function creatMeme(id) {
    gId = 0;
    gLinesNoSticker = 0;
    gColor = 'white';
    gColorLine = 'black';
    gFontFamily = 'impact';
    gAlign = 'center';
    const canvasSize = getCanvasSize();
    const xPos = canvasSize.width / 2;
    const yPos = canvasSize.height / 8;
    let line = createLine(xPos, yPos);
    return {
        selectedImgId: id,
        selectedLineIdx: 0,
        lines: [line]
    }
}

function addLine() {
    gId++;
    gLinesNoSticker++;
    gMeme.selectedLineIdx = gMeme.lines.length;
    const canvasSize = getCanvasSize();
    let xPos = canvasSize.width / 2;
    let yPos = (gLinesNoSticker === 1) ? canvasSize.height - canvasSize.height / 8 : canvasSize.height / 2;
    let line = createLine(xPos, yPos);
    gMeme.lines.push(line);
}

function createLine(x, y, txt = 'Your Text Here', size = 40, align = 'center', color = gColor, colorLine = gColorLine, font = gFontFamily, widthTxt = 0) {
    return {
        id: gId,
        txt,
        size,
        align,
        color,
        colorLine,
        font,
        x,
        y,
        widthTxt
    }
}

function setMeme(meme) {
    gMeme = meme;
}

function getMeme() {
    return gMeme;
}

function setNewType(newColor, type) {
    gMeme.lines[gMeme.selectedLineIdx][type] = newColor;
}

function setPosition(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].x = x;
    gMeme.lines[gMeme.selectedLineIdx].y = y;
}

function _saveMemesToStorage(meme) {
    let memes = loadFromStorage(KEY_MEMES);
    if (memes) gMemes = memes;
    gMemes.push(meme);
    saveToStorage(KEY_MEMES, gMemes);
}

function removeLine() {
    if (gMeme.selectedLineIdx >= 0) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1);
        document.querySelector('.input-text').value = '';
        gMeme.selectedLineIdx = 0;
    }
}

function getCurrentLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getCurrentIdx() {
    return gMeme.selectedLineIdx;
}
