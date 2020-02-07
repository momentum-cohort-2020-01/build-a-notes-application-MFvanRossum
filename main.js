function print(value) {
    console.log(value)
    return value
}

function qs(selector) {
    return document.querySelector(selector)
}

function getAllNotes() {
    return fetch('http://localhost:3000/notes/', {
        method: 'GET'
    })
    .then(response => response.json())
}

function createNotesHTML(notes) {
    let notesStr = '<div id="notes-list">'
    for (const note of notes) {
        notesStr += createNoteHTML(note)
    }
    notesStr += '</div>'
    return notesStr
}

function createNoteHTML(note) {
    return `<div data-note-id="${note.id}">${note.note} <button class='delete'>Delete</button></div>`
}

function postNewNote(noteText) {
    return fetch('http://localhost:3000/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json '},
        body: JSON.stringify({ note: noteText, done: false, created: moment().format('MMM Do YYYY') })
    })
    .then(response => response.json())
}

function renderNotesList(notes) {
    console.log('renderNotesList', notes)
    const notesHTML = createNotesHTML(notes)
    const notesSection = qs('#notes')
    notesSection.innerHTML = notesHTML
}

function renderNewNote(note) {
    const noteHTML = createNoteHTML(note)
    const notesList = qs('#notes-list')
    notesList.insertAdjacentHTML('beforeend', noteHTML)
}

getAllNotes().then(renderNotesList)

qs('#new-notes-form').addEventListener('submit', event => {
    event.preventDefault()
    const noteTitleField = qs('#note-title')
    const noteTextField = qs('#note-text')
    const noteText = noteTitleField.value + '<br>' + noteTextField.value
    noteTextField.value = ''
    postNewNote(noteText).then(renderNewNote)
})

qs('#notes').addEventListener('click', event => {
    event.preventDefault()
    if (event.target.matches('.delete')) {
        print('delete ' + event.target.parentElement.dataset.noteId)
        return fetch (('http://localhost:3000/notes/' + event.target.parentElement.dataset.noteId),
        { method: 'DELETE' })
    } 
})