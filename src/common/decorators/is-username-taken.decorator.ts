import { PrismaService } from 'prisma/prisma.service';
import {
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsUsernameTakenConstraint implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  
  async validate(username: string): Promise<boolean> {
    const user = await this.prisma.users.findUnique({
      where: { username },
    });

    if (user !== null) {
      return false;
    } else {
      return true;
    }
  }
}

export function IsUsernameTaken(validationOptions: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUsernameTaken',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: new IsUsernameTakenConstraint(new PrismaService()),
    });
  };
}
