import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { BattleResults } from '../battle-state';
import { GameConfig, ConfigImageMap, MonsterConfig, BattleBonus, BonusType } from '../game-config';

interface MonsterDefeated {
  monster: MonsterConfig
  numDefeated: number
  numSent: number
}

@Component({
  selector: 'app-battle-results',
  templateUrl: './battle-results.component.html',
  styleUrls: ['./battle-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleResultsComponent implements OnInit {
  @Input() gameConfig!: GameConfig;
  @Input() battleResults!: BattleResults;
  Math = Math;

  constructor() { }

  ngOnInit(): void {
    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }
    if (this.battleResults === undefined) {
      throw Error("Input battleResult is undefined.");
    }
  }

  get monstersDefeated(): MonsterDefeated[] {
    let res: MonsterDefeated[] = [];
    for (let [monsterId, [numDefeated, numSent]] of this.battleResults.monstersDefeated) {
      const monsterConfig: MonsterConfig | undefined = this.gameConfig.monsters.get(monsterId);
      if (monsterConfig === undefined) {
        console.warn(`Game config isn't aware of monster ${monsterId}.`);
        return [];
      }
      res.push({
        monster: monsterConfig,
        numDefeated: numDefeated,
        numSent: numSent
      });
    }
    return res;
  }

  get bonuses(): BattleBonus[] {
    let res: BattleBonus[] = [];
    for (let bonusId of this.battleResults.bonuses) {
      const bonus: BattleBonus | undefined = this.gameConfig.misc.battleBonuses.get(bonusId);
      if (bonus === undefined) {
        console.warn(`Game config isn't aware of bonus ${bonusId}.`);
        return [];
      }
      res.push(bonus);
    }
    return res;
  }

  displayBonusAmount(bonus: BattleBonus): string {
    switch(bonus.bonusType) {
      case BonusType.ADDITIVE:
        return `+ ${bonus.bonusAmount}`;
      case BonusType.MULTIPLICATIVE:
        return `x ${bonus.bonusAmount}`;
      default: const _exhaustiveCheck: never = bonus.bonusType;
    }
    return `ERROR: unexpected bonus type ${bonus.bonusType}`;
  }

  get subtotal(): number {
    let subtotal = 0;
    for (let m of this.monstersDefeated) {
      subtotal += m.numDefeated * m.monster.bounty;
    }
    return subtotal;
  }
}
