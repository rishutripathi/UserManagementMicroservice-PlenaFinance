import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class FetchUserDetailsDTO extends PickType(UserDTO, ['username']) {}
