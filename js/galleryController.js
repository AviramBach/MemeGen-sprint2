'use strict'


function renderGallery() {
    const galleryContainer = document.querySelector('.imgs-container')
    let strHTML = ''

    for (let i = 0; i < gImgs.length ;i++) {
        strHTML += `<img src="img/${i+1}.jpg" class="img${i+1}" data-id="${i+1}" onclick="onSelectImg(this)"/>`
    }
    galleryContainer.innerHTML = strHTML
}

function onSelectImg(elImg){

    const prevImg = document.querySelector(`.img${gMeme.selectedImgId}`)
    if (prevImg) {
        prevImg.classList.remove('selected');
    }
    const selectedImg  = document.querySelector(`.img${elImg.dataset.id}`)
    selectedImg.classList.add('selected')

    setImg(elImg)
    renderMeme()   
}
