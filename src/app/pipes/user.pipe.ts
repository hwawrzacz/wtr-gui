import { Pipe, PipeTransform } from '@angular/core';
import { stringifyUser } from '../helpers/parsers';
import { User } from '../model/user';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  transform(value: User): string {
    return value ? stringifyUser(value) : '';
  }

}
