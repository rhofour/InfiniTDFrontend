import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MonsterConfig } from '../../game-config';

@Component({
  selector: 'app-displayed-monster',
  templateUrl: './displayed-monster.component.html',
  styleUrls: ['./displayed-monster.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayedMonsterComponent {
  @Input() displayedMonster?: MonsterConfig;

  constructor() { }

}
