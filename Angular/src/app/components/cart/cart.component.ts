import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CartProduct } from 'src/app/models/cart-product.model';
import { Cart } from 'src/app/models/cart.model';
import { CartApiRequestService } from 'src/app/services/cart-api-request.service';
import { JSONObject } from 'ts-json-object';
import { __createBinding } from 'tslib';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  private _cart!: Cart;

  cartForm: FormGroup;

  get cart() {
    return this._cart;
  }

  constructor(private apiCartService: CartApiRequestService) {
    this.apiCartService.showCart().subscribe(success => {
      if (success) {
        console.log("OK", this.apiCartService.cart);
        this._cart = this.apiCartService.cart!;
      }
      else {
        console.log("ERROR", success);
        alert("ERROR!!!");
      }
    });
    this.cartForm = new FormGroup({
      shipping: new FormControl('0'),
    });
  }

  ngOnInit(): void {
  }

  checkUp() {///fonction pour passer aux commandes
  }

}
