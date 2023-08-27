'use strict'

let gElCanvas
let gCtx
let gIsDragging = false
let gDraggedLineIdx = -1
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderSavedMemes()
    addListeners()
    renderMeme()
    renderGallery()
    toggleArrowRotation()
}

function onShowSection(sectionId) {
    const sections = document.querySelectorAll('section')
    sections.forEach(section => {
        section.classList.add('hidden')
    })
    const targetSection = document.querySelector(`.${sectionId}`)
    targetSection.classList.remove('hidden')
    if (sectionId === 'saved') {
        renderSavedMemes()
    }
}

function addListeners() {
    addInputListeners()
    addChangeListeners()
    addMouseListeners()
    addTouchListeners()
    addSelectListeners()
    addSavedMemeClickListener()
    addMenuClickListeners()
    window.addEventListener('scroll', toggleArrowRotation)
}
function addMenuClickListeners() {
    const hamburgerMenu = document.querySelector('.hamburger-menu')
    const navLinks = document.querySelector('.link-bar')
    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active')
    })
}

function addSelectListeners() {
    const fontSelector = document.querySelector('.font-selector')
    fontSelector.addEventListener('change', onChangeFontFamily)
}

function addInputListeners() {
    const textInput = document.querySelector('.text-input')
    textInput.addEventListener('input', onSetTextInput)
}

function addChangeListeners() {
    const selectColor = document.querySelector("input[name='text-color']")
    selectColor.addEventListener('change', function () {
        onSetTextColor(selectColor.value)
    })
}

function onSetTextColor(selectedColor) {
    const { selectedLineIdx, lines } = getMeme()
    console.log(' getMeme()', getMeme())
    lines.forEach((line, idx) => {
        if (line.isSwitched === true) {
            line.color = selectedColor
            renderMeme()
            return
        }
    })

    if (lines.length === 1) {
        lines[0].color = selectedColor
    }
    console.log('selectedLineIdx', selectedLineIdx)
    renderMeme()
}

function onSetTextInput(event) {
    const newText = event.target.value
    const { selectedLineIdx, lines } = getMeme()

    lines.forEach((line, idx) => {
        if (line.isSwitched === true) {
            line.txt = newText
            renderMeme()
            return
        }
    })
    if (lines.length === 1) {
        lines[0].txt = newText
    }
    console.log('lines[selectedLineIdx].txt: ', lines[selectedLineIdx].txt)

    renderMeme()
}

function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()
    elLink.href = dataUrl
    elLink.download = 'my-meme'
}

function onIncreaseFontSize() {
    const { lines } = getMeme()
    lines.forEach((line) => {
        if (line.isSwitched === true) {
            line.size += 2
        }
    })

    if (lines.length === 1) {
        lines[0].size += 2
    }
    renderMeme()
}

function onDecreaseFontSize() {
    const { lines } = getMeme()
    lines.forEach((line) => {
        if (line.isSwitched === true) {
            if (line.size > 10) {
                line.size -= 2

            }
        }
    })
    if (lines.length === 1) {
        if (lines[0].size > 10) {
            lines[0].size -= 2
        }
    }
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)

}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
       
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = gMeme.lines.findIndex(line =>
        isPointInLineBounds(pos, line)
    )
    if (clickedLineIdx !== -1) {
        toggleLineSelection(clickedLineIdx)
        updateTextInputValue(clickedLineIdx)
        gIsDragging = true
        gDraggedLineIdx = clickedLineIdx
        document.body.style.cursor = 'grabbing'
    } else {
        gMeme.lines.forEach((line) => {
            line.isSwitched = false
        })
        updateTextInputValue(-1)
    }
    renderMeme()
    document.body.style.cursor = 'pointer'
}

function onMove(ev) {
    if (gIsDragging) {
        const pos = getEvPos(ev)
        gMeme.lines[gDraggedLineIdx].pos.x = pos.x
        gMeme.lines[gDraggedLineIdx].pos.y = pos.y
        renderMeme()
    }
}

function onUp() {
    gIsDragging = false
    gDraggedLineIdx = -1
    document.body.style.cursor = 'default'
}

function setLineSwitched(lineIdx, isSwitched) {
    gMeme.lines[lineIdx].isSwitched = isSwitched
}

