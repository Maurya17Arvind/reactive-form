import { DecimalPipe } from '@angular/common';
import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { map, Subscription } from 'rxjs';

@Directive({
  selector: '[appMinval]'
})
export class MinvalDirective {

  // constructor(private ) { }

  // @Input('appMinval') minValue!: any;

  // @HostBinding('value') min_price!: any;

  // @HostListener('keyup') onKeyUp(){
  //   const decimalData = this.minValue.toLocaleString();
  //   this.min_price = this.minValue;
  //   console.log('decimalData', this.min_price)
  // }

  private subscription!: Subscription | undefined;

  constructor(private ngControl: NgControl, private decimal: DecimalPipe) {
  }

  ngOnInit() {
    const control = this.ngControl.control;
    this.subscription = control?.valueChanges.pipe(
      map(value => {
        const parts = value?.toString().split(".");
        if (parts && parts.length) {
          parts[0] = this.decimal?.transform(parts[0]?.replace(/,/g, ''));
          return parts?.join('.');
        }
      })
    ).subscribe(v => control.setValue(v, { emitEvent: false }));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
