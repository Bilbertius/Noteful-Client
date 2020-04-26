import React, { Component } from 'react'
import ValidationError from '../ValidationError'
import NoteContext from '../NoteContext'
import config from '../config';
import './AddFolder.css';

class AddFolder extends Component {
  static contextType = NoteContext;
  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  validateFolderName = (value) => {
    const name= value.trim();
    if (name.length === 0){
      return 'Name of folder is required'
    } else {
      return false
    }
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    

    //process input value here
    const folderName = event.target['folder-name'].value;
    const folder = {
      name: folderName,
    }

    const error = this.validateFolderName(folderName);
    this.setState({ error: null })
    if (error){
      this.setState({
        error
      }) 
    } else {
      //submit these values to the server here
      const url = `${config.API_ENDPOINT}/folders`;
      const options = {
        method: 'POST',
        body: JSON.stringify(folder),
        headers: {'Content-Type': 'application/json'}
      }
      fetch(url, options)
      .then(res => {
        if(!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(folder => {
        this.context.addFolder(folder)
        //where Router comes into play to push the user to the foler id url
        this.props.history.push(`/folders/${folder.id}`)
      })
      .catch(err => console.log(err.message)) 
    }
  }

  render(){
    
    return(
      <form className='add-folder-form' onSubmit={(event) => this.handleSubmit(event)}>
        <h2>Add a Folder</h2>
        <div className='form-group'>
          <label htmlFor='folder-name'>Name of folder:</label>
          <input type='text' className='folder-name' id='folder-name' name='folder-name' onChange={() => this.setState({error:null})}/>
          {this.state.error && (<ValidationError message={this.state.error} clearError={this.clearError}/>)}
        </div>
        <div className="add-folder-button-group">
        <button type="reset" className="add-folder-button" onClick={() => this.props.history.goBack()}>
            Cancel
        </button>
        <button type="submit" className="add-folder-button" disabled={this.state.error}>
            Add Folder
        </button>
       </div>
      </form>
    )
  }
}

export default AddFolder;