function onMoveLine(direction) {
    const { lines } = getMeme()

    const canvasHeight = gElCanvas.height

    lines.forEach((line) => {

        if (line.isSwitched === true) {
            if (direction === 'up') {
                line.pos.y = Math.max(line.size / 2, line.pos.y - 10)
            } else if (direction === 'down') {
                line.pos.y = Math.min(canvasHeight - line.size / 2, line.pos.y + 10)
            }
        }
    })
    renderMeme()
}

function onDeleteLine() {
    const { lines } = getMeme()
    let indexToDelete
    lines.forEach((line, idx) => {
        if (line.isSwitched === true) {
            indexToDelete = idx
        }
    })
    if (indexToDelete !== -1) {
        lines.splice(indexToDelete, 1)
    }
    renderMeme()
}

function onTextAlign(align) {
    console.log('onTextAlign:', align)
    const { lines } = getMeme()
    lines.forEach((line) => {
        if (line.isSwitched === true) {
            line.alignment = align
            const textWidth = gCtx.measureText(line.txt).width;
            line.width = textWidth
            drawFrame(line.txt, line.size, line.alignment, line.pos.x, line.pos.y)
        }
    })
    renderMeme()
}

function onChangeFontFamily() {
    const fontSelector = document.querySelector('.font-selector')
    const selectedFont = fontSelector.value
    const { lines } = getMeme()

    lines.forEach((line) => {
        if (line.isSwitched === true) {
            line.font = selectedFont
        }
    })
    if (lines.length === 1) {
        lines[0].font = selectedFont
    }
    renderMeme()
}

function onFlexibleMeme() {
    clearCanvas()
    const { lines } = getMeme()
    const randomText = makeLorem(4)
    const randomFontSize = getRandomInt(15, 40)
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
    const randomAlignment = ['left', 'center', 'right'][getRandomInt(0, 3)]
    const randomImageId = getRandomInt(1, gImgs.length)
    const selectedImg = document.querySelector(`.img${randomImageId}`)
    if (selectedImg) {
        const prevImg = document.querySelector(`.img${gMeme.selectedImgId}`)
        if (prevImg) {
            prevImg.classList.remove('selected')
        }
        selectedImg.classList.add('selected')
        setImg(selectedImg)
    }
    lines.push({
        txt: randomText,
        size: randomFontSize,
        color: randomColor,
        isSwitched: false,
        alignment: randomAlignment,
        font: 'Impact',
        pos: { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
    })
    gMeme.selectedLineIdx = lines.length - 1
    renderMeme()
}

function clearCanvas() {
    const { lines } = getMeme()
    lines.length = 0
    gMeme.selectedLineIdx = 0

    const canvasWidth = gElCanvas.width
    const canvasHeight = gElCanvas.height
    gCtx.clearRect(0, 0, canvasWidth, canvasHeight)
}

function onSaveCanvas() {
    const dataUrl = gElCanvas.toDataURL()
    const memeToSave = { dataUrl, lines: gMeme.lines, id: gMeme.selectedImgIdSelected }
    saveMemeToStorage(memeToSave)
    renderSavedMemes()
    alert('Meme saved successfully!')
}

function loadSavedMemes() {
    const savedMemes = loadFromStorage(STORAGE_KEY) || []
    console.log('Saved Memes Loaded:', savedMemes)
    return savedMemes
}

function renderSavedMemes() {
    const savedMemesContainer = document.querySelector('.saved-memes-container')
    savedMemesContainer.innerHTML = ''
    const savedMemes = loadSavedMemes()

    savedMemes.forEach((meme, idx) => {
        const memeImg = new Image()
        memeImg.src = meme.dataUrl
        memeImg.alt = `Saved Meme ${idx}`
    
        savedMemesContainer.appendChild(memeImg)

        memeImg.addEventListener('click', () => {
            renderMeme()
        })
    })
}

function addSavedMemeClickListener() {
    const savedMemesContainer = document.querySelector('.saved-memes-container')
    savedMemesContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const savedMemes = loadSavedMemes()
            const clickedMemeIdx = Array.from(savedMemesContainer.children).indexOf(event.target)
            const clickedMeme = savedMemes[clickedMemeIdx]
            gMeme.lines = clickedMeme.lines
            gMeme.selectedLineIdx = 0 
            renderMeme()
        }
    })
}


