import React, { Component } from "react";
export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("manel");
  }

  handleChange(event){

    this.props.onChangeValue(this.props.label, event.target.value);
    //this.setState({
      //value: event.target.value
    //})
    //const target =event.target;
    //console.log(target);
    //this.setState({ value: target.value })
    //this.props.onChangeValue(target,this.props.label)
    
    //event.persist();
    //console.log("tou no handle change da search bar");
    //console.log(this.state)
    //console.log(event);
    //console.log(event.nativeEvent)
    //this.setState({ value: event.nativeEvent.data });
    //console.log(this.state)
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
          value={this.props.value} 
          //onChange={this.handleChange}
          //onChange={this.handleChange.bind(this)}
          onChange={this.handleChange}
        />
      </React.Fragment>
    );
  }
}
