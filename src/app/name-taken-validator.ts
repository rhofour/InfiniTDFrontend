import { Directive } from '@angular/core';
import { AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendService } from './backend.service';

@Directive({
  selector: '[nameTakenValidator]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: NameTakenValidatorDirective,
    multi: true
  }]
})
export class NameTakenValidatorDirective implements AsyncValidator {
  constructor(private backend: BackendService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.backend.isNameTaken(ctrl.value).then(
      isTaken => (isTaken ? { nameTaken: true } : null));
  }
}
