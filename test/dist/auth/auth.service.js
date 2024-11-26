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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const my_logger_service_1 = require("../my-logger/my-logger.service");
let AuthService = class AuthService {
    constructor(jwtService, myLoggerService, userRepository) {
        this.jwtService = jwtService;
        this.myLoggerService = myLoggerService;
        this.userRepository = userRepository;
    }
    async register(userDto) {
        try {
            const { email, mobile, password } = userDto;
            if (!email || !mobile || !password) {
                throw new common_1.BadRequestException('Email, mobile, and password are required');
            }
            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { mobile }],
            });
            if (existingUser) {
                if (existingUser.email === email) {
                    const errorMessage = `Email already exists: ${email}`;
                    console.error(errorMessage);
                    this.myLoggerService.error(errorMessage, 'AuthService');
                    throw new common_1.ConflictException('Email already exists');
                }
                if (existingUser.mobile === mobile) {
                    const errorMessage = `Mobile already exists: ${mobile}`;
                    console.error(errorMessage);
                    this.myLoggerService.error(errorMessage, 'AuthService');
                    throw new common_1.ConflictException('Mobile already exists');
                }
            }
            let hashedPassword;
            try {
                hashedPassword = await bcrypt.hash(password, 10);
            }
            catch (error) {
                const errorMessage = `Error hashing password for ${email || mobile}`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, error.stack);
                throw new common_1.BadRequestException('Error hashing password');
            }
            const user = this.userRepository.create({
                ...userDto,
                password: hashedPassword,
            });
            await this.userRepository.save(user);
            const successMessage = `User successfully registered with mobile: ${mobile}`;
            this.myLoggerService.log(successMessage, 'AuthService');
            return user;
        }
        catch (error) {
            this.myLoggerService.error('Error during registration', error.stack);
            throw error;
        }
    }
    async login(mobile, password) {
        try {
            const user = await this.userRepository.findOne({ where: { mobile } });
            if (!user) {
                const errorMessage = `Incorrect mobile number: ${mobile}`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'AuthService');
                throw new common_1.BadRequestException('Incorrect mobile number');
            }
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                const errorMessage = `Incorrect password for mobile: ${mobile}`;
                console.error(errorMessage);
                this.myLoggerService.error(errorMessage, 'AuthService');
                throw new common_1.BadRequestException('Incorrect password');
            }
            const payload = { userId: user.id };
            const accessToken = this.jwtService.sign(payload);
            const successMessage = `User logged in successfully with mobile: ${mobile}`;
            this.myLoggerService.log(successMessage, 'AuthService');
            return { accessToken };
        }
        catch (error) {
            console.error('Login Error:', error.message);
            this.myLoggerService.error('Login failed', error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        my_logger_service_1.MyLoggerService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map