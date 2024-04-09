import { HttpService } from "@nestjs/axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";
@Injectable()
export class AxiosAdapter implements HttpAdapter{
    constructor(
        private readonly httpService: HttpService
    ){}
   async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.httpService.axiosRef.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('Error en el servidor');
        }
    }

}