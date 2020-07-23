import React from 'react';
import { bfs } from './Bfs'
import './App.css';

class Box extends React.Component {
  constructor(props) {
    super(props);
  }
  boxColor(val) {
    switch (val) {
      case 1: return "wall-box"
      case 2: return "start-box"
      case 3: return "end-box"
      case 4: return "traversed-box"
      case 5: return "path-box"
      default: return "box"
    }
  }

  render() {
    return (<div className={this.boxColor(this.props.val)} style={{ transitionDuration: this.props.dur  + "s",transitionDelay: this.props.dur + "s" }} onMouseDown={this.props.onClick} onMouseEnter={this.props.onDrag} ></div>)
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.prev_startpoint = null;
    this.prev_endpoint = null;
    this.transition = Array(10).fill().map(() => Array(10).fill(0.3));
    this.state = {
      mode: 'walls',
      grid: Array(10).fill().map(() => Array(10).fill(0)),
      mousedown: false,
    }
  }

  handleDrag = (x, y) => {
    if (this.state.mousedown && this.state.mode === "walls") {
      var temp = this.state.grid.map(function (arr) {
        return arr.slice();
      });
      temp[x][y] = temp[x][y] === 0 ? 1 : 0
      this.setState((state) => ({
        grid: temp
      }))
    }
  }
  handleClick = (x, y) => {
    var val = 1;
    var temp = this.state.grid.map(function (arr) {
      return arr.slice();
    });
    if (this.state.mode === "start") {
      val = 2;
      if (this.prev_startpoint != null) {
        temp[this.prev_startpoint.x][this.prev_startpoint.y] = 0;
      }
      this.prev_startpoint = { x: x, y: y }
    }
    if (this.state.mode === "end") {
      val = 3;
      if (this.prev_endpoint != null) {
        temp[this.prev_endpoint.x][this.prev_endpoint.y] = 0;
      }
      this.prev_endpoint = { x: x, y: y }
    }
    temp[x][y] = temp[x][y] === 0 ? val : 0
    this.setState((state) => ({
      grid: temp
    }))
  }
  handleMouse = (b) => {
    this.setState({ mousedown: b })
  }
  changeMode = (mode) => {
    this.setState({ mode: mode })
  }
  isActive(mode) {
    if (mode === this.state.mode) {
      return "active";
    }
    return "";
  }

  runBfs = () => {
    var [path, traversed_path] = bfs(this.state.grid, this.prev_startpoint)
    // var temp = this.state.grid.slice()
    // var temp = this.state.grid.map(function (arr) {
    //   return arr.slice();
    // });

    this.setState((state) => {
      var temp = state.grid;
      for (var i = 0; i < traversed_path.length; i++) {
        this.transition[traversed_path[i].x][traversed_path[i].y] = i * .1;
        temp[traversed_path[i].x][traversed_path[i].y] = 4;
      }
      return ({
        grid: temp
      })
    })
    var l = traversed_path.length
    var time = l*1000*.1
    console.log(time)
    setTimeout(() => {
      this.drawPath(path)
    }, time);
  }

  drawPath = (path) => {
    this.setState((state) => {
      var temp = state.grid;
      for (var i = 0; i < path.length; i++) {
        this.transition[path[i].x][path[i].y] = i * .1;
        temp[path[i].x][path[i].y] = 5
      }
      return ({
        grid: temp
      })
    })
  }

  render() {
    const boxes = this.state.grid.map((row, x) => {
      return (
        <div className="row">
          {
            row.map((n, y) => {
              return (
                <Box val={n} dur={this.transition[x][y]} onClick={() => { this.handleClick(x, y) }} onDrag={() => { this.handleDrag(x, y) }} ></Box>
              )
            })
          }
        </div>
      )
    })

    return (
      <div className="App">

        <div>
          <button className={this.isActive('start')} onClick={() => { this.changeMode('start') }} >Start</button>
          <button className={this.isActive('end')} onClick={() => { this.changeMode('end') }} >End</button>
          <button className={this.isActive('walls')} onClick={() => { this.changeMode('walls') }} >Walls</button>
          <button onClick={() => { this.runBfs() }}>Find Path</button>
        </div>
        <div onDragStart={(e) => { e.preventDefault(); return (false) }} onMouseDown={() => { this.handleMouse(true) }} onMouseUp={() => { this.handleMouse(false) }}>
          {
            boxes
          }
        </div>
      </div>
    )
  }
}

export default App;
