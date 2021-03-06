const socket = io()

const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')
const question = document.querySelector('.js-question')
const pause = document.querySelector('.pause')


const currentQuestionNumber = document.querySelector('.js-total-questions span')

const answers = document.querySelector('.js-answers')
const choices = document.querySelector('.js-choices')
const lock = document.querySelector('.js-lock')
const reveal = document.querySelector('.js-reveal')
const viewquestion = document.querySelector('.view-question')

lock.addEventListener('click', lockChoice)
reveal.addEventListener('click', revealAnswer)


let pauseTime = false

socket.on('connected', (data) => {
  pauseTime = data.pauseTime

  if (data.questionReady ) {
       displayChoices(data)
    }

})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(team => `<li>Team ${team}</li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})


pause.addEventListener('click', pauseTimer)
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

socket.on('question', (data) => {
    displayChoices(data)
})


 function displayChoices(data) {

    choices.innerHTML = ''
    viewquestion.innerHTML = ''
    if ( data.choices && data.choices.length ) {
        lock.disabled = false
        reveal.disabled = false
        viewquestion.innerHTML = data.question
        let html = '<ul class="view-answers host">';
        currentQuestionNumber.innerHTML = ~~data.currentQuestion+1

        data.choices.forEach( (answer, i) => {
            html += `<li>
                    <input  type="radio"
                            name="answer"
                            value="${answer}"
                            id="${answer}"
                    > <label for="${answer}" class="label">
                    ${answer}
                </label></li>`
         })
         html += `</ul> <p> <big>Answer: ${data.answer}</big></p>`
         choices.innerHTML = html

    }
}

function lockChoice(){
    let answer = document.querySelector('input[name="answer"]:checked')

    if (answer) {
        answer = answer.value
        disableChoice()
        socket.emit('lock', answer)
    }

}

function revealAnswer(){
    disableChoice()
    socket.emit('lock', '')
}

function disableChoice() {
    lock.disabled = true
    reveal.disabled = true
    document.querySelectorAll('input[name="answer"]').forEach( (input) =>{
        input.disabled = true
    })
}

function enableChoice() {
    lock.disabled = false
    reveal.disabled = false
    document.querySelectorAll('input[name="answer"]').forEach( (input) =>{
        input.disabled = false
    })
}