"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const todos_service_1 = require("./todos.service");
const create_todo_dto_1 = require("../auth/dto/create-todo.dto");
const my_logger_service_1 = require("../my-logger/my-logger.service");
let TodoController = class TodoController {
    constructor(todoService, myLoggerService) {
        this.todoService = todoService;
        this.myLoggerService = myLoggerService;
    }
    async create(body, res) {
        try {
            await this.myLoggerService.log('Todo creation data received', 'TodoController');
            const todo = await this.todoService.create(body);
            await this.myLoggerService.log(`Todo created successfully with name: ${todo.name}`, 'TodoController');
            return res.status(common_1.HttpStatus.CREATED).json({
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Todo created successfully',
                data: todo,
            });
        }
        catch (error) {
            await this.myLoggerService.error('Todo creation failed', error.stack);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Todo creation failed',
                error: error.message,
            });
        }
    }
    async findAll(res, status) {
        try {
            await this.myLoggerService.log('Fetching todos', 'TodoController');
            const todos = await this.todoService.findAll(status);
            console.log("Fetch Todos", todos);
            await this.myLoggerService.log(`Found ${todos.length} todos with status: ${status || 'all'}`, 'TodoController');
            return res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                message: `Found ${todos.length} todos`,
                data: todos,
            });
        }
        catch (error) {
            await this.myLoggerService.error('Fetching todos failed', error.stack);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Fetching todos failed',
                error: error.message,
            });
        }
    }
    async getTodoById(id, res) {
        try {
            const todo = await this.todoService.findOne(id);
            return res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                message: 'Todo retrieved successfully',
                data: todo,
            });
        }
        catch (error) {
            await this.myLoggerService.error('Fetching Todo failed', error.stack);
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'Todo not found',
                error: error.message,
            });
        }
    }
    async updateStatus(id, status, res) {
        try {
            const updatedTodo = await this.todoService.updateStatus(id, status);
            return res.status(common_1.HttpStatus.OK).json({
                statusCode: common_1.HttpStatus.OK,
                message: 'Status updated successfully',
                data: updatedTodo,
            });
        }
        catch (error) {
            await this.myLoggerService.error('Status update failed', error.stack);
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Status update failed',
                error: error.message,
            });
        }
    }
    async deleteTodo(id, res) {
        try {
            await this.todoService.remove(id);
            return res.status(common_1.HttpStatus.NO_CONTENT).json({
                statusCode: common_1.HttpStatus.NO_CONTENT,
                message: 'Todo deleted successfully',
            });
        }
        catch (error) {
            await this.myLoggerService.error('Todo deletion failed', error.stack);
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'Todo not found',
                error: error.message,
            });
        }
    }
};
exports.TodoController = TodoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_dto_1.CreateTodoDto, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "getTodoById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "deleteTodo", null);
exports.TodoController = TodoController = __decorate([
    (0, common_1.Controller)('todo'),
    __metadata("design:paramtypes", [todos_service_1.TodoService,
        my_logger_service_1.MyLoggerService])
], TodoController);
//# sourceMappingURL=todos.controller.js.map