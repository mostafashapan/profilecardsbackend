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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_model_1 = require("./models/user.model");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ where: { id } });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.find();
        });
    }
    addUser(addUserInput, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.userRepository.create(addUserInput);
            if (photo) {
                user.photo = yield this.handleFileUpload(photo);
            }
            return this.userRepository.save(user);
        });
    }
    update(id, updateUserInput, photo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.update(id, updateUserInput);
            const user = yield this.userRepository.findOne({ where: { id } });
            if (photo) {
                user.photo = yield this.handleFileUpload(photo);
            }
            return this.userRepository.save(user);
        });
    }
    handleFileUpload(photo) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = `/uploads/${photo.filename}`;
            return filePath;
        });
    }
    checkDbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.query('SELECT 1');
                return 'Database connection is active';
            }
            catch (error) {
                return 'Database connection failed';
            }
        });
    }
    deleteUsers(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.delete(ids);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
