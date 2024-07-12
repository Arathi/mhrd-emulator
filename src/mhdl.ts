import { readFile } from "node:fs/promises";
import { Command } from "commander";
import { CharStream, CommonTokenStream, ParseTreeWalker } from "antlr4";

import Lexer from "./antlr/mhdl/MHDLLexer";
import Parser, {
  DeclareBusContext,
  DeclareBusToBusContext,
  DeclarePartContext,
  DeclarePinContext,
  DeclarePinToPinContext,
  EndpointBusContext,
  EndpointBusPinContext,
  EndpointPartBusContext,
  EndpointPartBusPinContext,
  EndpointPartPinContext,
  EndpointPartSubBusContext,
  EndpointPinContext,
  EndpointSubBusContext,
} from "./antlr/mhdl/MHDLParser";
import AbstractListener from "./antlr/mhdl/MHDLListener";

import {
  Bus,
  Component,
  Endpoint,
  Pin,
  Port,
  PortMode,
} from "./components/basic";
import { PortType } from "./components/basic/types";
import Wire from "./components/basic/wire";

class Listener extends AbstractListener {
  component: Component;
  portMode?: PortMode;

  endpoint?: Endpoint;
  port?: Port;
  wire?: Wire;

  ports: Record<string, Port | undefined> = {};
  parts: Record<string, string> = {};

  constructor() {
    super();
    this.component = new Component();
  }

  enterInputs = () => {
    this.portMode = PortMode.Input;
  };
  exitInputs = () => {
    this.portMode = undefined;
  };

  enterOutputs = () => {
    this.portMode = PortMode.Output;
  };
  exitOutputs = () => {
    this.portMode = undefined;
    console.info(`端口声明完成：`, this.ports);
  };

  exitDeclarePin = (ctx: DeclarePinContext) => {
    const name = ctx.pinName().getText();
    const pin = new Pin(name, this.portMode!);
    console.info(`声明引脚：`, pin);
    this.ports[name] = pin;
  };

  exitDeclareBus = (ctx: DeclareBusContext) => {
    const name = ctx.busName().getText();
    const pinAmount = ctx.pinAmount();
    const pinIndexStart = ctx.pinIndexStart();
    const pinIndexEnd = ctx.pinIndexEnd();
    let start = 0;
    let end = 0;
    if (pinAmount !== undefined) {
      start = 1;
      end = parseInt(pinAmount.getText());
    } else if (pinIndexStart !== undefined && pinIndexEnd !== undefined) {
      start = parseInt(pinIndexStart.getText());
      end = parseInt(pinIndexEnd.getText());
    }
    const bus = new Bus(name, this.portMode!, start, end);
    console.info(`声明总线：`, bus);
    this.ports[name] = bus;
  };

  exitDeclarePart = (ctx: DeclarePartContext) => {
    const name = ctx.partName().getText();
    const type = ctx.partType().getText();
    console.info(`声明部件：${name}，类型：${type}`);
    this.parts[name] = type;
  };

  exitDeclarePinToPin = (ctx: DeclarePinToPinContext) => {
    const src = ctx.pinSrc();
    const dest = ctx.pinDest();
    // console.info(`声明引脚连接：${src.getText()} > ${dest.getText()}`);
  };

  exitDeclareBusToBus = (ctx: DeclareBusToBusContext) => {
    const src = ctx.busSrc();
    const dest = ctx.busDest();
    // console.info(`声明总线连接：${src.getText()} > ${dest.getText()}`);
  };

  enterPinSrc = () => {
    this.endpoint = Endpoint.Source;
  };

  exitPinSrc = () => {
    this.endpoint = undefined;
  };

  enterPinDest = () => {
    this.endpoint = Endpoint.Destination;
  };

  exitPinDest = () => {
    this.endpoint = undefined;
  };

