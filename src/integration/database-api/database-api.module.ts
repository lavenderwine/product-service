import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpConfigService } from '../../common/config/http-module.config';

@Module({
    imports: [HttpModule.registerAsync({
        imports: [ConfigModule],
        useExisting: HttpConfigService,
        inject: [ConfigService],
    })],
    providers: [],
    exports: []
})
export class DatabaseApiModule { }
