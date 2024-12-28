"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const user_model_1 = require("./user/models/user.model");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
// Import ApolloDriver and ApolloDriverConfig from @nestjs/apollo
const apollo_1 = require("@nestjs/apollo");
// Import GraphQLUpload from graphql-upload-ts
const graphql_upload_ts_1 = require("graphql-upload-ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => __awaiter(void 0, void 0, void 0, function* () {
                    const databaseUrl = configService.get('DATABASE_URL');
                    const url = new URL(databaseUrl);
                    return {
                        type: 'postgres',
                        host: url.hostname,
                        port: parseInt(url.port, 10),
                        username: url.username,
                        password: url.password,
                        database: url.pathname.slice(1),
                        entities: [user_model_1.User],
                        synchronize: true,
                        logging: ['query', 'error', 'schema'],
                    };
                }),
            }),
            // Configure GraphQLModule with ApolloDriver
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver, // Use ApolloDriver from @nestjs/apollo
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'), // Auto-generate schema file
                playground: true, // Enable GraphQL Playground for dev mode
                introspection: true, // Enable introspection
                resolvers: {
                    Upload: graphql_upload_ts_1.GraphQLUpload, // Register GraphQLUpload from graphql-upload-ts as the Upload scalar
                },
            }),
            user_module_1.UserModule,
        ],
        providers: [],
    })
], AppModule);
