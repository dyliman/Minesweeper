import React, {PropTypes} from 'react';

class Play extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: [],
      bombs: 0,
    }
    this.generateBoard = this.generateBoard.bind(this);
    this.placeMines = this.placeMines.bind(this);
    this.leftClick = this.leftClick.bind(this);
    this.rightClick = this.rightClick.bind(this);
    this.uncover = this.uncover.bind(this);
  }

  componentDidMount() {
    let difficulty = this.props.difficulty;
    if(difficulty === "easy"){
      this.generateBoard(10,10)
      this.setState({bombs: 25})
    } else if(difficulty === "medium") {
      this.generateBoard(15,15)
      this.setState({bombs: 50})
    } else if(difficulty === "hard") {
      this.generateBoard(20,20)
      this.setState({bombs: 100})
    } else if(difficulty === "custom") {
      this.generateBoard(this.props.custom[0], this.props.custom[1])
      this.setState({bombs: this.props.custom[2]})
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
    this.state.board[row][col] = <div key={`${row} ${col}`} name={`${row} ${col}`} className="visible">{`${surroundingBombs}`}</div>
    this.setState({board: this.state.board})
  }

  leftClick(event) {
    let nameOfClass = event.target.getAttribute("class")
    let currentPosition = event.target.getAttribute("name").split(" ")
    currentPosition[0] = parseInt(currentPosition[0])
    currentPosition[1] = parseInt(currentPosition[1])

    if(nameOfClass === "hidden bomb") {
      console.log("You Lose")
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="visible bomb">B</div>
      this.setState({board: this.state.board})
    } else {
      this.uncover(currentPosition[0],currentPosition[1])
    }
  }

  rightClick(event) {
    event.preventDefault();
    let nameOfClass = event.target.getAttribute("class")
    let currentPosition = event.target.getAttribute("name").split(" ")
    currentPosition[0] = parseInt(currentPosition[0])
    currentPosition[1] = parseInt(currentPosition[1])
    if(nameOfClass === "hidden bomb") {
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden bomb flag" onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden bomb flag"){
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden bomb" onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden"){
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden flag" onContextMenu={this.rightClick}></div>
    } else if(nameOfClass === "hidden flag"){
      this.state.board[currentPosition[0]][currentPosition[1]] = <div key={`${currentPosition[0]} ${currentPosition[1]}`} name={`${currentPosition[0]} ${currentPosition[1]}`} className="hidden" onContextMenu={this.rightClick}></div>
    }
    this.setState({board: this.state.board})
  }

  render() {
    return(
      <div className="play">
        {this.state.board.map((row)=>{
          return (<div className="row">{row}</div>)
        })}
      </div>
    )
  }
}

export default Play;
