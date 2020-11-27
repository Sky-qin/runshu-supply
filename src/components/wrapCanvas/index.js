import React from "react";
// import styles from "./index.css";
import "./index.scss";

class WrapCanvas extends React.Component {
  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas = () => {
    const { width = 20 } = this.props;

    let rwidth = (width / 100) * 65;

    const ctx = this.refs.canvas.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(rwidth, rwidth);
    ctx.moveTo(0, rwidth);
    ctx.lineTo(rwidth, 0);
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  render() {
    const { width = 20 } = this.props;
    console.log("cwidth", width);

    let cwidth = (width / 100) * 65;
    return (
      <div style={{ width, height: width }} className="cancel-icon">
        <canvas
          style={{ cursor: "pointer" }}
          ref="canvas"
          width={cwidth}
          height={cwidth}
        />
      </div>
    );
  }
}

export default WrapCanvas;
