import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Requirement } from './types';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * REQUIREMENTS
   */
  requirementsCollection: AngularFirestoreCollection<Requirement>;
  requirements: Array<Requirement>;

  public dataRequirements = new BehaviorSubject<Requirement[]>([]);
  public currentDataRequirements = this.dataRequirements.asObservable();

  /**
   * PRODUCTS
   */
  productsCollection: AngularFirestoreCollection<Requirement>;
  products: Array<Requirement>;

  public dataProducts = new BehaviorSubject<Requirement[]>([]);
  public currentDataProducts = this.dataProducts.asObservable();

  /**
   * COLORS
   */
  colorsCollection: AngularFirestoreCollection<Requirement>;
  colors: Array<Requirement>;

  public dataColors = new BehaviorSubject<Requirement[]>([]);
  public currentDataColors = this.dataColors.asObservable();

  constructor(
    public af: AngularFirestore
  ) { 

  }

  /**
   * @desc Function to get the requirements coleection from firestore
   * @param all {boolean} flag to get all or a range of requirements based in date
   * @param from {number} time in milliseconds
   * @param to {number} time in milliseconds
   */
  getRequirements(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.requirementsCollection = this.af.collection(`db/requirements`);
    } else {
      this.requirementsCollection = this.af.collection(`db/requirements`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.requirementsCollection.valueChanges()
      .subscribe(res => {
        this.requirements = res;
        this.dataRequirements.next(res);
      })
  }
}
