import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersGateway } from './users/users.gateway';

@Module({
  imports: [
    // Load the .env configuration
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, so you don't need to import it elsewhere
    }),
    // Configure Mongoose using the environment variable
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        console.log(`Connecting to MongoDB at: ${databaseUrl}`); // Debugging log
        return {
          uri: databaseUrl,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersGateway],
})
export class AppModule {}
