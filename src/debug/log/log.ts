import { LogLayout } from '@src/debug/log/log-layout';

export class Log {

  protected logs: { [name: string]: any[] } = {};
  protected cleanMaps: { [name: string]: (logs: any[][]) => any[] } = {};

  constructor(
    protected logLayout: LogLayout = new LogLayout('')
  ) {

  }

  log(...logs: any[]) {
    return this.logAt('', ...logs);
  }

  logAt(name: string, ...logs: any[]) {
    this.logs[name] = [
      ...this.getAt(name),
      logs.map(l => '' + l)
    ];
    return this;
  }

  getAt(name: string): any[] {
    return this.logs[name || ''] || [];
  }

  dump() {
    this.logLayout.output(this);
    this.clean();
    return this;
  }

  clean() {
    Object.keys(this.logs).forEach(name => {
      if (this.cleanMaps[name]) {
        this.logs[name]
          = this.cleanMaps[name](this.logs[name]);
      } else {
        delete this.logs[name];
      }
    });
    return this;
  }

  cleanMap(name: string, map: (logs: any[]) => any[]) {
    this.cleanMaps[name] = map;
    return this;
  }

}
