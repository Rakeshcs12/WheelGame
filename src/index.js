import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class App extends React.Component {
  state = {
    list: [
      "1+1=2",
      "2+2=4",
      "6+6=12",
      "10+10=20",
      "5+6=11",
      "9+3=12",
      "4+4=8",
      
      "50+50=100",
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
    this.renderWheel();
  }

  renderWheel() {

    let numOptions = this.state.list.length;
    let arcSize = (2 * Math.PI) / numOptions;
    this.setState({
      angle: arcSize
    });

  
    this.topPosition(numOptions, arcSize);


    let angle = 0;
    for (let i = 0; i < numOptions; i++) {
      let text = this.state.list[i];
      this.renderSector(i + 1, text, angle, arcSize, this.getColor());
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

  renderSector(index, text, start, arc, color) {
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
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
    ctx.lineWidth = radius * 4  ;
    ctx.strokeStyle = color;

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.stroke();

    ctx.save();
    ctx.font = "Horizontal";

    ctx.translate(
      baseSize + Math.cos(angle - arc / 2) * textRadius,
      baseSize + Math.sin(angle - arc / 2 ) * textRadius
    );
    ctx.rotate(angle - arc / 360  / 1);
    ctx.fillText(text, -ctx.measureText(text).width / 25, 0) ;
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

  reset = () => {

    this.setState({
      rotate: 0,
      easeOut: 0,
      spinning: false
    });
  };

  render() {
    const handleclick = () =>{
      console.log("Keep Spining the wheel")

    }

    const handleclick1 = () => 
    {
      console.log("delete from list and spin again")
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
        <button onClick={handleclick}>Correct</button>
        <button onClick={handleclick}>Inccorrect</button>
        {this.state.spinning ? (
          <button type="button" id="reset" onClick={this.reset}>
            reset
          </button>
        ) : (
          <button type="button" id="spin" onClick={this.spin}>
            spin
          </button>
        
        )}
        

      
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
