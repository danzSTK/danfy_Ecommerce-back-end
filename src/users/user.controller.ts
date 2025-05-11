import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import { SubToken } from 'src/common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @SubToken() sub: number) {
    return this.userService.findOne(+id, sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @SubToken() sub: number,
  ) {
    return this.userService.update(+id, updateUserDto, sub);
  }

  @Delete(':id')
  // TODO: adicionar o class transform pipe para transformar o id em number e evitar esse tipo de conversão magica
  // @UsePipes(new ParseIntPipe())
  remove(@Param('id') id: string, @SubToken() sub: number) {
    return this.userService.remove(+id, sub);
  }
}
