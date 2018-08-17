import { Log } from 'debug/log/log';

export class LogLayout {

  protected name?: string;
  protected layouts?: LogLayout[];

  constructor(
    config: string | LogLayout[]
  ) {
    if (Array.isArray(config)) {
      this.layouts = config;
    } else {
      this.name = config;
    }
  }

  // Outputs log cache to console
  output(log: Log): string {
    const delimiter = '\n';
    return (
      this.layouts
        ? this.layouts.reduce((dump: string[], layout) => [
          ...dump,
          layout.output(log)
        ], [])
        : log.getAt(this.name!).reduce((dump, ls) => [
          ...dump,
          ls.reduce((p: string[], l: any) => [
            ...p, l
          ], []).join(' ')
        ], [])
    ).join(delimiter);
  }

}
