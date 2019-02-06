import React, { Component } from "react";
import SearchBar from "./SearchBar";
export default class SearchMusic extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(event);
    let response = await fetch("http://127.0.0.1:5000/music?artist=eminem&music=kamikaze", {
      mode: "no-cors"})
    response = response.json()
    console.log(response);
    
  }

  render() {
    return (
      <div className="container my-5">
        <h2>Search for a music</h2>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <SearchBar label="Artist"/>
            <SearchBar label="Music" />
          </div>
          <button type="submit" class="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    );
  }
}
