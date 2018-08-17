import { Log } from 'debug/log/log';
import { VerticalLogLayout } from 'debug/log/vertical-log-layout';
import { BoxedLogLayout } from 'debug/log/boxed-log-layout';
import { ConsoleLogLayout } from 'debug/log/console-log-layout';
import { HorizontalLogLayout } from 'debug/log/horizontal-log-layout';
import { LogLayout } from 'debug/log/log-layout';

export const logger = new Log(
  new ConsoleLogLayout([
    new BoxedLogLayout([
      new VerticalLogLayout([
        new HorizontalLogLayout([
          new LogLayout('summary'),
          new HorizontalLogLayout('tick'),
        ]),
        new LogLayout('counts'),
        new HorizontalLogLayout('test'),
        new LogLayout('creeps'),
        new LogLayout(''),
      ])
    ])
  ])
);

logger.cleanMap('creeps', logs => logs.slice(-5));
logger.cleanMap('', logs => logs.slice(-5));
