import { inject, Injectable } from "@angular/core";
import { CollectionService } from "../service/collectionService";
import { ItemService } from "../service/itemService";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { DataService } from "../service/dataService";
import { GeneralItem } from "../models/general-item";

@Injectable({
  providedIn: 'root'
})
export class NotForSaleGuard implements CanActivate{
  private _collectionService = inject(CollectionService);
  private _itemService = inject(ItemService);
  private _dataService = inject(DataService);
  private _router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const path = route.routeConfig?.path;
    const id = Number(route.paramMap.get("id")!);
    const user = this._dataService.getLastSelectedUser();
    let $item: Observable<GeneralItem>;
    if(path == "purchase/collection/:id"){
      $item = this._collectionService.getCollectionById(id);
    } else {
      $item = this._itemService.getItemById(id);
    }
    return $item.pipe(
      map(c => {
        if(c.forSale && (user != null && user.userId != c.userId)){
          return true;
        } else {
          return this._router.createUrlTree(['/unauthorized']);
        }
      }),
      catchError(err => of(this._router.createUrlTree(['/not-found'])))
    );
  }
}
