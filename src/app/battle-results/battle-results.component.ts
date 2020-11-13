import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

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
  monstersColumns = [ 'name', 'numDefeated', 'numSent', 'reward' ];
  awardsColumns = [ 'name', 'modifier', 'subtotal' ];

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

  get bonuses(): (BattleBonus & { subtotal: number })[] {
    let res: (BattleBonus & { subtotal: number })[] = [];
    let subtotal: number = this.subtotal;
    for (let bonusId of this.battleResults.bonuses) {
      const bonus: BattleBonus | undefined = this.gameConfig.misc.battleBonuses.get(bonusId);
      if (bonus === undefined) {
        console.warn(`Game config isn't aware of bonus ${bonusId}.`);
        return [];
      }
      switch (bonus.bonusType) {
        case BonusType.ADDITIVE:
          subtotal += bonus.bonusAmount;
          break;
        case BonusType.MULTIPLICATIVE:
          subtotal *= bonus.bonusAmount;
          break;
        default:
          const _exhaustiveCheck: never = bonus.bonusType;
      }
      res.push(Object.assign({}, bonus, {subtotal: subtotal}));
    }
    if (Math.abs(subtotal - this.battleResults.reward) > 0.001) {
      console.warn(`Calculated final total ${subtotal} doesn't match battle reward ` +
        `${this.battleResults.reward}.`);
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

  get totalDefeated(): number {
    return this.monstersDefeated.reduce( (acc, x) => acc + x.numDefeated, 0 );
  }

  get totalSent(): number {
    return this.monstersDefeated.reduce( (acc, x) => acc + x.numSent, 0 );
  }
}
