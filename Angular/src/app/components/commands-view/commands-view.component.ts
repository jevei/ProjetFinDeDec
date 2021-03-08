import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Command } from 'src/app/models/command.model';
import { AuthService } from 'src/app/services/auth.services';
import { CommandApiRequestService } from 'src/app/services/command-api-request.service';
import { CommandProductApiRequestService } from 'src/app/services/command-product-api-request.service';
import { JSONObject } from 'ts-json-object';

@Component({
  selector: 'app-command',
  templateUrl: './commands-view.component.html',
  styleUrls: ['./commands-view.component.css']
})
export class CommandsViewComponent implements OnInit {

  currentCommand: Command;

  sortUnit : string = "priceUnitDown"
  sortQuantity : string = "quantityUp"
  sortTotalPrice : string = "priceTotalUp"
  searchCommandForm: FormGroup;
  constructor(private apiRequestService: CommandApiRequestService, private route: ActivatedRoute, private router: Router, private apiCommandProductService : CommandProductApiRequestService) {
    this.currentCommand = new Command();
    this.searchCommandForm = new FormGroup({
      search: new FormControl('')
    })
  }
  searchCommand(){
    let querry = this.searchCommandForm.get('search')?.value

      this.apiCommandProductService.searchCommandProduct(this.currentCommand.id.toString(),querry).subscribe(success =>{
        this.changeCommandProduct(success)
    })
  
}
  sortByUnitPrice(){
    if(this.sortUnit==  "priceUnitDown"){
      this.sortUnit = "priceUnitlUp"
    }
    else{
      this.sortUnit=  "priceUnitDown"
    }
    this.loadCommand_Products(this.sortUnit)
  }
  sortByTotalPrice(){
    if(this.sortTotalPrice==  "priceTotalUp"){
      this.sortTotalPrice = "priceTotalDown"
    }
    else{
      this.sortTotalPrice=  "priceTotalUp"
    }
    this.loadCommand_Products(this.sortTotalPrice)
  }
  sortbyQuantity(){
    console.log(this.sortQuantity)
    if(this.sortQuantity==  "quantityUp"){
      this.sortQuantity = "quantityDown"
    }
    else{
      this.sortQuantity=  "quantityUp"
    }
    this.loadCommand_Products(this.sortQuantity)
  }
  changeCommandProduct(success : any){
    this.currentCommand.command_products = success.command_products
    let index : number = 0;
    console.log(success)
    for(let name of success.productName){
      this.currentCommand.command_products[index].productName = name.title

      index++;
    }
  }

  loadCommand_Products(sortMode : string){

    this.apiCommandProductService.getCommandProduct(this.currentCommand.id.toString(),sortMode).subscribe(success =>{
      this.changeCommandProduct(success)

    })
    
  }

  getCurrentCommandNumber(id: string) {

      this.apiRequestService.getOneCommandFromOneUser(id).subscribe(succes => {
        if (succes) {
          this.currentCommand = this.apiRequestService.getCurrentCommand();
          this.loadCommand_Products("")
        }
        else {
          console.log("ERROR")
          alert("Produit innexistant.");
          this.router.navigate(['/products']);
        }
      })
    

  }
  updateCommandShipping() {
    let Addresse = prompt("Entrez la nouvelle adresse de livraison :", "");
    if(Addresse != null){
      this.currentCommand.shipping_adress = Addresse
        this.apiRequestService.updateCommand(this.currentCommand.id.toString(), this.currentCommand).subscribe(success => {
          if (success) {
            console.log("OK", success)
          }
          else {
            console.log("ERROR")
            alert("ERROR!!!");
          }
        });
      
      
    }

  }
  cancelCommand() {

      this.apiRequestService.deleteCommand(this.currentCommand.id.toString()).subscribe(success => {
        if (success) {
          this.router.navigate(["/profile"])
        }
        else {
          console.log("ERROR")
          alert("ERROR!!!");
        }
      });
    
  }
  deleteProduct(id : number){
    console.log(id)

      this.apiCommandProductService.deleteCommandProduct(this.currentCommand.id.toString(),id.toString()).subscribe(result =>{

      })

  }
  ngOnInit(): void {
    let id: string | null;
    id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.getCurrentCommandNumber(id);
    }
    else {
      console.log("Hacker man ");
    }
  }

}
