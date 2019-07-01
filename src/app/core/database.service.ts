import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Requirement, Correlative, Product, Color, RawMaterial, Warehouse, Category, Unit } from './types';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * SYSTEM CORRELATIVES
   */
  requirementCorrelativeDocument: AngularFirestoreDocument<Correlative>;
  requirementCorrelative: Correlative;

  public dataRequirementCorrelative = new BehaviorSubject<Correlative>(null);
  public currentDataRequirementCorrelative = this.dataRequirementCorrelative.asObservable();

  orderCorrelativeDocument: AngularFirestoreDocument<Correlative>;
  orderCorrelative: Correlative;

  public dataOrderCorrelative = new BehaviorSubject<Correlative>(null);
  public currentDataOrderCorrelative = this.dataOrderCorrelative.asObservable();

  /**
   * ORDERS
   */
  ordersCollection: AngularFirestoreCollection<Requirement>;
  orders: Array<Requirement>;

  public dataOrders = new BehaviorSubject<Requirement[]>([]);
  public currentDataOrders = this.dataOrders.asObservable();

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
  productsCollection: AngularFirestoreCollection<Product>;
  products: Array<Product>;

  public dataProducts = new BehaviorSubject<Product[]>([]);
  public currentDataProducts = this.dataProducts.asObservable();

  /**
   * RAW MATERIAL
   */
  rawMaterialsCollection: AngularFirestoreCollection<RawMaterial>;
  rawMaterials: Array<RawMaterial> = [];

  public dataRawMaterials = new BehaviorSubject<RawMaterial[]>([]);
  public currentDataRawMaterials = this.dataRawMaterials.asObservable();

  /**
   * COLORS
   */
  colorsCollection: AngularFirestoreCollection<Color>;
  colors: Array<Color>;

  public dataColors = new BehaviorSubject<Color[]>([]);
  public currentDataColors = this.dataColors.asObservable();

  /**
   * CATEGORIES
   */
  categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Array<Category>;

  public dataCategories = new BehaviorSubject<Category[]>([]);
  public currentDataCategories = this.dataCategories.asObservable();

  /**
   * UNITS
   */
  unitsCollection: AngularFirestoreCollection<Unit>;
  units: Array<Unit>;

  public dataUnits = new BehaviorSubject<Unit[]>([]);
  public currentDataUnits = this.dataUnits.asObservable();


  /**
   * WAREHOUSES
   */
  warehousesCollection: AngularFirestoreCollection<Warehouse>;
  warehouses: Array<Warehouse>;

  public dataWarehouses = new BehaviorSubject<Warehouse[]>([]);
  public currentDataWarehouses = this.dataWarehouses.asObservable();

  

  constructor(
    public af: AngularFirestore
  ) { 
    this.getRequirements(true);
    this.getRequirementsCorrelative();
    this.getOrders(true);
    this.getOrdersCorrelative();
    this.getRawMaterials(true);
    this.getCategories();
    this.getUnits();
  }

  // *************************************** SALES ********************************************

  /**
   * @desc Function to get the requirements coleection from firestore
   * @param all {boolean} flag to get all or a range of requirements based in date
   * @param from {number} time in milliseconds
   * @param to {number} time in milliseconds
   */
  getRequirements(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.requirementsCollection = this.af.collection(`db/dbs_interiores/requirements`, ref => ref.orderBy('regDate','desc'));
    } else {
      this.requirementsCollection = this.af.collection(`db/dbs_interiores/requirements`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.requirementsCollection.valueChanges()
      .subscribe(res => {
        this.requirements = res;
        this.dataRequirements.next(res);
      })
  }

  getOrders(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.ordersCollection = this.af.collection(`db/dbs_interiores/orders`, ref => ref.orderBy('regDate','desc'));
    } else {
      this.ordersCollection = this.af.collection(`db/dbs_interiores/orders`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.ordersCollection.valueChanges()
      .subscribe(res => {
        this.orders = res;
        this.dataOrders.next(res);
      })
  }

  getRequirementsCorrelative(): void {
    this.requirementCorrelativeDocument = this.af.doc(`db/dbs_interiores/correlatives/OR`);
    this.requirementCorrelativeDocument.valueChanges()
      .subscribe(res => {
        this.requirementCorrelative = res;
        this.dataRequirementCorrelative.next(res);
      })
  }

  getOrdersCorrelative(): void {
    this.orderCorrelativeDocument = this.af.doc(`db/dbs_interiores/correlatives/OPe`);
    this.orderCorrelativeDocument.valueChanges()
      .subscribe(res => {
        this.orderCorrelative = res;
        this.dataOrderCorrelative.next(res);
      })
  }

  // *************************************** PRODUCTION *****************************************

  getRawMaterials(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.rawMaterialsCollection = this.af.collection(`db/dbs_interiores/rawMaterials`, ref => ref.orderBy('regDate','desc'));
    } else {
      this.rawMaterialsCollection = this.af.collection(`db/dbs_interiores/rawMaterials`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.rawMaterialsCollection.valueChanges()
      .subscribe(res => {
        this.rawMaterials = res;
        this.dataRawMaterials.next(res);
      })
  }

  getCategories(): void {
    this.categoriesCollection = this.af.collection(`db/dbs_interiores/categories`);
    this.categoriesCollection.valueChanges()
      .subscribe(res => {
        this.categories = res;
        this.dataCategories.next(res);
      })
  }

  getUnits(): void {
    this.unitsCollection = this.af.collection(`db/dbs_interiores/units`);
    this.unitsCollection.valueChanges()
      .subscribe(res => {
        this.units = res;
        this.dataUnits.next(res);
      })
  }
}
