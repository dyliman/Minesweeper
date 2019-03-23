import React, {PropTypes} from 'react';
import Settings from './Settings.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className="home">
        <div onClick={()=> this.props.display("play")}>Play</div>
        <Settings changeSettings={this.props.settings}/>
      </div>
    )
  }
}

export default Home;
