import React from 'react';
import Nav from "./Nav"

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

class App extends React.Component{

  // 组件完成渲染后调用
  componentDidMount(){
  }
  render() {
    return (
        <div className="App">
          <CssBaseline />
          <Container maxWidth="xl">
            <Nav />
          </Container>
        </div>
    );
  }
}

export default App;
