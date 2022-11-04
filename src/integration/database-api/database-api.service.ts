import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { StringUtil } from "../../utils/string.util";
import { DatabaseApiRequestDto, DatabaseApiResponseDto } from "./dto";

@Injectable()
export class DatabaseApiService {
    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService
    ) { }

    async query(request: DatabaseApiRequestDto): Promise<DatabaseApiResponseDto> {
        const { data } = await firstValueFrom(
            this.httpService.post(
                `${this.configService.get('DATABASE_API_SERVICE_HOST')}${this.configService.get('DATABASE_API_QUERY_API')}`,
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${StringUtil.generate(JSON.stringify(this.getRawToken()))}`
                    }
                }
            )
        );
        return data;
    }

    private getRawToken() {
        const host = this.configService.get('DB_HOST');
        const host_read = this.configService.get('DB_HOST');;
        const user = this.configService.get('DB_USERNAME');;
        const password = this.configService.get('DB_PASSWORD');;
        const database = this.configService.get('DB_NAME');;
        return { host, host_read, user, password, database };
    }
}