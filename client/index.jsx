import React, {PropTypes} from 'react';
import { render } from 'react-dom';
import Home from './Home/Home.jsx';
import Play from './Play/Play.jsx';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      difficulty: "easy", // easy/mid/hard/custom
      customSize: [1,1,0],
      display: "home" // home/game/end
    }

    this.conditionalRender = this.conditionalRender.bind(this);
    this.changeBoardSettings = this.changeBoardSettings.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
  }

  changeBoardSettings(difficulty, customSize){
    this.setState({difficulty: difficulty, customSize: customSize})
  }

  changeDisplay(display){
    this.setState({display: display})
  }

  conditionalRender(){
    let display = this.state.display;
    if(display === "home"){
      return (
        <Home settings={this.changeBoardSettings} display={this.changeDisplay}/>
      )
    } else if(display === "play"){
      return (
        <Play difficulty={this.state.difficulty} custom={this.state.customSize } display={this.changeDisplay}/>
      )
    } 
  }

  render() {
    return(
      <div className="minesweeper">
        {this.conditionalRender()}
      </div>
    )
  }
}

render(<App />, document.getElementById('App'));
