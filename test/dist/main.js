"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exception_filter_1 = require("./all-exception.filter");
const my_logger_service_1 = require("./my-logger/my-logger.service");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = app.get(my_logger_service_1.MyLoggerService);
    app.useLogger(logger);
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionsFilter(httpAdapter));
    app.use((req, _, next) => {
        const origin = req.get('origin');
        console.log('Incoming request from origin:', origin);
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: 'https://main.d2ad04cm30qoi2.amplifyapp.com',
        credentials: true,
        methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const port = process.env.PORT || 10000;
    await app.listen(port);
    logger.log(`Backend is running on http://localhost:${port} or on Render at https://deployment-todo-backend.onrender.com`);
}
bootstrap();
//# sourceMappingURL=main.js.map