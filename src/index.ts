import { CommonTokenStream, CharStream, ParseTreeWalker } from "antlr4";
import fs from "node:fs/promises";
import { Command } from "commander";

import pkg from "../package.json";
import Lexer from "./antlr/mhrd/MHRDLexer";
import Parser, {
  ComponentContext,
  Input_busContext,
  Input_pinContext,
  Output_pinContext,
  InputsContext,
  OutputsContext,
  Output_busContext,
  PartsContext,
  Part_defineContext,
  WiresContext,
  Wire_defineContext,
  Pin_wire_defineContext,
  Bus_wires_defineContext,
} from "./antlr/mhrd/MHRDParser";
import Listener from "./antlr/mhrd/MHRDListener";
import AbstractVisitor from "./antlr/mhrd/MHRDVisitor";
import Component from "./domains/component";

class Visitor extends AbstractVisitor<Component> {}

class Walker extends Listener {
  enterInputs = (ctx: InputsContext) => {
    console.info(`开始解析 Inputs`);
  };

  exitInput_pin = (ctx: Input_pinContext) => {
    console.info(`定义输入引脚：`, ctx.getText());
  };
  exitInput_bus = (ctx: Input_busContext) => {
    console.info(`定义输入总线：`, ctx.getText());
  };

  enterOutputs = (ctx: OutputsContext) => {
    console.info(`\n开始解析 Outputs`);
  };

  exitOutput_pin = (ctx: Output_pinContext) => {
    console.info(`定义输出引脚：`, ctx.getText());
  };
  exitOutput_bus = (ctx: Output_busContext) => {
    console.info(`定义输出总线：`, ctx.getText());
  };

  enterParts = (ctx: PartsContext) => {
    console.info(`\n开始解析 Parts`);
  };

  exitPart_define = (ctx: Part_defineContext) => {
    const nameCtx = ctx.part_name();
    const typeCtx = ctx.component_name();
    console.info(`定义组件：${nameCtx.getText()}，类型：${typeCtx.getText()}`);
  };

  enterWires = (ctx: WiresContext) => {
    console.info(`\n开始解析 Wires`);
  };

  exitPin_wire_define = (ctx: Pin_wire_defineContext) => {
    const src = ctx.pin_src();
    const dest = ctx.pin_dest();
    console.info(`定义引脚连线：${src.getText()} -> ${dest.getText()}`);
  };
  exitBus_wires_define = (ctx: Bus_wires_defineContext) => {
    const src = ctx.bus_src();
    const dest = ctx.bus_dest();
    console.info(`定义总线连线：${src.getText()} -> ${dest.getText()}`);
  };
}

async function parse(input: string): Promise<ComponentContext> {
  const buffer = await fs.readFile(input);
  const source = buffer.toString("utf-8");
  const chars = new CharStream(source);
  const lexer = new Lexer(chars);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new Parser(tokenStream);
  return parser.component();
}

async function walk(input: string) {
  const context = await parse(input);
  const walker = new Walker();
  ParseTreeWalker.DEFAULT.walk(walker, context);
}

async function main() {
  const program = new Command("mhrd")
    .description(pkg.description)
    .version(pkg.version);

  program
    .command("parse")
    .argument("<input>", "输入文件")
    .option("-c, --components <dir>", "元件目录")
    .action((input, { components }) => {
      walk(input);
    });

  program.parse(process.argv);
}

main();
