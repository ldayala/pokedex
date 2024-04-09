
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly axiosAdapter: AxiosAdapter,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
   await this.pokemonModel.deleteMany({})
    const data = await this.axiosAdapter.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=360`,
    );
    const arrayPromise=[] 
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      arrayPromise.push({ name, no });
    });
    //await Promise.all(arrayPromise);
    await this.pokemonModel.insertMany(arrayPromise);// esta es mas eficiente que la anterior*/
    return "seed executed";
  }
}
