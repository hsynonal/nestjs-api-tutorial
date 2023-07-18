import { ApiProperty } from '@nestjs/swagger';

export class User {
  
  name: string;

  @ApiProperty({ example: 1, description: 'The age of the User' })
  age: number;

  @ApiProperty({
    example: 'Developer',
    description: 'The occupation of the User',
  })
  occupation: string;
}
