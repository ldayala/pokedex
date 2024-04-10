import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit:number;

  constructor(
    private configService: ConfigService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll({limit=this.defaultLimit, offset}: PaginationDto) {
    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1, //no:1 for order by no desc
      })
      .select(['-__v']); //['-__v','-_id']); //- for exclude __v and _id properties
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    //mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new BadRequestException(
        `Pokemon with id, name or no: ${term} not found`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const result = await this.pokemonModel.findByIdAndDelete(id);
    if (!result) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return { message: 'Pokemon deleted' };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Can`t create Pokemon - Check server logs',
    );
  }
}
