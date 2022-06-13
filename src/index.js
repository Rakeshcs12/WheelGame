import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
var canvas;
var ctx;
class App extends React.Component {
  state = {
    list: [
      "1+1=2",
      "2+2=6",
      "6+6=13",
      "10+10=20",
      "5+6=11",
      "9+3=15",
      "4+4=8",
      "50+50=110",
      "12+12=24"
    ],
    radius: 90,
    rotate: 0,
    easeOut: 2,
    angle: 0,
    top: null,
    offset: null,
    net: null,
    result: null,
    spinning: false
  };

  componentDidMount() {
    canvas = document.getElementById("wheel");
    ctx = canvas.getContext("2d");
    this.renderWheel(canvas,ctx);
    console.log("hiii")
  }

  renderWheel(canvas,ctx) {

    let numOptions = this.state.list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    this.setState({
      angle: arcSize
    });


    this.topPosition(numOptions, arcSize);


    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      let text = this.state.list[i];
      this.renderSector(i + 1, text, angle, arcSize, this.getColor(),canvas,ctx);
      angle += arcSize;
    }
  }

  topPosition = (num, angle) => {
    let topSpot = null;
    let degreesOff = null;
    if (num === 9) {
      topSpot = 7;
      degreesOff = Math.PI / 2 - angle * 2;
    } else if (num === 8) {
      topSpot = 6;
      degreesOff = 0;
    } else if (num <= 7 && num > 4) {
      topSpot = num - 1;
      degreesOff = Math.PI / 2 - angle;
    } else if (num === 4) {
      topSpot = num - 1;
      degreesOff = 0;
    } else if (num <= 3) {
      topSpot = num;
      degreesOff = Math.PI / 2;
    }

    this.setState({
      top: topSpot - 1,
      offset: degreesOff
    });
  };

  renderSector(index, text, start, arc, color,canvas,ctx) {
    
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let radius = this.state.radius;
    let startAngle = start;
    let endAngle = start + arc;
    let angle = index * arc;
    let baseSize = radius * 3.33;
    let textRadius = baseSize - 150;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = radius * 4;
    ctx.strokeStyle = color;

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.stroke();

    ctx.save();
    ctx.font = "Horizontal";

    ctx.translate(
      baseSize + Math.cos(angle - arc / 2) * textRadius,
      baseSize + Math.sin(angle - arc / 2) * textRadius
    );
    ctx.rotate(angle - arc / 360 / 1);
    ctx.fillText(text, -ctx.measureText(text).width / 25, 0);
    ctx.restore();
  }

  getColor() {

    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.4)`;
  }

  spin = () => {
    let randomSpin = Math.floor(Math.random() * 900) + 500;
    this.setState({
      rotate: randomSpin,
      easeOut: 2,
      spinning: true
    });


    setTimeout(() => {
      this.getResult(randomSpin);
    }, 2000);
  };
   
  //////////////new added//////////////////////////////////////

  getResult = spin => {
    const { angle, top, offset, list } = this.state;
    let netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
    let travel = netRotation + offset;
    let count = top + 1;
    while (travel > 0) {
      travel = travel - angle;
      count--;
    }
    let result;
    if (count >= 0) {
      result = count;
    } else {
      result = list.length + count;
    }

    // set state variable to display result
    this.setState({
      net: netRotation,
      result: result
    });
  };

  reset = () => {
    // reset wheel and result
    this.setState({
      rotate: 0,
      easeOut: 0,
      result: null,
      spinning: false
    });
  };

  render() {
    //////////////new added//////////////////////

////////////////////////////////////////////////////
    const handleclick1 = () => {
 
     
      console.log("Keep Spining the wheel",this.state.result)
      var checked = this.state.list;
      checked.splice(this.state.result, 1);
      this.setState({ list: checked });
      console.log(this.state.list);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.renderWheel(canvas,ctx);
      
    }


    return (

      <div className="App">
        <h1>Wheel Game</h1>
        <span id="selector">&#9660;</span>
        <canvas
          id="wheel"
          width="650"
          height="600"
          style={{
            WebkitTransform: `rotate(${this.state.rotate}deg)`,
            WebkitTransition: `-webkit-transform ${this.state.easeOut}s ease-out`
          }}
        />
       <button type="button" id="spin" onClick={this.spin}>
             spin
           </button>
        <div className="display">
          <span id="readout">
            Result:{"  "}
            <span id="result">{this.state.list[this.state.result]}</span>
          </span>
        </div>
        <button type = "button" id="handleclick" onClick={this.reset}>Correct</button>
    
    <button type = "button" id="handleclick1" onClick={handleclick1}>Incorrect</button>


      </div>
      
    );
    
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
