const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')
const question = document.querySelector('.js-question')
const pause = document.querySelector('.pause')
const logo = document.querySelector('.js-logo')
const music = document.querySelector('.js-music')
const selection = document.querySelector('.js-selection')
const soundFX = document.querySelector('.js-fx')
const introMusic = document.querySelector('.js-intro-music')
const currentQuestionNumber = document.querySelector('.js-total-questions span')


const musicVol = document.querySelector('input[name="musicVol"]')
const currQuestion = document.querySelector('input[name="curQ"]')



musicVol.addEventListener('change', updateMusicVol)
currQuestion.addEventListener('change', updateCurrQuestion)

let pauseTime = false
let pauseMusic = true
let pauseSoundFX = false
let pauseIntroMusic = true



socket.on('connected', (data) => {
  pauseTime = data.pauseTime
  pauseMusic = data.pauseMusic
  pauseSoundFX = data.pauseSoundFX
  pauseIntroMusic = data.pauseIntroMusic

  if (data.questionReady ) {
       displayChoices(data)
    }

})

socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(team => `<li>Team ${team}</li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

logo.addEventListener('click', () => {
  socket.emit('logo')
})


pause.addEventListener('click', pauseTimer)
music.addEventListener('click', toogleMusic)
soundFX.addEventListener('click', toogleSoundFX)
introMusic.addEventListener('click', toogleIntroMusic)
selection.addEventListener('click', toogleSelection)
question.addEventListener('click', showQuestion)


function resetPause() {
    pauseTime = false
    pause.classList.remove('is-paused')
}

function pauseTimer() {
    pauseTime = !pauseTime
    socket.emit('pauseTime', pauseTime)
    if (pauseTime) {
        pause.classList.add('is-paused')
    } else {
        pause.classList.remove('is-paused')
    }
}

function toogleMusic() {
    pauseMusic = !pauseMusic
    socket.emit('pauseMusic', pauseMusic)
    if (pauseMusic) {
        music.classList.add('is-paused')
    } else {
        music.classList.remove('is-paused')
    }
}

function toogleIntroMusic() {
    pauseIntroMusic = !pauseIntroMusic
    socket.emit('pauseIntroMusic', pauseIntroMusic)
    if (pauseIntroMusic) {
        introMusic.classList.add('is-paused')
    } else {
        introMusic.classList.remove('is-paused')
    }
}

function toogleSoundFX() {
    pauseSoundFX = !pauseSoundFX
    socket.emit('pauseSoundFX', pauseSoundFX)
    if (pauseSoundFX) {
        soundFX.classList.add('is-paused')
    } else {
        soundFX.classList.remove('is-paused')
    }
}

function updateMusicVol() {
    socket.emit('volMusic', musicVol.value*0.01)
}

function updateCurrQuestion() {

    if (currQuestion.validity.valid) {
        socket.emit('updateCurrentQuestion', currQuestion.value-2)
    }

}

function toogleSelection() {
    allowSelection = !allowSelection
    socket.emit('allowSelection', allowSelection)
    if (allowSelection) {
        selection.classList.remove('is-paused')
    } else {
        selection.classList.add('is-paused')
    }
}

function showQuestion() {

    resetPause()
    socket.emit('showQuestion')
    socket.emit('questionClose')
}


socket.on('enableBuzzer', () => {
   enableChoice()
})

socket.on('disableBuzzer', () => {
   disableChoice()
})


socket.on('resetPause', () => {
   resetPause()
})

socket.on('introTrackEnd', () => {
    pauseIntroMusic = true
    introMusic.classList.add('is-paused')
})

socket.on('question', (data) => {
    displayChoices(data)
})


 function displayChoices(data) {

    currentQuestionNumber.innerHTML = ~~data.currentQuestion+1
    currQuestion.value = ~~data.currentQuestion+1

}

function disableChoice() {
    logo.disabled = true
}

function enableChoice() {
    logo.disabled = false

}