import chalk from 'chalk';

import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-comand.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  public execute(filename: string): void {
    try {
      if (!filename) {
        throw new Error('не указан путь к файлу для импорта.');
      }
      const fileReader = new TSVFileReader(filename.trim());
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(
        `Не удалось импортировать данные из файла по причине: ${chalk.red(
          err.message
        )}`
      );
    }
  }
}
