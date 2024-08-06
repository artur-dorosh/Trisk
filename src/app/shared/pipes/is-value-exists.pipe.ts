import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isValueExists',
  standalone: true
})
export class IsValueExistsPipe implements PipeTransform {

  transform(value: unknown): boolean {
    return value !== undefined && value !== null;
  }

}
