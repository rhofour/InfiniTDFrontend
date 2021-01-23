import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ColorSchemeService } from './color-scheme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'InfiniTD';

  constructor(private colorScheme: ColorSchemeService) {
    this.colorScheme.load();
  }
}
