'use strict'

function init() {
    openGellary();
    renderImgs();
}

function openGellary() {
    let elGallery = document.querySelector('.gallery');
    elGallery.classList.remove('display');
    let elMemeEdit = document.querySelector('.meme-editor');
    elMemeEdit.classList.add('display');
    let elSocial = document.querySelector('.social-container');
    elSocial.classList.remove('display');
    let elFooter = document.querySelector('.footer');
    elFooter.classList.remove('display');
}

function openCanvas() {
    let elGallery = document.querySelector('.gallery');
    elGallery.classList.add('display');
    let elMemeEdit = document.querySelector('.meme-editor');
    elMemeEdit.classList.remove('display');
    let elSocial = document.querySelector('.social-container');
    elSocial.classList.add('display');
    let elFooter = document.querySelector('.footer');
    elFooter.classList.add('display');
}

function onBackToGallery() {
    openGellary();
    renderImgs();
}

function onOpenMememsGallery() {
    openGellary();
    renderSavedImgs();
}

function renderImgs() {
    const imgs = getImgsForDisplay();
    let strHtmls = imgs.map(function (img) {
        return ` <img onclick="onChooseMeme(this)" class="meme" 
        data-id=${img.id} src=${img.url} data-title= ${img.keywords}>`
    })
    document.querySelector('.image-gallery').innerHTML = strHtmls.join('')
}

function renderSavedImgs() {
    let memes = loadFromStorage(KEY_MEMES);
    if (!memes) document.querySelector('.image-gallery').innerText = 'No Saved Memes';
    else {
        let strHtmls = '';
        strHtmls = memes.map(function (meme) {
            return ` <img onclick="onSaveMeme(this)" class="meme" data-id='${meme.id}' src=${meme.img}>`
        })
        document.querySelector('.image-gallery').innerHTML = strHtmls.join('')
    }
}

function onChooseMeme(elMeme) {
    openCanvas();
    const memeId = +elMeme.dataset.id;
    clearInput();
    initCanvas();
    let meme = creatMeme(memeId);
    setMeme(meme);
    drawMeme();
}

function clearInput() {
    var elInput = document.querySelector('.input-text');
    elInput.value = '';
}

