import { Log } from 'debug/log/log';
import { LogLayout } from '@src/debug/log/log-layout';

const style = 'margin: -.5em;';
const styleAll = 'padding: .5em;';
const styleAllButFirst
  = 'border-top:1px solid white;';

export class VerticalLogLayout extends LogLayout {

  output(log: Log): string {
    const prefix = `<table style="${style}"><tr style=" margin:0;padding:0"><td style="${styleAll}">`;
    const delimiter = `</td></tr><tr><td style="${styleAll};${styleAllButFirst}">`;
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
