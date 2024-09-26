import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {SubscriptionsComponent} from "./subscriptions/subscriptions.component";
import {CreateSubscriptionComponent} from "./create-subscription/create-subscription.component";
import {NgModule} from "@angular/core";
import {ProductsHostedManagerComponent} from "./products-hosted-manager/products-hosted-manager.component";
import {PurchaseComponent} from "./purchase/purchase.component";
import {MySubComponent} from "./my-sub/my-sub.component";
import {MyPurchaseComponent} from "./my-purchase/my-purchase.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'subscriptions',
    component: SubscriptionsComponent
  },
  {
    path: 'products/:productId',
    component: CreateSubscriptionComponent
  },
  {
    path: 'manageHostedProducts',
    component: ProductsHostedManagerComponent
  },
  {
    path:'purchase/:productHostedId',
    component: PurchaseComponent
  },
  {
    path:'mySub',
    component: MySubComponent
  },
  {
    path: 'myPurchase',
    component: MyPurchaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
