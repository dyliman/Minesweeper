import React, {PropTypes} from 'react';

class Play extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: []
    }
    this.generateBoard = this.generateBoard.bind(this);
    this.placeMines = this.placeMines.bind(this);
  }

  componentDidMount() {
    let difficulty = this.props.difficulty;
    if(difficulty === "easy"){
      this.generateBoard(10,10,25)
    } else if(difficulty === "medium") {
      this.generateBoard(15,15,50)
    } else if(difficulty === "hard") {
      this.generateBoard(20,20,100)
    } else if(difficulty === "custom") {
      this.generateBoard(this.props.custom[0], this.props.custom[1], this.props.custom[2])
    }
  }

  generateBoard(height, width, bombs) {
    var board = [];
    var boardRow = [];
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        boardRow.push(0);
      }
      board.push(boardRow);
      boardRow = [];
    }
    // board = placeMines(board, bombs)
    this.setState({board: board}); 
  }

  placeMines(board, bombs){
    let bombsLeft = bombs;
    while(bombsLeft !== 0){
      Math.random()
    }
    return board;
  }

  render() {
    return(
      <div className="play">
        {this.state.board}
      </div>
    )
  }
}

export default Play;
