let editTextBox = qs('#note-text')
let editInput = qs('edit-text')
var newInput = document.createElement('input')
var newForm = document.createElement('form')

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
    return `<div data-note-id="${note.id}">${note.note} <br><button class="edit">Edit</button><button class="delete">Delete</button></div>`
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
        return fetch ('http://localhost:3000/notes/' + event.target.parentElement.dataset.noteId),
        { method: 'DELETE'}
    } 
})

function deleteThisNote(noteId) {
    return fetch('http://localhost:3000/notes/' + noteId, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({note: noteId, done: false, created: moment().format('MMM Do YYYY')})
    })
    .then(response => response.json())
}

function deleteNote() {
    qs('#notes').addEventListener('click', event=> {
        if (event.target.matches('.delete')) {
            let noteId = (event.target.parentElement.dataset.noteId)
            deleteThisNote(noteId)
        }
    })
}

function editThisNote(noteId, editedNote) {
    return fetch('http://localhost:3000/notes/' + noteId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({note: editedNote.value, done: false, edited: moment().format('MMM Do YYYY')})
    })
    .then(response => response.json())
}

function editNote() {
    qs('#notes').addEventListener('click', event => {
        if (event.target.matches('.edit')) {
            event.preventDefault();
            event.target.parentElement.classList.add('noteToEdit')
            event.target.parentElement.value=''
            let newEditForm = event.target.parentElement.appendChild(newForm)
            let editedNote = newEditForm.appendChild(newInput)
            editedNote.parentElement.classList.add('editClass')
                qs(".editClass").addEventListener('submit', event=>{
                    event.preventDefault();
                    let noteId = (event.target.parentElement.dataset.noteId)
                    editThisNote(noteId, editedNote)
                })
        }
    }, false 
    )
}

deleteNote()
editNote()