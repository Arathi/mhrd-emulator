import Port from "./port";
import { PortMode } from "./types";
import Wire from "./wire";

export default class Component {
  ports: Record<string, Port> = {};
  parts: Record<string, Component | string> = {};
  wires: Array<Wire> = [];

  get inputs(): Record<string, Port> {
    const inputs: Record<string, Port> = {};
    for (const name in this.ports) {
      const port = this.ports[name];
      if (port.mode === PortMode.Input) {
        inputs[name] = port;
      }
    }
    return inputs;
  }

  get outputs(): Record<string, Port> {
    const outputs: Record<string, Port> = {};
    for (const name in this.ports) {
      const port = this.ports[name];
      if (port.mode === PortMode.Output) {
        outputs[name] = port;
      }
    }
    return outputs;
  }

  tick() {
    //
  }
}
