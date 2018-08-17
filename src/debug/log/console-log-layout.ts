import { Log } from 'debug/log/log';
import { LogLayout } from 'debug/log/log-layout';

export class ConsoleLogLayout extends LogLayout {

  output(log: Log): string {
    const output = super.output(log);
    console.log(output);
    return output;
  }

}
