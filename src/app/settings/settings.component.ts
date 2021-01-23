import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ColorSchemeService } from '../color-scheme.service';

interface SelectionOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  colorSchemeOptions: SelectionOption[] = [
    { value: "default", viewValue: "System default" },
    { value: "light", viewValue: "Light" },
    { value: "dark", viewValue: "Dark" },
  ]
  selectedColorScheme: 'default' | 'light' | 'dark';

  constructor(public colorScheme: ColorSchemeService) {
    this.selectedColorScheme = this.colorScheme.getColorSchemeOrDefault();
  }

  selectColorScheme(event: Event) {
    this.selectedColorScheme = ((event.target as HTMLSelectElement).value as "default" | "light" | "dark");
    this.colorScheme.update(this.selectedColorScheme);
  }
}
