import React, { Component } from 'react';
import './App.css';
import Loading from './components/Loading';


const AppContext = React.createContext();
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

class App extends Component {
  
  render() {
    return <React.Fragment>
        <h1>Manel</h1>
        <Loading></Loading>
      </React.Fragment>;
  }
}

export default App;
