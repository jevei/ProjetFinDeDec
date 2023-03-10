import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductsSommary } from 'src/app/models/products-sommary.model';
import { ProductsSommaryApiRequestService } from 'src/app/services/products-sommary-api-request.service';

@Component({
  selector: 'app-products-sommary',
  templateUrl: './products-sommary.component.html',
  styleUrls: ['./products-sommary.component.css']
})
export class ProductsSommaryComponent implements OnInit {
  events: string[] = [];
  opened: boolean = false;
  searchForm: FormGroup;
  sort: string = '';
  productsSommaries: ProductsSommary[] = [];
  reserveProductsSommaries: ProductsSommary[] = [];
  filterForm: FormGroup;
  sideBarOpen = false;
  animal_type = ['Chiens', 'Chats', 'Oiseaux', 'Reptiles et Amphibiens', 'Petits Animaux', 'Aquariophilie', 'Tous les Animaux'];
  categories = ['Accessoire et Hygiène', 'Nourriture', 'Jouet', 'Cage', 'Aquarium et Terrarium', 'Transport', 'Toutes les Catégories'];

  constructor(private apiProductsSommary: ProductsSommaryApiRequestService, public datepipe: DatePipe) {
    this.filterForm = new FormGroup({
      animal: new FormControl('Tous les Animaux'),
      category: new FormControl('Toutes les Catégories'),
      select: new FormControl('Ordre Alphabétique Croissant'),
      time: new FormControl('[all]')
    });
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.apiProductsSommary.getSommary(this.searchForm.get('search')?.value).subscribe(success => {
      if (success) {
        console.log("OK", success);
        this.productsSommaries = success;
        this.reserveProductsSommaries = success;
        console.log(this.productsSommaries);
      }
      else {
        console.log("ERROR", success)
        alert("ERROR!!!");
      }
    });
  }

  filter() {
    var animal = this.filterForm.get('animal')?.value;
    var category = this.filterForm.get('category')?.value;
    var index;
    if (category == "Toutes les Catégories" && animal == "Tous les Animaux") {
      index = this.reserveProductsSommaries;
      console.log('1', index);
    }
    else if (animal == "Tous les Animaux") {
      index = this.reserveProductsSommaries.filter(s => s.products_category === category);
      console.log('2', index);
    }
    else if (category == "Toutes les Catégories") {
      index = this.reserveProductsSommaries.filter(s => s.products_animal_type === animal);
      console.log('3', index);
    }
    else {
      index = this.reserveProductsSommaries.filter(s => s.products_animal_type === animal).filter(s => s.products_category === category);
      console.log('4', index);
    }
    let tempProductsSommaries: ProductsSommary[] = [];
    var oneYearAgoFromNow = new Date();
    var threeMonthAgoFromNow = new Date();
    var thirtyDayAgoFromNow = new Date();
    oneYearAgoFromNow.setFullYear(oneYearAgoFromNow.getFullYear() - 1);
    threeMonthAgoFromNow.setMonth(threeMonthAgoFromNow.getMonth() - 3);
    thirtyDayAgoFromNow.setMonth(thirtyDayAgoFromNow.getMonth() - 1);
    if (this.filterForm.get('time')?.value == '[year]') {
      index.forEach(productsSommary => {
        var date = new Date(productsSommary.created_at);
        if (oneYearAgoFromNow < date) {
          console.log('TROUVÉS', productsSommary);
          tempProductsSommaries.push(productsSommary);
        }
      })
    }
    else if (this.filterForm.get('time')?.value == '[month]') {
      index.forEach(productsSommary => {
        var date = new Date(productsSommary.created_at);
        if (threeMonthAgoFromNow < date) {
          console.log('TROUVÉS', productsSommary);
          tempProductsSommaries.push(productsSommary);
        }
      })
    }
    else if (this.filterForm.get('time')?.value == '[day]') {
      index.forEach(productsSommary => {
        var date = new Date(productsSommary.created_at);
        if (thirtyDayAgoFromNow < date) {
          console.log('TROUVÉS', productsSommary);
          tempProductsSommaries.push(productsSommary);
        }
      })
    }
    if (this.filterForm.get('time')?.value != '[all]') {
      this.productsSommaries = tempProductsSommaries;
    }
    else {
      this.productsSommaries = index;
    }
  }