  exitEndpointPin = (ctx: EndpointPinContext) => {
    const pinName = ctx.pinName().getText();
    console.info(`声明连接引脚端点：${pinName}`);
    const port = this.ports[pinName];

    if (port === undefined) {
      console.warn(`不存在的引脚：${pinName}`);
      return;
    }

    if (port.type !== PortType.Pin) {
      console.warn(`错误的类型：${pinName}不是引脚`);
      return;
    }

    // if (this.endpoint === Endpoint.Source) {
    //   this.portSrc = port;
    // } else if (this.endpoint === Endpoint.Destination) {
    //   this.portDest = port;
    // }
  };

  exitEndpointBusPin = (ctx: EndpointBusPinContext) => {
    const busName = ctx.busName().getText();
    const pinIndex = parseInt(ctx.pinIndex().getText());
    console.info(`声明连接引脚端点：${busName}[${pinIndex}]`);
    const port = this.ports[busName];

    if (port === undefined) {
      console.warn(`不存在的总线：${busName}`);
      return;
    }

    if (port.type !== PortType.Bus) {
      console.warn(`错误的类型：${busName}不是总线`);
      return;
    }
  };

  exitEndpointPartPin = (ctx: EndpointPartPinContext) => {
    const partName = ctx.partName().getText();
    const pinName = ctx.pinName().getText();
    console.info(`声明连接引脚端点：${partName}.${pinName}`);
    const part = this.parts[partName];

    if (part === undefined) {
      console.warn(`不存在的部件：${partName}`);
      return;
    }
  };

  exitEndpointPartBusPin = (ctx: EndpointPartBusPinContext) => {
    const partName = ctx.partName().getText();
    const busName = ctx.busName().getText();
    const pinIndex = parseInt(ctx.pinIndex().getText());
    console.info(`声明连接引脚端点：${partName}.${busName}[${pinIndex}]`);
    const part = this.parts[partName];

    if (part === undefined) {
      console.warn(`不存在的部件：${partName}`);
      return;
    }
  };

  exitEndpointBus = (ctx: EndpointBusContext) => {
    const busName = ctx.busName().getText();
    console.info(`声明连接总线端点：${busName}`);
  };

  exitEndpointSubBus = (ctx: EndpointSubBusContext) => {
    const busName = ctx.busName().getText();
    const pinIndexStart = parseInt(ctx.pinIndexStart().getText());
    const pinIndexEnd = parseInt(ctx.pinIndexEnd().getText());
    console.info(
      `声明连接总线端点：${busName}[${pinIndexStart}:${pinIndexEnd}]`
    );
  };

  exitEndpointPartBus = (ctx: EndpointPartBusContext) => {
    const partName = ctx.partName().getText();
    const busName = ctx.busName().getText();
    console.info(`声明连接总线端点：${partName}.${busName}`);
  };

  exitEndpointPartSubBus = (ctx: EndpointPartSubBusContext) => {
    const partName = ctx.partName().getText();
    const busName = ctx.busName().getText();
    const pinIndexStart = parseInt(ctx.pinIndexStart().getText());
    const pinIndexEnd = parseInt(ctx.pinIndexEnd().getText());
    console.info(
      `声明连接总线端点：${partName}.${busName}[${pinIndexStart}:${pinIndexEnd}]`
    );
  };
}

const program = new Command()
  .name("mhdl")
  .description("M. Hardware Description Language")
  .version("0.1.0");

program
  .command("parse")
  .description("解析")
  .argument("<input>", "输入文件")
  .option("-i, --include <path>", "其他组件目录")
  .action(parse);

interface ParseOptions {
  include?: string;
}
async function parse(input: string, { include }: ParseOptions) {
  console.info("开始解析：", input);
  if (include !== undefined) {
    console.info("包含目录：", include);
  }

  const buffer = await readFile(input);
  const mhdl = buffer.toString("utf-8");
  const chars = new CharStream(mhdl);
  const lexer = new Lexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new Parser(tokens);
  const tree = parser.component();
  const listener = new Listener();
  ParseTreeWalker.DEFAULT.walk(listener, tree);
}

program.parse(process.argv);
