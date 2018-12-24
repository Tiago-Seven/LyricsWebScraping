import React, { Component } from "react";
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("manel");
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label for="exampleInputEmail1">Search for an album</label>
            <input
              class="form-control form-control-lg"
              type="text"
              class="form-control"
              placeholder="Search"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    );
  }
}
