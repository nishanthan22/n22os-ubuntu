import React, { Component, createRef, RefObject } from "react";
import { Parser } from "expr-eval";
import { JSX } from "react/jsx-runtime";

interface CalcState {
  terminal: JSX.Element[];
}

interface Variables {
  [key: string]: number;
}

const parser = new Parser({
  operators: {
    add: true,
    concatenate: true,
    conditional: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,
    logical: false,
    comparison: false,
    in: false,
    assignment: true,
  },
});

class Calc extends Component<{}, CalcState> {
  private cursor: NodeJS.Timeout | null = null;
  private terminalRows = 2;
  private prevCommands: string[] = [];
  private commandsIndex = -1;
  private variables: Variables = {};
  private inputRefs: Record<number, RefObject<HTMLInputElement>> = {};

  constructor(props: {}) {
    super(props);
    this.state = { terminal: [] };
  }

  componentDidMount() {
    this.restartTerminal();
  }

  componentWillUnmount() {
    if (this.cursor) clearInterval(this.cursor);
  }

  restartTerminal = () => {
    if (this.cursor) clearInterval(this.cursor);
    this.setState({ terminal: [] }, this.appendTerminalRow);
  };

  appendTerminalRow = () => {
    const id = this.terminalRows;

    // ✅ Explicitly ensure a valid ref assignment
    if (!this.inputRefs[id]) {
      this.inputRefs[id] = createRef<HTMLInputElement>() as RefObject<HTMLInputElement>;
    }

    this.setState((prevState) => ({
      terminal: [...prevState.terminal, this.terminalRow(id)],
    }));
    this.terminalRows += 2;
  };

  terminalRow = (id: number) => {
    return (
      <div key={id} className="w-full">
        <div className="flex items-center">
          <span className="text-green-400">{";"}</span>
          <input
            ref={this.inputRefs[id]}
            className="bg-transparent outline-none text-white w-full"
            spellCheck={false}
            autoFocus
            autoComplete="off"
            onKeyDown={(e) => this.checkKey(e, id)}
          />
        </div>
        <div id={`row-calculator-result-${id}`} className="text-white"></div>
      </div>
    );
  };

  checkKey = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    const inputRef = this.inputRefs[id]?.current;
    if (!inputRef) return;

    if (e.key === "Enter") {
      const command = inputRef.value.trim();
      if (command.length !== 0) {
        this.handleCommands(command, id);
        this.prevCommands.push(command);
        this.commandsIndex = this.prevCommands.length - 1;
        inputRef.value = "";
      }
    } else if (e.key === "ArrowUp") {
      if (this.commandsIndex >= 0) {
        inputRef.value = this.prevCommands[this.commandsIndex] || "";
        this.commandsIndex--;
      }
    } else if (e.key === "ArrowDown") {
      if (this.commandsIndex < this.prevCommands.length - 1) {
        this.commandsIndex++;
        inputRef.value = this.prevCommands[this.commandsIndex] || "";
      }
    }
  };

  handleCommands = (command: string, rowId: number) => {
    let result = "";
    switch (command) {
      case "clear":
        this.restartTerminal();
        return;
      case "exit":
        return;
      case "help":
        result =
          "Available Commands: addition (+), subtraction (-), multiplication (*), division (/), exponentiation (^), modulo (%).";
        break;
      default:
        result = this.evaluateExpression(command);
    }
    document.getElementById(`row-calculator-result-${rowId}`)!.innerHTML = result;
    this.appendTerminalRow();
  };

  evaluateExpression = (command: string): string => {
    try {
      if (command.includes("=")) {
        const [variable, expression] = command.split("=").map((s) => s.trim());
        if (variable && expression) {
          this.variables[variable] = parser.evaluate(expression, this.variables);
          return `${variable} = ${this.variables[variable]}`;
        }
      }
      return parser.evaluate(command, this.variables).toString();
    } catch (e) {
      return "Invalid Expression";
    }
  };

  render() {
    return (
      <div className="h-full w-full bg-black text-white p-4">
        <p>Type "exit" to close, "clear" to reset, "help" for commands.</p>
        <div id="calculator-body">{this.state.terminal}</div>
      </div>
    );
  }
}

export default Calc;

export const displayTerminalCalc = () => {
  return <Calc />;
};
