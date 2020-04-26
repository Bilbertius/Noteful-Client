import React, { Component } from 'react'
import ValidationError from '../ValidationError'
import NoteContext from '../NoteContext'
import config from '../config';
import './AddNote.css'


class AddNote extends Component {
  static contextType = NoteContext;
  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  validateNoteName(value){
    const name = value.trim();
    if (name.length === 0){
      return 'Name of note is required'
    } else {
      return false
    }
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }

  handleSubmit(e){
    e.preventDefault();
    //process input value here
    const noteName = e.target['note-name'].value;
    const noteContent = e.target['note-content'].value;
    const noteFolderId = e.target['note-folder'].value;


    
    const error = this.validateNoteName(noteName);

    if (error){
      this.setState({
        error
      })
    } else {
      //submit these values to the server here
      const url = `${config.API_ENDPOINT}/notes`
      const options = {
        method: 'POST',
        body: JSON.stringify({
          name: noteName,
          content: noteContent, 
          folder_id: noteFolderId,
          modified: new Date().toLocaleDateString()
        }),
        headers: {'Content-Type' : 'application/json'}
      }
      fetch(url, options)
      .then(res => {
        if (!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/notes/${note.id}`)
      })
      .catch(err => console.log(err.message))
    }
  }

  render(){
    const {folders} = this.context;
    const options = folders.map(folder => {
      return <option key={folder.id} value={folder.id}>{folder.name}</option>
    })
    
    return(
      <form className='add-note-form' onSubmit={(e) => this.handleSubmit(e)}>
        <h2>Add a Note</h2>
        <div className='form-group'>
          <label htmlFor='note-name'>Name of Note: </label>
          <input type='text' className='note-name' id='note-name' name='note-name' onChange={() => this.setState({error: null})}/>
          {this.state.error && (<ValidationError message={this.state.error} clearError={this.clearError}/>)}
          <div className='textarea-content'>
            <label htmlFor='note-content'>Note content: </label>
            <textarea className='note-content' id='note-content' name='note-content' rows='5'/>
          </div>
          <label htmlFor='note-folder'>Folder: </label>
          <select id='note-folder' className='note-folder' name='note-folder'>
            {options}
          </select>
        </div>
        <div className="add-note-button-group">
        <button type="reset" className="add-note-button" onClick={() => this.props.history.push('/')}>
            Cancel
        </button>
        <button type="submit" className="add-note-button" disabled={this.state.error}>
            Add Note
        </button>
       </div>
      </form>
    )
  }
}

export default AddNote;