  reset() {
    this.filterForm.get('animal')?.setValue("Tous les Animaux");
    this.filterForm.get('category')?.setValue("Toutes les Catégories");
    this.searchForm.get('search')?.setValue("");
    this.apiProductsSommary.getSommary("").subscribe(success => {
      if (success) {
        console.log("OK", success);
        this.productsSommaries = success;
        this.reserveProductsSommaries = success;
        console.log(this.productsSommaries);
      }
      else {
        console.log("ERROR", success)
        alert("ERROR!!!");
      }
    });
  }

  search() {
    this.apiProductsSommary.getSommary(this.searchForm.get('search')?.value).subscribe(success => {
      if (success) {
        console.log("OK", success);
        this.productsSommaries = success;
        this.reserveProductsSommaries = success;
        console.log(this.productsSommaries);
      }
      else {
        console.log("ERROR", success)
        alert("ERROR!!!");
      }
    });
  }

  sortBy(sort: string) {
    switch (sort) {
      case "productprice":
        if (this.sort == "cproductprice") {
          this.productsSommaries.sort((a, b) => Number(a.products_price) > Number(b.products_price) ? 1 : -1)
          this.sort = "dproductprice";
        }
        else if (this.sort == "dproductprice") {
          this.productsSommaries.sort((a, b) => Number(a.products_price) < Number(b.products_price) ? 1 : -1)
          this.sort = "cproductprice";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.products_price) > Number(b.products_price) ? 1 : -1)
          this.sort = "dproductprice";
        }
        break;
      case "sumcartproductquantity":
        if (this.sort == "csumcartproductquantity") {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_quantity) > Number(b.sum_of_cart_products_quantity) ? 1 : -1)
          this.sort = "dsumcartproductquantity";
        }
        else if (this.sort == "dsumcartproductquantity") {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_quantity) < Number(b.sum_of_cart_products_quantity) ? 1 : -1)
          this.sort = "csumcartproductquantity";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_quantity) > Number(b.sum_of_cart_products_quantity) ? 1 : -1)
          this.sort = "dsumcartproductquantity";
        }
        break;
      case "averagecartproductquantity":
        if (this.sort == "caveragecartproductquantity") {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_quantity) > Number(b.average_cart_products_quantity) ? 1 : -1)
          this.sort = "daveragecartproductquantity";
        }
        else if (this.sort == "daveragecartproductquantity") {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_quantity) < Number(b.average_cart_products_quantity) ? 1 : -1)
          this.sort = "caveragecartproductquantity";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_quantity) > Number(b.average_cart_products_quantity) ? 1 : -1)
          this.sort = "daveragecartproductquantity";
        }
        break;
      case "sumcartproducttotal":
        if (this.sort == "csumcartproducttotal") {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_total) > Number(b.sum_of_cart_products_total) ? 1 : -1)
          this.sort = "dsumcartproducttotal";
        }
        else if (this.sort == "dsumcartproducttotal") {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_total) < Number(b.sum_of_cart_products_total) ? 1 : -1)
          this.sort = "csumcartproducttotal";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.sum_of_cart_products_total) > Number(b.sum_of_cart_products_total) ? 1 : -1)
          this.sort = "dsumcartproducttotal";
        }
        break;
      case "averagecartproducttotal":
        if (this.sort == "caveragecartproducttotal") {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_total) > Number(b.average_cart_products_total) ? 1 : -1)
          this.sort = "daveragecartproducttotal";
        }
        else if (this.sort == "daveragecartproducttotal") {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_total) < Number(b.average_cart_products_total) ? 1 : -1)
          this.sort = "caveragecartproducttotal";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.average_cart_products_total) > Number(b.average_cart_products_total) ? 1 : -1)
          this.sort = "daveragecartproducttotal";
        }
        break;
      case "productnumbercart":
        if (this.sort == "cproductnumbercart") {
          this.productsSommaries.sort((a, b) => Number(a.products_number_of_cart) > Number(b.products_number_of_cart) ? 1 : -1)
          this.sort = "dproductnumbercart";
        }
        else if (this.sort == "dproductnumbercart") {
          this.productsSommaries.sort((a, b) => Number(a.products_number_of_cart) < Number(b.products_number_of_cart) ? 1 : -1)
          this.sort = "cproductnumbercart";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.products_number_of_cart) > Number(b.products_number_of_cart) ? 1 : -1)
          this.sort = "dproductnumbercart";
        }
        break;
      case "averagecarttotal":
        if (this.sort == "caveragecarttotal") {
          this.productsSommaries.sort((a, b) => Number(a.average_carts_total) > Number(b.average_carts_total) ? 1 : -1)
          this.sort = "daveragecarttotal";
        }
        else if (this.sort == "daveragecarttotal") {
          this.productsSommaries.sort((a, b) => Number(a.average_carts_total) < Number(b.average_carts_total) ? 1 : -1)
          this.sort = "caveragecarttotal";
        }
        else {
          this.productsSommaries.sort((a, b) => Number(a.average_carts_total) > Number(b.average_carts_total) ? 1 : -1)
          this.sort = "daveragecarttotal";
        }
        break;
      case "producttitle":
        if (this.sort == "cproducttitle") {
          this.productsSommaries.sort((a, b) => a.products_title > b.products_title ? 1 : -1);
          this.sort = "dproducttitle";
        }
        else if (this.sort == "dproducttitle") {
          this.productsSommaries.sort((a, b) => a.products_title < b.products_title ? 1 : -1);
          this.sort = "cproducttitle";
        }
        else {
          this.productsSommaries.sort((a, b) => a.products_title > b.products_title ? 1 : -1);
          this.sort = "dproducttitle";
        }
        break;
      case "productcategory":
        if (this.sort == "cproductcategory") {
          this.productsSommaries.sort((a, b) => a.products_category > b.products_category ? 1 : -1);
          this.sort = "dproductcategory";
        }
        else if (this.sort == "dproductcategory") {
          this.productsSommaries.sort((a, b) => a.products_category < b.products_category ? 1 : -1);
          this.sort = "cproductcategory";
        }
        else {
          this.productsSommaries.sort((a, b) => a.products_category > b.products_category ? 1 : -1);
          this.sort = "dproductcategory";
        }
        break;
      case "productanimaltype":
        if (this.sort == "cproductanimaltype") {
          this.productsSommaries.sort((a, b) => a.products_animal_type > b.products_animal_type ? 1 : -1);
          this.sort = "dproductanimaltype";
        }
        else if (this.sort == "dproductanimaltype") {
          this.productsSommaries.sort((a, b) => a.products_animal_type < b.products_animal_type ? 1 : -1);
          this.sort = "cproductanimaltype";
        }
        else {
          this.productsSommaries.sort((a, b) => a.products_animal_type > b.products_animal_type ? 1 : -1);
          this.sort = "dproductanimaltype";
        }
        break;
      case "createdat":
        if (this.sort == "ccreatedat") {
          this.productsSommaries.sort((a, b) => a.created_at > b.created_at ? 1 : -1);
          this.sort = "dcreatedat";
        }
        else if (this.sort == "dcreatedat") {
          this.productsSommaries.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
          this.sort = "ccreatedat";
        }
        else {
          this.productsSommaries.sort((a, b) => a.created_at > b.created_at ? 1 : -1);
          this.sort = "dcreatedat";
        }
        break;
    }
  }
}
