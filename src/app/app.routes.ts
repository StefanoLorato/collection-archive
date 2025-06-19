import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionListComponent } from './components/collection/collection-lists/collection-list.component';
import { CollectionFormComponent } from './components/collection/collection-form/collection-form.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';

import { ItemAddComponent } from './components/item/item-add/item-add.component';
import { ItemEditComponent } from './components/item/item-edit/item-edit.component';
import { CollectionDetailComponent } from './components/collection/collection-detail/collection-detail.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
import { LoginFormComponent } from './components/auth/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { WishListComponent } from './components/wishlist/wish-list/wish-list.component';
import { ShippingAddressFormComponent } from './components/order/shipping-address-form/shipping-address-form.component';
import { PaymentFormComponent } from './components/order/payment-form/payment-form.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { CartItemListComponent } from './components/order/cart-item-list/cart-item-list.component';
import { PrivateCollectionGuard } from './guards/private-collection-guard';
import { NotForSaleGuard } from './guards/not-for-sale-guard';
import { UnauthorizedComponent } from './components/error/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { PurchaseComponent } from './components/order/purchase/purchase.component';
import { BookmarklistComponent } from './components/bookmark/bookmarklist/bookmarklist.component';
import { CommentListComponent } from './components/comment/comment-list/comment-list.component';
import { DiscussionComponent } from './components/discussion/discussion/discussion.component';
import { DiscussionListComponent } from './components/discussion/discussion-list/discussion-list.component';

export const routes: Routes = [
     { path: '', redirectTo: 'login', pathMatch: 'full' },
     { path: 'home', component: HomeComponent },
     { path: 'dashboard', component: DashboardComponent },
     { path: 'collection-list', component: CollectionListComponent },
     { path: 'collection-list/:categoryId', component: CollectionListComponent },
     { path: 'collection-form', component: CollectionFormComponent },
     { path: 'collection-detail/:id', component: CollectionDetailComponent, canActivate: [PrivateCollectionGuard]},
     { path: 'edit-collection-form/:id', component: CollectionFormComponent },
     { path: 'item-list', component: ItemListComponent },
     { path: 'item-edit/:id', component: ItemEditComponent },
     { path: 'item-add/:collectionId/:userId', component: ItemAddComponent },
     { path: 'register', component: RegisterFormComponent },
     { path: 'login', component: LoginFormComponent },
     { path: 'user-profile/:id', component: UserProfileComponent},
     { path: 'wishlist/:id', component: WishListComponent },
     { path: 'purchase/collection/:id', component: PurchaseComponent, canActivate: [NotForSaleGuard]},
     { path: 'purchase/item/:id', component: PurchaseComponent, canActivate: [NotForSaleGuard]},
     { path: 'shipping-address-form', component: ShippingAddressFormComponent},
     { path: 'payment-form', component: PaymentFormComponent},
     { path: 'order-list/:id', component: OrderListComponent},
     { path: 'bookmarkslist/:id', component: BookmarklistComponent},
     { path: 'cart-item-list/:id', component: CartItemListComponent},
     { path: 'item-list', component: ItemListComponent},
     { path: 'unauthorized', component: UnauthorizedComponent },
     { path: 'not-found', component: NotFoundComponent },
     { path: 'comment-list/:id', component: CommentListComponent },
     { path: 'discussion/:id', component: DiscussionComponent},
     { path: 'discussion-list/:id', component: DiscussionListComponent}

];
