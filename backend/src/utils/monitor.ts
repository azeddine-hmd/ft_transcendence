import { sleep } from './delay';
import { writeFileSync } from 'fs';

export async function monitor(ms: number, fn: () => string) {
  while (true) {
    const data = fn();
    writeFileSync('./logs', data + '\n', {
      flag: 'a',
    });
    await sleep(ms);
  }
}
