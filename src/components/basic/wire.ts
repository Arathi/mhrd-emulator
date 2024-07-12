import Port from "./port";
import { Level } from "./types";

export default class Wire {
  src: Port | Level;
  dest: Port;

  constructor(src: Port, dest: Port) {
    this.src = src;
    this.dest = dest;
  }
}
