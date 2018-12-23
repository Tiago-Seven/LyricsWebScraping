import React, { Component } from "react";

export default class Loading extends Component {
  render() {
    return (
      <div class="spinner">
        <div class="rect1" />
        <div class="rect2" />
        <div class="rect3" />
        <div class="rect4" />
        <div class="rect5" />
      </div>
    );
  }
}
