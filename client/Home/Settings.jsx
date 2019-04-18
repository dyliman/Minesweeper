import React, {PropTypes} from 'react';

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      difficulty: "easy",
      custom: [8,8],
      customActive: false,
      customSelect: "button"
    }
    this.changeDifficulty = this.changeDifficulty.bind(this);
    this.customOptions = this.customOptions.bind(this);
    this.changeCustom = this.changeCustom.bind(this);
    this.difficulties = this.difficulties.bind(this);
  }

  changeDifficulty(event){
    let newDifficulty = event.target.getAttribute("name");
    if(newDifficulty === "custom"){
      let newClass = "button"
      if(this.state.customSelect === "button"){
        newClass = "button selected"
      }
      this.setState({customActive: !this.state.customActive, customSelect: newClass})
    } else {
      this.setState({difficulty: newDifficulty})
    }
  }

  changeCustom(event){
    let maxWidth = Math.floor(window.innerWidth / 25);
    let maxHeigth = Math.floor(window.innerHeight / 25);
    let change = event.target.getAttribute("name")
    let newSetting = this.state.custom
    let newValue = event.target.value.replace(/[^0-9]+/g, '')
    if(change === "height"){
      if(newValue > maxHeigth){
        newValue = maxHeigth;
      }
      newSetting[0] = newValue
    } else if(change === "width"){
      if(newValue > maxWidth){
        newValue = maxWidth;
      }
      newSetting[1] = newValue
    }
    event.target.value = newValue;
    this.setState({custom: newSetting})
  }

  customOptions(){
    if(this.state.customActive){
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
        </div>
      )
    }
  }

  difficulties() {
    let difficulty = ["Easy", "Medium", "Hard"]
    for(let i = 0; i < difficulty.length; i++){
      if(this.state.difficulty === difficulty[i]){
        difficulty[i] = <div name={`${difficulty[i]}`} onClick={this.changeDifficulty} className="button selected">{`${difficulty[i]}`}</div>
      } else {
        difficulty[i] = <div name={`${difficulty[i]}`} onClick={this.changeDifficulty} className="button">{`${difficulty[i]}`}</div>
      }
    }
    return difficulty.map((value)=>value)
  }

  render() {
    return(
      <div className="Settings">
        <div className="changeDifficulty">
            {this.difficulties()}
          <div>
            <div name="custom" onClick={this.changeDifficulty} className={this.state.customSelect}>Custom Size</div>
            {this.customOptions()}
          </div>
        </div>
        <div onClick={()=>{this.props.changeSettings(this.state.difficulty, this.state.customActive, this.state.custom); this.props.done();}} className="button">Save Settings</div>
      </div>
    )
  }
}

export default Settings;
