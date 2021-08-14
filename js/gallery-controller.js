'use strict'

function init() {
    openGellary();
    renderImgs();
    loadKeyWords();
    renderKeywords();
    renderKeyWordsSearch();
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
    resetFilter();
    renderKeyWordsSearch();
    renderImgs();
    toggleMenu();
}

function onOpenMememsGallery() {
    openGellary();
    renderSavedImgs();
    toggleMenu();
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

function renderKeywords() {
    const keyWords = getKeyWords();
    let strHtmls = keyWords.map(function (keyWord) {
        return `<option value="${keyWord.word}">`
    })
    document.querySelector('#search').innerHTML = strHtmls.join('')
}

function renderKeyWordsSearch() {
    const keyWords = getKeyWords();
    let strHtmls = ``;
    for (let i = 0; i < 5; i++) {
        strHtmls += `<button class="btn-keyword" onclick="onKeyWord(this)" 
        style="font-size:${keyWords[i].search}rem">${keyWords[i].word}</button>`
    }
    document.querySelector('.key-words').innerHTML = strHtmls;
    let htmlCloseBtn = `<button data-trans="more" class="more-btn" onclick="onAllKeyWords()">More</button>`;
    document.querySelector('.key-words').innerHTML += htmlCloseBtn;
}

function onKeyWord(elKeyword) {
    onFilterKeyWord(elKeyword.innerText);
}

function onFilterKeyWord(keyWord) {
    setKeywordSearch(keyWord)
    setFilter(keyWord);
    renderImgs();
    renderKeyWordsSearch();
}

function onAllKeyWords() {
    const keyWords = getKeyWords();
    let strHtmls = keyWords.map(function (keyWord) {
        return `<button class="btn-keyword" onclick="onKeyWord(this)"
         style="font-size:${keyWord.search}rem">${keyWord.word}</button>`
    })
    document.querySelector('.key-words').innerHTML = strHtmls.join('');
    let htmlCloseBtn = `<button class = "btn-keyword-close" onclick="onCloseKeyWords()">X</button>`;
    document.querySelector('.key-words').innerHTML += htmlCloseBtn;
}

function onCloseKeyWords() {
    renderKeyWordsSearch();
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

const shareData = {
    title: 'MemeGen',
    text: 'This is Where your memes at!',
    url: window.location.href
}

const btn = document.querySelector('.btn-web-share');
btn.addEventListener('click', async () => {
    try {
        await navigator.share(shareData)
        console.log('Meme was shared successfully');
    } catch (err) {
        console.log('Error: ' + err);
    }
});

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}