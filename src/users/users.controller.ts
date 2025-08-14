import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchUsersDto } from './dto/search-users.dto';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('search')
  search(@Query() dto: SearchUsersDto) {
    return this.users.search(dto.q, dto.limit, dto.page);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.users.findById(id);
  }
}
