import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import data from '../../../assets/product-data.json';
@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  public form!: FormGroup;
  public productDisplay: any;
  public categories: any;
  public products = data;
  public sub_categories: any;
  public max_discount!: number;
  public min_price!: number;
  public min_price_value!: any;
  public max_discount_err:boolean=false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      product: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: [''],
      min_price: ['', [Validators.required]],
      max_discount: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.form.get('product')?.valueChanges.subscribe((productKey) => {
      this.categories = this.products.find((v) => {
        return v.product.key === productKey
      })
    });

    this.form.get('category')?.valueChanges.subscribe((categoryKey) => {
      const sub_category = this.categories?.category.find((v: any) => {
        return v.key === categoryKey
      })
      const is_subcat_required = sub_category?.is_subcat_required;
      if (is_subcat_required) {
        this.form.controls['sub_category'].setValidators([Validators.required]);
        this.form.controls['sub_category'].updateValueAndValidity();
      } else {
        this.form.controls['sub_category'].clearValidators();
        this.form.controls['sub_category'].updateValueAndValidity();
      }
      this.sub_categories = sub_category?.sub_category;
      this.min_price = sub_category?.min_price;
      this.max_discount = sub_category?.max_discount;
    });

    this.form.get('min_price')?.valueChanges.subscribe((currentValue) => {
      const numValue = currentValue?.replace(/,/g, '');
      if (this.min_price > Number(numValue)) {
        this.form.controls['min_price'].setValidators([Validators.required, Validators.min(this.min_price)]);
        // this.form.controls['min_price'].updateValueAndValidity();
      } else {
        this.form.controls['min_price'].clearValidators();
        this.form.controls['min_price'].setValidators([Validators.required]);
        // this.form.controls['min_price'].updateValueAndValidity();
        // this.form.get('min_price')?.addValidators([Validators.required]);
        // console.log('this.form else', this.form)
      }
    });

    this.form.get('max_discount')?.valueChanges.subscribe((currentValue) => {
      const numValue = currentValue?.replace(/,/g, '');
      if (this.max_discount < Number(numValue)) {
        this.form.get('max_discount')?.setValidators([Validators.required, Validators.max(this.max_discount)]);
        // this.form.get('max_discount')?.setErrors({max:true})
        this.max_discount_err = true;
      } else {
        this.max_discount_err = false;
        this.form.get('max_discount')?.setValidators([Validators.required]);
      }
    });
    
  }

  public onSubmit(): void {
    console.log('this.form.value', this.form.value)
  }


  get fControl() {
    return this.form.controls
  }

  public reset(): void {
    this.form.reset();
    this.form.patchValue({
      product: '',
      category: '',
      sub_category: '',
      min_price: '',
      max_discount: ''
    });
  }

}
