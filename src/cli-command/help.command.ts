import chalk from 'chalk';

import { CliCommandInterface } from './cli-comand.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
${chalk.bgCyan('Программа для подготовки данных для REST API сервера.')}

Пример: ${chalk.magenta('cli.js --<command> [--arguments]')}

Команды:

${chalk.gray(chalk.blue('--version'),'                    # выводит номер версии')}
${chalk.gray(chalk.blue('--help'),'                       # печатает этот текст')}
${chalk.gray(chalk.blue('--import <path>'),'              # импортирует данные из TSV')}
${chalk.gray(chalk.blue('--generate <n> <path> <url>'),'  # генерирует произвольное количество тестовых данных')}
        `);
  }
}
