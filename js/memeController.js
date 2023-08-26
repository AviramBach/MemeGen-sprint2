'use strict'

let gElCanvas
let gCtx
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListeners()
    // resizeCanvas()

    renderMeme()
    renderGallery()
    renderSavedMemes()
    // renderCanvas()
    
    console.log('gCtx', gCtx)
}

// function renderCanvas() {
//     //Set the backgournd color to grey
//     gCtx.fillStyle = '#ede5ff'
//     //Clear the canvas,  fill it with grey background
//     gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
// }

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container')
//     gElCanvas.width = elContainer.offsetWidth
//     gElCanvas.height = elContainer.offsetHeight   
// }


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
    // window.addEventListener('resize', () => {
    //     resizeCanvas()
    //     renderMeme()
    // })
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

    // if (lines.length > 1) {
    //     lines.forEach((line) => {
    //         line.txt = newText
    //     })
    // }
    // lines[selectedLineIdx].txt = newText

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
    // const { selectedLineIdx, lines } = getMeme() 
    // lines[selectedLineIdx].size += 2

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

    // const { selectedLineIdx, lines } = getMeme()
    // if (lines[selectedLineIdx].size > 10) {
    //     lines[selectedLineIdx].size -= 2
    //     renderMeme()
    // }

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
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchmove', onMove)
    // gElCanvas.addEventListener('touchend', onUp)
}

function getEvPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
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
    } else {
        gMeme.lines.forEach((line) => {
            line.isSwitched = false
        })
    }
    renderMeme()
    // document.body.style.cursor = 'pointer'

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
    // if (lines.length === 1) {
    //     if (direction === 'up') {
    //         lines[0].pos.y = Math.max(lines[0].size / 2, lines[0].pos.y - 10)
    //     } else if (direction === 'down') {
    //         lines[0].pos.y = Math.min(canvasHeight - lines[0].size / 2, lines[0].pos.y + 10)
    //     }
    // }
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
    
    
    const randomText =  makeLorem(4)
    const randomFontSize = getRandomInt(15, 40)
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16)
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
    });

    
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
    const dataUrl = gElCanvas.toDataURL();
    const memeToSave = { dataUrl, lines: gMeme.lines };
    saveMemeToStorage(memeToSave);
    renderSavedMemes()
    alert('Meme saved successfully!');

}

function loadSavedMemes() {
    const savedMemes = loadFromStorage(STORAGE_KEY) || [];
    console.log('Saved Memes Loaded:', savedMemes); // Add this line
    return savedMemes;
}

// Display saved memes in the "Saved Memes" section
function renderSavedMemes() {
    const savedMemesContainer = document.querySelector('.saved-memes-container');
    savedMemesContainer.innerHTML = ''; // Clear existing content

    const savedMemes = loadSavedMemes();
    console.log('Rendering Saved Memes:', savedMemes); // Add this line

    savedMemes.forEach((meme, idx) => {
        const memeImg = new Image();
        memeImg.src = meme.dataUrl;
        memeImg.alt = `Saved Meme ${idx}`;
        savedMemesContainer.appendChild(memeImg);
    });
}

function addSavedMemeClickListener() {
    const savedMemesContainer = document.querySelector('.saved-memes-container');
    savedMemesContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            const savedMemes = loadSavedMemes();
            const clickedMemeIdx = Array.from(savedMemesContainer.children).indexOf(event.target);
            const clickedMeme = savedMemes[clickedMemeIdx];

            // Update gMeme with loaded meme data
            gMeme.lines = clickedMeme.lines;
            gMeme.selectedLineIdx = 0; // Assuming you want to select the first line

            // Render the loaded meme on the canvas
            renderMeme();
        }
    });
}


function loadMemeForEditing(meme) {
    gMeme = meme;
    renderMeme();
}