import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorators/is-public.decorator';
import {
  RequestUserId,
  UserRequest,
} from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @RequestUserId() requestUserId: number,
  ) {
    return this.userService.findOne(id, requestUserId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @RequestUserId() requestUserId: number,
  ) {
    return this.userService.update(id, updateUserDto, requestUserId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @RequestUserId() requestUserId: number,
    @UserRequest() user: User,
  ) {
    return this.userService.desactiveUser(id, user);
  }
}
