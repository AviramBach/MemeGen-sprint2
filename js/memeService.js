'use strict'

const STORAGE_KEY = 'memeDB'

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'politican'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dogs'] },
    { id: 3, url: 'img/3.jpg', keywords: ['cute', 'dogs'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'dogs'] },
    { id: 5, url: 'img/5.jpg', keywords: ['cute', 'dogs'] },
    { id: 6, url: 'img/6.jpg', keywords: ['cute', 'dogs'] },
    { id: 7, url: 'img/7.jpg', keywords: ['cute', 'dogs'] },
    { id: 8, url: 'img/8.jpg', keywords: ['cute', 'dogs'] },
    { id: 9, url: 'img/9.jpg', keywords: ['cute', 'dogs'] },
    { id: 10, url: 'img/10.jpg', keywords: ['cute', 'dogs'] },
    { id: 11, url: 'img/11.jpg', keywords: ['cute', 'dogs'] },
    { id: 12, url: 'img/12.jpg', keywords: ['cute', 'dogs'] },
    { id: 13, url: 'img/13.jpg', keywords: ['cute', 'dogs'] },
    { id: 14, url: 'img/14.jpg', keywords: ['cute', 'dogs'] },
    { id: 15, url: 'img/15.jpg', keywords: ['cute', 'dogs'] },
    { id: 16, url: 'img/16.jpg', keywords: ['cute', 'dogs'] },
    { id: 17, url: 'img/17.jpg', keywords: ['cute', 'dogs'] },
    { id: 18, url: 'img/18.jpg', keywords: ['cute', 'dogs'] }
]

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'First line over here',
            size: 30,
            color: 'white',
            isSwitched: false,
            alignment: 'center',
            font: 'Impact',
            pos: {
                x: 175,
                y: 30
            }
        }
    ]
}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function renderMeme() {
    const { selectedImgId, selectedLineIdx, lines } = getMeme()
    const img = new Image()
    img.src = gImgs[selectedImgId - 1].url

    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        renderLine(selectedLineIdx, lines)
    }
}

function renderLine(selectedLineIdx, lines) {
    lines.forEach((line, idx) => {
        const lineTxt = line.txt
        const lineSize = line.size
        const lineColor = line.color
        const lineIsSwitched = line.isSwitched
        const lineAlignment = line.alignment
        const lineFont = line.font
        const x = line.pos.x
        const y = line.pos.y
        const textWidth = gCtx.measureText(lineTxt).width
        line.width = textWidth
        line.height = lineSize 
        setLineTxt(lineTxt, lineSize, lineColor, lineIsSwitched, lineAlignment, lineFont, x, y)
    })
}

function setLineTxt(text, size, color, isSwitched, alignment, font, x = 80, y = 80) {
    gCtx.lineWidth = 1
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
    gCtx.textAlign = alignment
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)

    if (isSwitched) {
        drawFrame(text, size, alignment, x, y)
    }
}

function drawFrame(text, size, alignment, x, y) {
    const textWidth = gCtx.measureText(text).width
    const framePadding = 8
    const cornerRadius = 10

    const frameWidth = textWidth + 2 * framePadding;
    const frameHeight = size + 2 * framePadding;

    // Calculate frame position based on alignment

    if (alignment === 'left') {
        x = x - framePadding + frameWidth / 2
    } else if (alignment === 'right') {
        x = x + framePadding - frameWidth / 2
    } else {
        x = x
    }
    // const frameY = y - size / 2 - framePadding

    gCtx.beginPath()
    // gCtx.setLineDash([5, 5])
    gCtx.moveTo(x - textWidth / 2 - framePadding + cornerRadius, y - size / 2 - framePadding)
    gCtx.lineTo(x + textWidth / 2 + framePadding - cornerRadius, y - size / 2 - framePadding)
    gCtx.arc(x + textWidth / 2 + framePadding - cornerRadius, y - size / 2 - framePadding + cornerRadius, cornerRadius, -Math.PI / 2, 0)
    gCtx.lineTo(x + textWidth / 2 + framePadding, y + size / 2 + framePadding - cornerRadius);
    gCtx.arc(x + textWidth / 2 + framePadding - cornerRadius, y + size / 2 + framePadding - cornerRadius, cornerRadius, 0, Math.PI / 2)
    gCtx.lineTo(x - textWidth / 2 - framePadding + cornerRadius, y + size / 2 + framePadding);
    gCtx.arc(x - textWidth / 2 - framePadding + cornerRadius, y + size / 2 + framePadding - cornerRadius, cornerRadius, Math.PI / 2, Math.PI)
    gCtx.lineTo(x - textWidth / 2 - framePadding, y - size / 2 - framePadding + cornerRadius);
    gCtx.arc(x - textWidth / 2 - framePadding + cornerRadius, y - size / 2 - framePadding + cornerRadius, cornerRadius, Math.PI, -Math.PI / 2)
    gCtx.closePath();
    gCtx.strokeStyle = 'yellow'
    gCtx.stroke()
}

function setImg(elImg) {
    const imageId = elImg.dataset.id
    gMeme.selectedImgId = imageId
    renderMeme()
}

function addLine() {
    const { lines, selectedLineIdx } = getMeme()
    const canvasHeight = gElCanvas.height
    const canvasWidth = gElCanvas.width

    let newLineSize = 30
    let newLineColor = 'white'
    let yValue = canvasHeight / 2
    let xValue = canvasWidth / 2

    lines.push(
        {
            txt: 'This is another line',
            size: newLineSize,
            color: newLineColor,
            isSwitched: false,
            alignment: 'center',
            font: 'Impact',
            pos: { x: xValue, y: yValue }
        }
    )
    console.log(gMeme);
}

function switchLine() {
    const { selectedLineIdx, lines } = getMeme()
    console.log('selectedLineIdx', selectedLineIdx)

    lines.forEach((line) => {
        line.isSwitched = false
    })
    lines[selectedLineIdx].isSwitched = true

    if (selectedLineIdx < lines.length - 1) {
        gMeme.selectedLineIdx = selectedLineIdx + 1

    }
    if (selectedLineIdx === lines.length - 1) {
        gMeme.selectedLineIdx = 0
    }
    console.log('selectedLineIdx after', selectedLineIdx)
}

function isLineClicked(clickedPos) {
    const { lines } = getMeme() 

    for (let i = 0; i < lines.length; i++) {
        const { pos, size } = lines[i]
        const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
        console.log("clicked in line")
        if (distance <= size / 2) {
            console.log("clicked in line")
            return i
        }
    }
}

function isPointInLineBounds(point, line) {
    return (
        point.x >= line.pos.x - line.width / 2 &&
        point.x <= line.pos.x + line.width / 2 &&
        point.y >= line.pos.y - line.height / 2 &&
        point.y <= line.pos.y + line.height / 2
    )
}

function toggleLineSelection(lineIdx) {
    const { lines } = getMeme()

    lines.forEach((line, idx) => {
        line.isSwitched = idx === lineIdx
    })
}

function saveMemeToStorage(meme) {
    const savedMemes = loadFromStorage(STORAGE_KEY) || []
    savedMemes.push(meme)
    saveToStorage(STORAGE_KEY, savedMemes)
}

function loadMemeForEditing(meme) {
    gMeme = meme
    renderMeme()
    onShowSection('editor')
}

function updateTextInputValue(lineIdx) {
    const textInput = document.querySelector('.text-input')
    const { lines } = getMeme()

    if (lineIdx !== -1 && lineIdx < lines.length) {
        textInput.value = lines[lineIdx].txt
    } else {
        textInput.value = ''
    }
}
