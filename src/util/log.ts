interface LogWindow {
  name: string;
  logs: string[][];
}

export class Log {

  private windows: { [name: string]: LogWindow } = {};
  private logs: string[][] = [];

  // Appends new named log window to given log window parent
  register(name: string) {
    if (!this.windows[name]) {
      this.windows[name] = { name, logs: [] };
    }
  }

  // Caches given log arguments
  log(...logs: string[]) {
    this.logs.push(logs);
    return log;
  }

  // Caches given log arguments
  logAt(window: string, ...logs: string[]) {
    if (!this.windows[window]) {
      this.register(window);
    }
    this.windows[window].logs.push(logs);
    return log;
  }

  // Dumps log cache to console
  dump() {
    if (this.logs.length) {
      console.log('Dump:', this.logs.reduce((dump, ls) => {
        const logs = ls.reduce((p, l) => {
          return p + (p ? ', ' : '' ) + `${l}`;
        }, '');
        return `${dump}; ${logs}`;
      }, ''));
      this.logs = [];
    }
    const windowNames = Object.keys(this.windows);
    if (windowNames.length) {
      console.log('Windows:', windowNames.reduce((dump, windowName) => {
        const win = this.windows[windowName];
        const logs = win.logs.reduce((p, l) => {
          return p + (p ? ', ' : '' ) + `${l}`;
        }, '');
        win.logs = [];
        return `${dump}; ${windowName}:: ${logs}`;
      }, ''));
    }
    return log;
  }

}

export const log = new Log();
