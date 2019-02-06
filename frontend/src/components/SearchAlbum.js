import React, { Component } from "react";
import SearchBar from "./SearchBar";
export default class SearchMusic extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <h2>Search for an album</h2>
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <SearchBar label="Artist" />
            <SearchBar label="Album" />
          </div>
          <button type="submit" class="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    );
  }
}
