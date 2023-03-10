import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CommandsViewComponent } from './components/commands-view/commands-view.component';
import { SigninupAccessGuard } from './guards/signinup-access.guard';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HelpComponent } from './components/help/help.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminAccessGuard } from './guards/admin-access.guard';
import { CartComponent } from './components/cart/cart.component';
import { LoginAccessGuard } from './guards/login-access.guard';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductsSommaryComponent } from './components/products-sommary/products-sommary.component';
import { UserCommandSummariesComponent } from './components/user-command-summaries/user-command-summaries.component';
import { UserConversationMessagesSummaryComponent } from './components/user-conversation-messages-summary/user-conversation-messages-summary.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [SigninupAccessGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [SigninupAccessGuard] },
  { path: 'commands/:id', component: CommandsViewComponent , canActivate: [LoginAccessGuard]},
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductViewComponent }, //todo proteger la route
  { path: 'profile', component: ProfileComponent , canActivate: [LoginAccessGuard]  }, //todo proteger la route
  { path: 'conversation/:id', component: ConversationComponent }, //todo proteger la route
  { path: 'help', component: HelpComponent, canActivate: [LoginAccessGuard] }, //todo proteger la route
  { path: 'admin', component: AdminComponent, canActivate: [AdminAccessGuard] },
  { path: 'products-sommary', component: ProductsSommaryComponent, canActivate: [AdminAccessGuard] },
  { path: 'cart', component: CartComponent, canActivate: [LoginAccessGuard] },
  { path: 'checkout/:shipping', component: CheckoutComponent , canActivate: [LoginAccessGuard] },
  { path: '', component: WelcomeComponent },
  { path: 'usercommandsummary', component: UserCommandSummariesComponent, canActivate: [AdminAccessGuard] },
  { path: 'user_conversation_messages_summary', component: UserConversationMessagesSummaryComponent, canActivate: [AdminAccessGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
