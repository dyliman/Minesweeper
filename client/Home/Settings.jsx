import React, {PropTypes} from 'react';

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      difficulty: "easy",
      custom: [1,1,0]
    }
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.customOptions = this.customOptions.bind(this);
    this.changeCustom = this.changeCustom.bind(this);
  }

  changeDifficulty(event){
    let newDifficulty = event.target.getAttribute("name");
    this.setState({difficulty: newDifficulty})
  }

  changeCustom(event){
    let change = event.target.getAttribute("name")
    let newSetting = this.state.custom
    let newValue = event.target.value
    if(change === "height"){
      newSetting[0] = newValue
    } else if(change === "width"){
      newSetting[1] = newValue
    } else if(change === "bomb"){
      newSetting[2] = newValue
    }
    this.setState({custom: newSetting})
  }

  customOptions(){
    if(this.state.difficulty === "custom"){
      return(
        <div>
          <div>
            Height
            <input name="height" onChange={this.changeCustom}></input>
          </div>
          <div>
            Width
            <input name="width" onChange={this.changeCustom}></input>
          </div>
          <div>
            Bombs
            <input name="bomb" onChange={this.changeCustom}></input>
          </div>
        </div>
      )
    }
  }

  render() {
    return(
      <div className="Settings">
        <div className="changeDifficulty">
          <div name="easy" onClick={this.changeDifficulty}>Easy</div>
          <div name="medium" onClick={this.changeDifficulty}>Medium</div>
          <div name="hard" onClick={this.changeDifficulty}>Hard</div>
          <div>
            <div name="custom" onClick={this.changeDifficulty}>Custom</div>
            {this.customOptions()}
          </div>
        </div>
        <div onClick={()=>{this.props.changeSettings(this.state.difficulty,this.state.custom); this.props.done();}}>Save Settings</div>
      </div>
    )
  }
}

export default Settings;
