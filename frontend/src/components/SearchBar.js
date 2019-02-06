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
      <React.Fragment>
        <label for="exampleInputEmail1">{this.props.label}</label>
        <input
          class="form-control form-control-lg"
          type="text"
          className="form-control"
          placeholder="Search"
        />
      </React.Fragment>
    );
  }
}
