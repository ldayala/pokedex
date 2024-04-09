import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  //@Transform(({ value }) => parseInt(value) || 10) //esta funcion transforma el valor de la propiedad en un numero entero, si no se especifica el valor, se asigna 10
  @IsOptional()
  @IsPositive()
  limit?: number;

  //@Transform(({ value }) => parseInt(value) || 10)
  @IsOptional()
  @IsPositive()
  offset?: number;//initial position
}
