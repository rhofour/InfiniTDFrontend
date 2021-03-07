import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appClickShortcut]'
})
export class ClickShortcutDirective implements OnInit {
  @Input() shortcutKey: string = '';

  constructor(private el: ElementRef) {
    if (!('disabled' in this.el.nativeElement)) {
      console.warn('Click shortcut attached to element without a disabled property.');
    }
  }

  ngOnInit() {
    if (this.shortcutKey === '') {
      console.warn('Shortcut set without shortcutKey.');
    }
  }

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (this.el.nativeElement.disabled === true) return;
    if (event.target instanceof Element) {
      switch (event.target.tagName.toLowerCase()) {
        case "input":
        case "textarea":
          return;
      }
    }

    if (event.key === this.shortcutKey) {
      this.el.nativeElement.click();
    }
  }

}
