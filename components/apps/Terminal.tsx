import React, { Component, ChangeEvent, KeyboardEvent, JSX } from "react";

// Define the types for props
interface TerminalProps {
  addFolder: (folderName: string) => void;
  openApp: (appId: string) => void;
}

// Define the types for state
interface TerminalState {
  terminal: JSX.Element[];
}

class Terminal extends Component<TerminalProps, TerminalState> {
  private cursor: number | undefined;
  private terminal_rows: number = 1;
  private current_directory: string = "~";
  private curr_dir_name: string = "root";
  private prev_commands: string[] = [];
  private commands_index: number = -1;
  private child_directories: Record<string, string[]> = {
    root: ["books", "projects", "personal-documents", "skills", "languages", "PDPU", "interests"],
    PDPU: ["Sem-6"],
    books: [
      "Eric-Jorgenson_The-Almanack-of-Naval-Ravikant.pdf",
      "Elon Musk: How the Billionaire CEO of SpaceX.pdf",
      "The $100 Startup_CHRIS_GUILLEBEAU.pdf",
      "The_Magic_of_Thinking_Big.pdf",
    ],
    skills: ["Front-end development", "React.js", "jQuery", "Flutter", "Express.js", "SQL", "Firebase"],
    projects: [
      "nishanthan-personal-portfolio",
      "synonyms-list-react",
      "economist.com-unlocked",
      "Improve-Codeforces",
      "flutter-banking-app",
      "Meditech-Healthcare",
      "CPU-Scheduling-APP-React-Native",
    ],
    interests: ["Software Engineering", "Deep Learning", "Computer Vision"],
    languages: ["Javascript", "C++", "Java", "Dart"],
  };

  constructor(props: TerminalProps) {
    super(props);
    this.state = { terminal: [] };
  }

  componentDidMount() {
    this.reStartTerminal();
  }

  componentDidUpdate() {
    if (this.cursor !== undefined) clearInterval(this.cursor);
    this.startCursor(this.terminal_rows - 2);
  }

  componentWillUnmount() {
    if (this.cursor !== undefined) clearInterval(this.cursor);
  }

  reStartTerminal = () => {
    if (this.cursor !== undefined) clearInterval(this.cursor);
    this.setState({ terminal: [] }, this.appendTerminalRow);
  };

  appendTerminalRow = () => {
    this.setState((prevState) => ({
      terminal: [...prevState.terminal, this.terminalRow(this.terminal_rows)],
    }));
    this.terminal_rows += 2;
  };

  terminalRow = (id: number) => (
    <React.Fragment key={id}>
      <div className="flex w-full h-5">
        <div className="flex">
          <div className="text-ubt-green">nishanthan@Asus</div>
          <div className="text-white mx-px font-medium">:</div>
          <div className="text-ubt-blue">{this.current_directory}</div>
          <div className="text-white mx-px font-medium mr-1">$</div>
        </div>
        <div
          id={`cmd-${id}`}
          onClick={() => this.startCursor(id)}
          className="bg-transparent relative flex-1 overflow-hidden"
        >
          <span id={`show-${id}`} className="float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
          <div id={`cursor-${id}`} className="float-left mt-1 w-1.5 h-3.5 bg-white"></div>
          <input
            id={`terminal-input-${id}`}
            data-row-id={id}
            onKeyDown={this.checkKey}
            onBlur={() => this.stopCursor(id)}
            className="absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent"
            spellCheck={false}
            autoFocus
            autoComplete="off"
            type="text"
          />
        </div>
      </div>
      <div id={`row-result-${id}`} className="my-2 font-normal"></div>
    </React.Fragment>
  );

  startCursor = (id: number) => {
    if (this.cursor !== undefined) clearInterval(this.cursor);

    const inputElement = document.getElementById(`terminal-input-${id}`) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
      inputElement.addEventListener("input", () => {
        const text = inputElement.value;
        const showElement = document.getElementById(`show-${id}`);
        if (showElement) showElement.textContent = text;
      });
    }

    this.cursor = window.setInterval(() => {
      const cursorElement = document.getElementById(`cursor-${id}`);
      if (cursorElement) {
        cursorElement.style.visibility = cursorElement.style.visibility === "visible" ? "hidden" : "visible";
      }
    }, 500);
  };

  stopCursor = (id: number) => {
    if (this.cursor !== undefined) clearInterval(this.cursor);
    const cursorElement = document.getElementById(`cursor-${id}`);
    if (cursorElement) cursorElement.style.visibility = "visible";
  };

  checkKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.currentTarget;
      const terminalRowId = Number(target.dataset.rowId);
      const command = target.value.trim();
      if (command.length === 0) return;

      this.removeCursor(terminalRowId);
      this.handleCommands(command, terminalRowId);

      // Push to command history
      this.prev_commands.push(command);
      this.commands_index = this.prev_commands.length - 1;

      target.value = ""; // Clear input
    }
  };

  removeCursor = (id: number) => {
    this.stopCursor(id);
    const cursorElement = document.getElementById(`cursor-${id}`);
    if (cursorElement) cursorElement.style.display = "none";
  };

  handleCommands = (command: string, rowId: number) => {
    let result = `Command '${command}' not found. Available commands: [ls, cd, pwd, echo, clear, exit, mkdir, code, spotify, chrome, settings]`;

    if (command === "clear") {
      this.reStartTerminal();
      return;
    }

    if (command === "exit") {
      return; // Close terminal logic
    }

    const resultElement = document.getElementById(`row-result-${rowId}`);
    if (resultElement) resultElement.innerHTML = result;
    this.appendTerminalRow();
  };

  render() {
    return (
      <div className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold" id="terminal-body">
        {this.state.terminal}
      </div>
    );
  }
}

export default Terminal;

export const displayTerminal = (addFolder: (folder: string) => void, openApp: (appId: string) => void): JSX.Element => {
  return <Terminal addFolder={addFolder} openApp={openApp} />;
};
