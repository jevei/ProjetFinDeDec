import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommandProduct } from 'src/app/models/command-product';
import { Product } from 'src/app/models/product.model';
import { CommandApiRequestService } from 'src/app/services/command-api-request.service';
import { CommandProductApiRequestService } from 'src/app/services/command-product-api-request.service';

@Component({
  selector: '[app-command-items]',
  templateUrl: './command-items.component.html',
  styleUrls: ['./command-items.component.css']
})
export class CommandItemsComponent implements OnInit {
  @Input() commandProduct!: CommandProduct ;
  @Input() userID!: number ; //todo a supprimer 
  @Output() delete = new EventEmitter();
  @Output() update = new EventEmitter();

  constructor(private commandProductApiService  : CommandProductApiRequestService ,private router : Router ) { 


  }

  ngOnInit(): void {
  
  }

  loadCurrentProduct(){
  }
  deleteCommand(){
    this.delete.emit(this.commandProduct.id)
  }
  updateQuantity(){  
    this.update.emit(this.commandProduct.id)
  }


}
