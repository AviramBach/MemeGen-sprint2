'use strict'


function renderGallery() {
    const galleryContainer = document.querySelector('.imgs-container')
    let strHTML = ''

    for (let i = 0; i < gImgs.length; i++) {
        strHTML += `<img src="img/${i + 1}.jpg" class="img${i + 1}" data-id="${i + 1}" onclick="onSelectImg(this)"/>`
    }
    galleryContainer.innerHTML = strHTML
}

function onSelectImg(elImg) {

    const prevImg = document.querySelector(`.img${gMeme.selectedImgId}`)
    if (prevImg) {
        prevImg.classList.remove('selected');
    }
    const selectedImg = document.querySelector(`.img${elImg.dataset.id}`)
    selectedImg.classList.add('selected')
    
    showModal()
    setImg(elImg)
    renderMeme()
}

function showModal() {
  var modal = document.querySelector(".modal")
  modal.style.display = "block"

  setTimeout(function() {
    modal.style.display = "none"
  }, 4000)
}

function toggleArrowRotation() {
    var modal = document.querySelector(".modal")
    var arrow = modal.querySelector(".arrow")
  
    if (window.scrollY <= 3) {
      modal.classList.add("show-top")
      arrow.style.transform = "rotate(90deg)"
    } else {
      modal.classList.remove("show-top");
      arrow.style.transform = "rotate(0deg)"
    }
  }
  
  
  