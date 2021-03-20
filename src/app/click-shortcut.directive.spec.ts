import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClickShortcutDirective } from './click-shortcut.directive';

@Component({
  template: `
  <button appClickShortcut shortcutKey="a">
  `
})
class TestComponent { }

describe('ClickShortcutDirective', () => {
  var shortcutElems;
  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ ClickShortcutDirective, TestComponent ]
    })
    .createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // Get all elements with an attached ClickShortcutDirective.
    shortcutElems = fixture.debugElement.queryAll(By.directive(ClickShortcutDirective));
  });

  it('should have one attached element', () => {
    expect(shortcutElems.length).toBe(1);
  });
});