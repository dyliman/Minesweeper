import React, {PropTypes} from 'react';

class Play extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: [],
      bombs: 0,
      flags: 0,
      bombLocations: [],
      lose: false,
      win: false
    }
    this.generateBoard = this.generateBoard.bind(this); // generates the corret sized board with no mines placed
    this.placeMines = this.placeMines.bind(this); // places mines in random positions with a safety area of where the user clicks
    this.leftClick = this.leftClick.bind(this); // uncovers a space
    this.rightClick = this.rightClick.bind(this); // flags a space
    this.uncover = this.uncover.bind(this); // uncovers spaces untill there is a bomb beside the space
    this.checkBoard = this.checkBoard.bind(this); // checks the board to if the user has won or lost
    this.winLose = this.winLose.bind(this); // message/button displayed to the user if they want to return to the home page
  }

  componentDidMount() {
    let difficulty = this.props.difficulty;
    if(this.props.difficultyCustom) {
      this.generateBoard(this.props.custom[0], this.props.custom[1])
      let bombDensity = .16
      let bombs = Math.floor(this.props.custom[0] * this.props.custom[1] * bombDensity)
      this.setState({bombs: bombs})
    } else if(difficulty === "Easy"){
      this.generateBoard(8,8)
      this.setState({bombs: 10})
    } else if(difficulty === "Medium") {
      this.generateBoard(16,16)
      this.setState({bombs: 40})
    } else if(difficulty === "Hard") {
      this.generateBoard(16,30)
      this.setState({bombs: 99})
    }
  }

  generateBoard(height, width) {
    var board = [];
    var boardRow = [];
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        boardRow.push(<div key={`${i} ${j}`} name={`${i} ${j}`} className="hidden" onClick={this.placeMines}></div>);
      }
      board.push(boardRow);
      boardRow = [];
    }
    this.setState({board: board}); 
  }

  placeMines(event){
    let safeSpot = event.target.getAttribute("name").split(" ");
    let placeable = {};
    let board  = this.state.board;
    let bombs = this.state.bombs;

    for(let i = 0; i < board.length; i++){ // Setting Up Placeable Bomb spots so theres no duplicates
      for(let j = 0; j < board[i].length; j++){
        placeable[`${i} ${j}`] = `${i} ${j}`;
      }
    }

    safeSpot[0] = parseInt(safeSpot[0])
    safeSpot[1] = parseInt(safeSpot[1])
    for(let i = safeSpot[0]-1; i <= safeSpot[0]+1; i++){ // safe square for the first click
      for(let j = safeSpot[1]-1; j <= safeSpot[1]+1; j++){
        if(i >= 0 && i < board.length && j >= 0 && j < board[0].length){ //bounds for the box
          board[i][j] = <div key={`${i} ${j}`} name={`${i} ${j}`} className="hidden" onClick={this.leftClick} onContextMenu={this.rightClick}></div>;
        }
        delete placeable[`${i} ${j}`];
      }
    }

    let placeableArray = Object.values(placeable)
    let bombsLeft = bombs;
    while(bombsLeft !== 0){ // add bombs to random places
      let randomPlace = Math.floor(Math.random() * placeableArray.length)
      let position = placeableArray[randomPlace].split(" ");
      let row = position[0];
      let column = position[1];
      placeableArray.splice(randomPlace,1)
      this.state.bombLocations.push(`${row} ${column}`)
      board[row][column] = <div key={`${row} ${column}`} name={`${row} ${column}`} className="hidden bomb" onClick={this.leftClick} onContextMenu={this.rightClick}></div>;
      bombsLeft -= 1;
    }
    for(let i = 0; i < placeableArray.length; i++){ // remove onClick place mines from the rest of the positions
      let position = placeableArray[i].split(" ");
      let row = position[0];
      let column = position[1];
      board[row][column] = <div key={`${row} ${column}`} name={`${row} ${column}`} className="hidden" onClick={this.leftClick} onContextMenu={this.rightClick}></div>;
    }
    this.setState({board: board});
    this.uncover(safeSpot[0],safeSpot[1])
  }

  uncover(row, col) {
    let surroundingBombs = 0;
    for(let i = row-1; i <= row+1; i++){ // square to check for bombs
      for(let j = col-1; j <= col+1; j++){
        if(i >= 0 && i < this.state.board.length && j >= 0 && j < this.state.board[0].length){ //bounds for the box
          if(this.state.board[i][j].props.className.includes("bomb")){
            surroundingBombs += 1
          }
        }
      }
    }
    if(surroundingBombs === 0){
      for(let i = row-1; i <= row+1; i++){ // safe square for the first click
        for(let j = col-1; j <= col+1; j++){
          if(i >= 0 && i < this.state.board.length && j >= 0 && j < this.state.board[0].length){ //bounds for the box
            if(this.state.board[i][j].props.className === "hidden bomb"){
              //skip
            } else if (this.state.board[i][j].props.className === "visible"){
              //skip
            } else{
              this.state.board[row][col] = <div key={`${row} ${col}`} name={`${row} ${col}`} className="visible"></div>
              this.uncover(i,j);
            }
          }
        }
      }
    }
    if(surroundingBombs === 0) {
      surroundingBombs = ""
    }
    this.state.board[row][col] = <div key={`${row} ${col}`} name={`${row} ${col}`} className="visible">{`${surroundingBombs}`}</div>
    this.setState({board: this.state.board})
  }

  leftClick(event) {
    let nameOfClass = event.target.getAttribute("class")
    let currentPosition = event.target.getAttribute("name").split(" ")
    currentPosition[0] = parseInt(currentPosition[0])
    currentPosition[1] = parseInt(currentPosition[1])

    if(nameOfClass === "hidden bomb") {
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="visible bomb">B</div>
      this.setState({board: this.state.board})
    } else {
      this.uncover(currentPosition[0],currentPosition[1])
    }
    this.checkBoard();
  }

  rightClick(event) {
    event.preventDefault();
    let nameOfClass = event.target.getAttribute("class")
    let currentPosition = event.target.getAttribute("name").split(" ")
    currentPosition[0] = parseInt(currentPosition[0])
    currentPosition[1] = parseInt(currentPosition[1])
    if(nameOfClass === "hidden bomb") {
      this.state.flags += 1;
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden bomb flag" onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden bomb flag"){
      this.state.flags -= 1;
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden bomb" onClick={this.leftClick} onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden"){
      this.state.flags += 1;
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden flag" onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden flag"){
      this.state.flags -= 1;
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden" onClick={this.leftClick} onContextMenu={this.rightClick}></div>
    }
    this.setState({board: this.state.board, flags: this.state.flags})
    this.checkBoard()
  }

  checkBoard() {
    let uncovered = this.state.flags;
    for(let i = 0; i < this.state.board.length; i++){
      for(let j = 0; j < this.state.board[i].length; j++){
        if(this.state.board[i][j].props.className.includes("visible")){
          uncovered += 1
        }
        if(this.state.board[i][j].props.className === "visible bomb"){
          for(let k = 0; k < this.state.bombLocations.length; k++){
            let bombs = this.state.bombLocations[k].split(" ")
            bombs[0] = parseInt(bombs[0]);
            bombs[1] = parseInt(bombs[1]);
            this.state.board[bombs[0]][bombs[1]] = <div key={`${bombs[0]} ${bombs[1]}`} name={`${bombs[0]} ${bombs[1]}`} className="visible bomb lose">B</div>
            this.state.lose = true
            this.setState({lose: true})
          }
        }
      }
    }
    let squares = this.state.board.length * this.state.board[0].length
    if(uncovered === squares && this.state.lose === false) {
      this.setState({win: true})
    }
  }

  winLose() {
    let currentMessage = ""
    let buttonMessage = "Give Up D:"
    if(this.state.win){
      currentMessage = "Congratulations, You Win!!"
      buttonMessage = "Play Again?"
    } else if(this.state.lose){
      currentMessage = "Sorry, You Lose..."
      buttonMessage = "Try Again?"
    }
    return(
      <div>
        {currentMessage}
        <div onClick={() => this.props.display("home")} className="button">{buttonMessage}</div>
      </div>
    )
  }

  render() {
    return(
      <div className="play">
        <div>
          Remaining Flags: {this.state.bombs - this.state.flags}
        </div>
        <div>
          {this.state.board.map((row)=>{
            return (<div className="row">{row}</div>)
          })}
        </div>
        <div>
          {this.winLose()}
        </div>
      </div>
    )
  }
}

export default Play;
