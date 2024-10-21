/*
import { Injectable, ConsoleLogger } from '@nestjs/common';
import { appendFile } from 'fs';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  logToFile(message: string) {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    appendFile('logs/app.log', logMessage, (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  }

  log(message: string) {
    super.log(message); // Log to console
    this.logToFile(message); // Log to file
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    this.logToFile(`Error: ${message} - ${trace}`);
  }
}
*/

import { Injectable, ConsoleLogger } from '@nestjs/common';
import { appendFile, existsSync, mkdirSync } from 'fs';
import { join } from 'path'; // Used to construct the log file path reliably

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private logDirectory = 'logs';
  private logFile = join(this.logDirectory, 'app.log'); // Path to the log file

  // Ensure the log directory exists, create if not
  private ensureLogDirectoryExists() {
    if (!existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory, { recursive: true });
      console.log(`Log directory created: ${this.logDirectory}`);
    }
  }

  // Method to log messages to the file
  logToFile(message: string) {
    this.ensureLogDirectoryExists(); // Ensure the log directory exists

    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    appendFile(this.logFile, logMessage, (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  }

  log(message: string) {
    super.log(message); // Log to console
    this.logToFile(message); // Log to file
  }

  error(message: string, trace: string) {
    super.error(message, trace); // Log error to console
    this.logToFile(`Error: ${message} - ${trace}`); // Log error to file
  }
}
