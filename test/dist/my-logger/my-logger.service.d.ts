import { ConsoleLogger } from '@nestjs/common';
export declare class MyLoggerService extends ConsoleLogger {
    private logDirectory;
    private logFile;
    private ensureLogDirectoryExists;
    private logToFile;
    log(message: any, context?: string): Promise<void>;
    error(message: any, trace?: string): Promise<void>;
    warn(message: any, context?: string): Promise<void>;
}
