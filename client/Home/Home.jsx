import React, {PropTypes} from 'react';
import Settings from './Settings.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      setting: false
    }
    this.changeSettingDisplay = this.changeSettingDisplay.bind(this)
    this.renderSetting = this.renderSetting.bind(this)
  }

  changeSettingDisplay() {
    this.setState({setting: !this.state.setting})
  }

  renderSetting() {
    if(this.state.setting === false){
      return (
      <div className="home">
        <div onClick={()=> this.props.display("play")} className="button">Play</div>
        <div onClick={this.changeSettingDisplay} className="button">Settings</div>
      </div>
      )
    } else {
      return (
      <div className="home">
        <Settings changeSettings={this.props.settings} done={this.changeSettingDisplay}/>
      </div>
      )
    }
  }

  render() {
    return(
      this.renderSetting()
    );
  }
}

export default Home;
