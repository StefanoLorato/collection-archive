import { inject, Injectable } from "@angular/core";
import { CollectionService } from "../service/collectionService";
import { ItemService } from "../service/itemService";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { DataService } from "../service/dataService";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class PrivateCollectionGuard implements CanActivate{
  private _collectionService = inject(CollectionService);
  private _router = inject(Router);
  private _dataService = inject(DataService);
  currentUser! : User;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const collectionId = Number(route.paramMap.get("id")!);
    const user = this._dataService.getLastSelectedUser();
    return this._collectionService.getCollectionById(collectionId).pipe(
      map(c => {
        if(c.visibility == "visible" || (user != null && user.userId == c.userId)){
          return true;
        }
        else {
          return this._router.createUrlTree(['/unauthorized']);
        }
      }),
      catchError(err => of(this._router.createUrlTree(['/not-found'])))
    );
  }
}
