import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CommandsComponent } from './components/commands/commands.component';

import { SigninupAccessGuard } from './guards/signinup-access.guard';
import { ProductViewComponent } from './components/product-view/product-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [SigninupAccessGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [SigninupAccessGuard] },
  { path: 'commands', component: CommandsComponent, canActivate: [SigninupAccessGuard] },
  { path: 'products/:id', component: ProductViewComponent },
  { path: '', component: WelcomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
