import React, { Component } from "react";
import SearchBar from "./SearchBar";
export default class SearchMusic extends Component {
  constructor(props) {
    super(props);
    this.state = { Artist: "" , Music: ""};

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log("tou no handle submit no search music")
    console.log(event);
    event.preventDefault();
    
    let response = fetch("http://127.0.0.1:5000/music?artist=eminem&music=kamikaze", {
      mode: "no-cors"})
    response = response.json()
    console.log(response);
    
  }

  handleChangeValue(id,new_value){
    console.log("tou no handle change value do search music")
    console.log(id);
    console.log(new_value);
    this.setState({[id]: new_value});
    console.log(this.state);
  }


  render() {
    return (
      <div className="container my-5">
        <h2>Search for a music</h2>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <SearchBar label="Artist" value={this.state.Artist} onChangeValue={this.handleChangeValue.bind(this)}/>
            <SearchBar label="Music" value={this.state.Music} onChangeValue={this.handleChangeValue.bind(this)} />
          </div>
          <button type="submit" class="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    );
  }
}
