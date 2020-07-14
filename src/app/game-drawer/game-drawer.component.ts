import { Component, OnInit, Input } from '@angular/core';

import { GameUiService, Selection } from '../game-ui.service';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent implements OnInit {
  public selection?: Selection;

  constructor(
    uiService: GameUiService,
  ) {
    uiService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
    });
  }

  ngOnInit(): void {
  }

}
