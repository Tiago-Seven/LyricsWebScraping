import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import SearchMusic from "./components/SearchMusic";
import SearchAlbum from "./components/SearchAlbum"

const AppContext = React.createContext();
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar/>
        <h1 className="text-center">Get Stats for your favorite musics and albums</h1>
        <SearchMusic/>
        <SearchAlbum/>
      </React.Fragment>
    );
  }
}

export default App;
