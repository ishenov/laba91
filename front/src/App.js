import React, {Component, Fragment} from 'react';
import Toolbar from "./components/UI/Toolbar/Toolbar";
import {Container} from "reactstrap";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <Fragment>
        <header>
          <Toolbar/>
        </header>
        <Container style={{marginTop: '20px'}}>
          <Routes/>
        </Container>
      </Fragment>
    );
  }
}

export default App;
