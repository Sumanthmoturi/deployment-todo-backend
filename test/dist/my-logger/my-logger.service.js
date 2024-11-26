"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLoggerService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const fs_1 = require("fs");
const path = require("path");
let MyLoggerService = class MyLoggerService extends common_1.ConsoleLogger {
    constructor() {
        super(...arguments);
        this.logDirectory = path.join(__dirname, '..', '..', 'logs');
        this.logFile = path.join(this.logDirectory, 'myLogFile.log');
    }
    async ensureLogDirectoryExists() {
        try {
            if (!fs.existsSync(this.logDirectory)) {
                await fs_1.promises.mkdir(this.logDirectory, { recursive: true });
                console.log(`Log directory created: ${this.logDirectory}`);
            }
        }
        catch (e) {
            console.error('Failed to create log directory:', e instanceof Error ? e.message : e);
        }
    }
    async logToFile(entry) {
        const formattedEntry = `${new Date().toISOString()}\t${entry}\n`;
        await this.ensureLogDirectoryExists();
        try {
            await fs_1.promises.appendFile(this.logFile, formattedEntry);
        }
        catch (e) {
            console.error('Failed to write log:', e instanceof Error ? e.message : e);
        }
    }
    async log(message, context) {
        const entry = `${context ? `[${context}] ` : ''}${message}`;
        await this.logToFile(entry);
        super.log(message, context);
    }
    async error(message, trace) {
        const entry = `Error: ${message} - Trace: ${trace || 'N/A'}`;
        await this.logToFile(entry);
        super.error(message, trace);
    }
    async warn(message, context) {
        const entry = `Warning: ${message}`;
        await this.logToFile(entry);
        super.warn(message, context);
    }
};
exports.MyLoggerService = MyLoggerService;
exports.MyLoggerService = MyLoggerService = __decorate([
    (0, common_1.Injectable)()
], MyLoggerService);
//# sourceMappingURL=my-logger.service.js.map