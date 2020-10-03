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
    event.preventDefault();

    fetch(`/music?artist=${this.state.Artist}&music=${this.state.Music}`, { mode: "no-cors" }).then(res => {
      console.log(res);
      // your code
    })
    this.props.history.push('/about');
    //console.log(response)
    //response = response.json()
    //console.log(response);
    
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
