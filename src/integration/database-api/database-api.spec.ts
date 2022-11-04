import { HttpService } from "@nestjs/axios";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseApiService } from "./database-api.service";

describe('Database API service integration', () => {
    let mockeHttpService: HttpService
    let databaseApiSerivce: DatabaseApiService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HttpService,
                DatabaseApiService
            ],
        }).compile();

        mockeHttpService = module.get<HttpService>(HttpService);
        databaseApiSerivce = module.get<DatabaseApiService>(DatabaseApiService);
    });

    describe('Query', () => {
        it('should query based on command and parameters', async () => {
            const expected = {

            }
        })
    });
});