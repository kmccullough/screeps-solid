import { Log } from 'debug/log/log';
import { LogLayout } from 'debug/log/log-layout';

const style
  = 'border: 1px solid white; '
  + 'padding: .5em';

export class BoxedLogLayout extends LogLayout {

  output(log: Log): string {
    return `<div style="${style}">${super.output(log)}</div>`;
  }

}
