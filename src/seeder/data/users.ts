import { CreateUserDto } from 'src/user/dto/create-user.dto';

const john = new CreateUserDto();
john.username = 'john';
john.name = 'John Doe';
john.password = '123456';

const jane = new CreateUserDto();
jane.username = 'jane';
jane.name = 'Jane Doe';
jane.password = '123456';

const jan = new CreateUserDto();
jan.username = 'jan';
jan.name = 'Jan Doe';
jan.password = '123456';

export default [john, jane, jan];
