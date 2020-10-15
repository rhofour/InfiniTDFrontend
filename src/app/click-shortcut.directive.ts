import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appClickShortcut]'
})
export class ClickShortcutDirective {
  @Input() shortcutKey: string = '';

  constructor(private el: ElementRef) {
    if (!('disabled' in this.el.nativeElement)) {
      console.warn("Click shortcut attached to element without a disabled property.");
    }
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === this.shortcutKey && this.el.nativeElement.disabled !== true) {
      this.el.nativeElement.click();
    }
  }

}
