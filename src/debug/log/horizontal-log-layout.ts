import { Log } from 'debug/log/log';
import { LogLayout } from 'debug/log/log-layout';

const style = 'margin: -.5em;';
const styleAll = 'padding: .5em;';
const styleAllButFirst
  = 'border-left:1px solid white;';

export class HorizontalLogLayout extends LogLayout {

  output(log: Log): string {
    const prefix = `<table style="${style}"><tr><td style="${styleAll}">`;
    const delimiter = `</td><td style="${styleAll};${styleAllButFirst}">`;
    const suffix = '</td></tr></table>';
    return prefix
      + (
        this.layouts
          ? this.layouts.reduce((dump: string[], layout) => [
            ...dump,
            layout.output(log)
          ], [])
          : log.getAt(this.name!).reduce((dump, ls) => [
            ...dump,
            ls.reduce((p: string[], l: any) => [
              ...p, l
            ], []).join(', ')
          ], [])
      ).join(delimiter)
      + suffix;
  }

}
