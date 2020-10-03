import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import SearchMusic from "./components/SearchMusic";
import SearchAlbum from "./components/SearchAlbum";
import Routes from "./routes"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./components/About";

const AppContext = React.createContext();
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Router>
          <Switch>
            <Route path="/about" component={About}></Route>
            <Route path="/music" component={SearchMusic}></Route>
            <Route path="/album" component={SearchAlbum}></Route>
          </Switch>
        </Router>    
      </React.Fragment>
    );
  }
}

export default App;
