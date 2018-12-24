import React, { Component } from "react";
import "./App.css";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";

const AppContext = React.createContext();
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Loading />
        <SearchBar/>
      </React.Fragment>
    );
  }
}

export default App;
