import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchText: string): SafeHtml {
    if (!searchText || !value) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }

    const searchRegex = new RegExp(searchText, 'gi');
    const styles = `style=" background: yellow; "`
    const highlightedValue = value.replaceAll(searchRegex, `<span class="highlight" ${styles}>$&</span>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
  }
}
