import { React } from "react";
import "./Dot.css";

let Dot = (props) => (
  <div className="dot" style={props.position}>
      <p style={{marginTop: 5}}>{props.number}</p>
  </div>
);


export default Dot