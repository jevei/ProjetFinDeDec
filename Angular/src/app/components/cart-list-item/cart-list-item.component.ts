import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CartProduct } from 'src/app/models/cart-product.model';
import { Cart } from 'src/app/models/cart.model';
import { CartApiRequestService } from 'src/app/services/cart-api-request.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: '[app-cart-list-item]',
  templateUrl: './cart-list-item.component.html',
  styleUrls: ['./cart-list-item.component.css']
})
export class CartListItemComponent implements OnInit {

  @Input() cartProduct!: CartProduct;

  cartItemForm: FormGroup;

  constructor(private apiCartService: CartApiRequestService, private cartComponent: CartComponent) {
    this.cartItemForm = new FormGroup({
      quantity: new FormControl(''),
    });
  }

  ngOnInit(): void {
    console.log(this.cartProduct);
    this.cartItemForm.get('quantity')?.setValue(this.cartProduct.quantity);
  }

  refreshItem() {
    this.cartProduct.quantity = this.cartItemForm.get('quantity')?.value;
    console.log("cart_product to update", this.cartProduct);
    this.apiCartService.updateCart(this.cartProduct).subscribe(success => {
      if (success) {
        console.log("OK", this.apiCartService.cart);
        this.apiCartService.showCart().subscribe(success => {
          if (success) {
            console.log("OK", this.apiCartService.sort);
            if (this.apiCartService.sort == "CTotal") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.total_price) > Number(b.total_price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "DTotal") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.total_price) < Number(b.total_price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "CPrix") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.products[0].price) > Number(b.products[0].price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "DPrix") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.products[0].price) < Number(b.products[0].price) ? 1 : -1)
            }
            console.log(this.apiCartService.sort);
            this.cartComponent.setCart(this.apiCartService.cart!);
          }
          else {
            console.log("ERROR", success);
            alert("ERROR!!!");
          }
        });
      }
      else {
        console.log("ERROR", success);
        alert("ERROR!!!");
      }
    });
  }

  deleteCartProduct(cartProduct: CartProduct) {
    this.apiCartService.deleteCartProduct(cartProduct).subscribe(success => {
      if (success) {
        console.log("OK", this.apiCartService.cart);
        this.apiCartService.showCart().subscribe(success => {
          if (success) {
            console.log("OK", this.apiCartService.sort);
            if (this.apiCartService.sort == "CTotal") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.total_price) > Number(b.total_price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "DTotal") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.total_price) < Number(b.total_price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "CPrix") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.products[0].price) > Number(b.products[0].price) ? 1 : -1)
            }
            else if (this.apiCartService.sort == "DPrix") {
              this.apiCartService.cart?.cartProducts.sort((a, b) => Number(a.products[0].price) < Number(b.products[0].price) ? 1 : -1)
            }
            console.log(this.apiCartService.sort);
            this.cartComponent.setCart(this.apiCartService.cart!);
          }
          else {
            console.log("ERROR", success);
            alert("ERROR!!!");
          }
        });
      }
      else {
        console.log("ERROR", success);
        alert("ERROR!!!");
      }
    });
  }
}
