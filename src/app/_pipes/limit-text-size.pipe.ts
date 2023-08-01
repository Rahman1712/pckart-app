import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTextSize'
})
export class LimitTextSizePipe implements PipeTransform {

  transform(text: string, limit: number): string {
    if(text.length <= limit){
      return text;
    }else{
      return text.slice(0, limit) + '...';
    }
  }

}
