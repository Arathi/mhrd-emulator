import { Level, PortMode, PortType } from "./types";

export default class Port {
  name: string;
  mode: PortMode;
  type: PortType;

  constructor(name: string, mode: PortMode, type: PortType) {
    this.name = name;
    this.mode = mode;
    this.type = type;
  }
}

export class Pin extends Port {
  index?: number;
  level?: Level;

  constructor(name: string, mode: PortMode) {
    super(name, mode, PortType.Pin);
  }
}

export class Bus extends Port {
  pins: Pin[];

  constructor(name: string, mode: PortMode, start: number, end: number) {
    super(name, mode, PortType.Bus);
    this.pins = [];
    for (let index = start; index <= end; index++) {
      const pin = new Pin(`${name}[${index}]`, mode);
      this.pins.push(pin);
    }
  }
}
