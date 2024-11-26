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
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./todo.entity");
const my_logger_service_1 = require("../my-logger/my-logger.service");
let TodoService = class TodoService {
    constructor(todoRepository, myLoggerService) {
        this.todoRepository = todoRepository;
        this.myLoggerService = myLoggerService;
    }
    async create(todoDto) {
        const { name, description, time, status } = todoDto;
        try {
            this.myLoggerService.log('Starting creation of a new Todo', 'TodoService');
            if (!name || !description || !time || !status) {
                const errorMessage = 'Missing required fields: name, description, time, or status';
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'TodoService');
                throw new common_1.BadRequestException(errorMessage);
            }
            const todoExists = await this.todoRepository.findOne({ where: { name } });
            if (todoExists) {
                const errorMessage = `Todo with name "${name}" already exists`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'TodoService');
                throw new common_1.ConflictException('A todo with this name already exists');
            }
            const todo = this.todoRepository.create(todoDto);
            const savedTodo = await this.todoRepository.save(todo);
            this.myLoggerService.log(`Todo "${savedTodo.name}" created successfully`, 'TodoService');
            return savedTodo;
        }
        catch (error) {
            console.error('Error during Todo creation:', error.message);
            this.myLoggerService.error('Error during Todo creation', error.stack);
            throw error;
        }
    }
    async findAll(status) {
        try {
            this.myLoggerService.log('Fetching all Todos', 'TodoService');
            const where = status ? { status } : {};
            const todos = await this.todoRepository.find({ where });
            console.log("fetching all todos", todos);
            this.myLoggerService.log(`Found ${todos.length} Todos with status: ${status || 'all'}`, 'TodoService');
            return todos;
        }
        catch (error) {
            console.error('Error fetching Todos:', error.message);
            this.myLoggerService.error('Error fetching Todos', error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            this.myLoggerService.log(`Fetching Todo with ID ${id}`, 'TodoService');
            const todo = await this.todoRepository.findOne({ where: { id } });
            if (!todo) {
                const errorMessage = `Todo with ID ${id} not found`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'TodoService');
                throw new common_1.NotFoundException(errorMessage);
            }
            return todo;
        }
        catch (error) {
            console.error(`Error fetching Todo with ID ${id}:`, error.message);
            this.myLoggerService.error(`Error fetching Todo with ID ${id}`, error.stack);
            throw error;
        }
    }
    async updateStatus(id, status) {
        try {
            this.myLoggerService.log(`Updating status for Todo ID ${id}`, 'TodoService');
            const validStatuses = ['in progress', 'completed'];
            if (!validStatuses.includes(status)) {
                const errorMessage = `Invalid status "${status}" provided`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'TodoService');
                throw new common_1.BadRequestException('Invalid status. Valid statuses are "in progress" or "completed".');
            }
            const todo = await this.findOne(id);
            todo.status = status;
            const updatedTodo = await this.todoRepository.save(todo);
            this.myLoggerService.log(`Status for Todo ID ${id} updated to "${status}"`, 'TodoService');
            return updatedTodo;
        }
        catch (error) {
            console.error(`Error updating status for Todo ID ${id}:`, error.message);
            this.myLoggerService.error(`Error updating status for Todo ID ${id}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            this.myLoggerService.log(`Deleting Todo with ID ${id}`, 'TodoService');
            const result = await this.todoRepository.delete(id);
            if (result.affected === 0) {
                const errorMessage = `Todo with ID ${id} not found`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'TodoService');
                throw new common_1.NotFoundException(errorMessage);
            }
            this.myLoggerService.log(`Todo with ID ${id} deleted successfully`, 'TodoService');
        }
        catch (error) {
            console.error(`Error deleting Todo with ID ${id}:`, error.message);
            this.myLoggerService.error(`Error deleting Todo with ID ${id}`, error.stack);
            throw error;
        }
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        my_logger_service_1.MyLoggerService])
], TodoService);
//# sourceMappingURL=todos.service.js.map