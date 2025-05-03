import chalk from 'chalk';

import { CliCommandInterface } from './cli-comand.interface.js';
import TSVFileReader from '../libs/file-reader/tsv-file-reader.js';
import { createOffer } from '../shared/helpers/offers.js';
import { getErrorMessage } from '../shared/helpers/common.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported`);
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: "${chalk.red(getErrorMessage(err))}"`);
    }
  }
}
