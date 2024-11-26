"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const todos_module_1 = require("./todos/todos.module");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const app_service_1 = require("./app.service");
const my_logger_module_1 = require("./my-logger/my-logger.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'dpg-cssaaphu0jms73e89el0-a',
                port: 5432,
                username: 'todos_app_db_1frl_user',
                password: 'LpuzpwJbu8XWDNHJndcemzW14K7mekBx',
                database: 'todos_app_db_1frl',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: true,
                extra: {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }
            }),
            auth_module_1.AuthModule,
            todos_module_1.TodoModule,
            user_module_1.UserModule,
            my_logger_module_1.MyLoggerModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map