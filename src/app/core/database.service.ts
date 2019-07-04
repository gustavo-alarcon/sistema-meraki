import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Requirement, Correlative, Product, Color, RawMaterial, Warehouse, Category, Unit, ProductionOrder, TicketRawMaterial, DepartureRawMaterial } from './types';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * SYSTEM CORRELATIVES
   */
  requirementCorrelativeDocument: AngularFirestoreDocument<Correlative>;
  requirementCorrelative: Correlative = null;

  public dataRequirementCorrelative = new BehaviorSubject<Correlative>(null);
  public currentDataRequirementCorrelative = this.dataRequirementCorrelative.asObservable();

  orderCorrelativeDocument: AngularFirestoreDocument<Correlative>;
  orderCorrelative: Correlative = null;

  public dataOrderCorrelative = new BehaviorSubject<Correlative>(null);
  public currentDataOrderCorrelative = this.dataOrderCorrelative.asObservable();

  productionOrdersCorrelativeDocument: AngularFirestoreDocument<Correlative>;
  productionOrdersCorrelative: Correlative = null;

  public dataProductionOrdersCorrelative = new BehaviorSubject<Correlative>(null);
  public currentDataProductionOrdersCorrelative = this.dataProductionOrdersCorrelative.asObservable();

  /**
   * ORDERS
   */
  ordersCollection: AngularFirestoreCollection<Requirement>;
  orders: Array<Requirement> = []

  public dataOrders = new BehaviorSubject<Requirement[]>([]);
  public currentDataOrders = this.dataOrders.asObservable();

  /**
   * REQUIREMENTS
   */
  requirementsCollection: AngularFirestoreCollection<Requirement>;
  requirements: Array<Requirement> = [];

  public dataRequirements = new BehaviorSubject<Requirement[]>([]);
  public currentDataRequirements = this.dataRequirements.asObservable();

  /**
   * PRODUCTION ORDERS
   */
  productionOrdersCollection: AngularFirestoreCollection<ProductionOrder>;
  productionOrders: Array<ProductionOrder> = []

  public dataProductionOrders = new BehaviorSubject<ProductionOrder[]>([]);
  public currentDataProductionOrders = this.dataProductionOrders.asObservable();

  /**
   * PRODUCTS
   */
  productsCollection: AngularFirestoreCollection<Product>;
  products: Array<Product> = [];

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
  colors: Array<Color> = [];

  public dataColors = new BehaviorSubject<Color[]>([]);
  public currentDataColors = this.dataColors.asObservable();

  /**
   * CATEGORIES
   */
  categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Array<Category> = [];

  public dataCategories = new BehaviorSubject<Category[]>([]);
  public currentDataCategories = this.dataCategories.asObservable();

  /**
   * UNITS
   */
  unitsCollection: AngularFirestoreCollection<Unit>;
  units: Array<Unit> = [];

  public dataUnits = new BehaviorSubject<Unit[]>([]);
  public currentDataUnits = this.dataUnits.asObservable();


  /**
   * WAREHOUSES
   */
  warehousesCollection: AngularFirestoreCollection<Warehouse>;
  warehouses: Array<Warehouse> = [];

  public dataWarehouses = new BehaviorSubject<Warehouse[]>([]);
  public currentDataWarehouses = this.dataWarehouses.asObservable();

  /**
   * TICKETS
   */
  ticketsCollection: AngularFirestoreCollection<TicketRawMaterial>;
  tickets: Array<TicketRawMaterial> = [];

  public dataTickets = new BehaviorSubject<TicketRawMaterial[]>([]);
  public currentDataTickets = this.dataTickets.asObservable();

  /**
   * DEPARTURES
   */
  departuresCollection: AngularFirestoreCollection<DepartureRawMaterial>;
  departures: Array<DepartureRawMaterial> = [];

  public dataDepartures = new BehaviorSubject<DepartureRawMaterial[]>([]);
  public currentDataDepartures = this.dataDepartures.asObservable();



  constructor(
    public af: AngularFirestore,
    public auth: AuthService
  ) {
    this.auth.currentDataPermit.subscribe(res => {
      if (res) {
        this.getRequirements(true);
        this.getRequirementsCorrelative();
        this.getOrders(true);
        this.getOrdersCorrelative();
        this.getRawMaterials(true);
        this.getCategories();
        this.getUnits();
        this.getProductionOrders(true);
        this.getProductionOrdersCorrelative();
        this.getTickets(true);
        this.getDepartures(true);
      }
    })

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
      this.requirementsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/requirements`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.requirementsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/requirements`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.requirementsCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.requirements = res;
        this.dataRequirements.next(res);
      })
  }

  getOrders(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.ordersCollection = this.af.collection(`db/${this.auth.userInteriores.db}/orders`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.ordersCollection = this.af.collection(`db/${this.auth.userInteriores.db}/orders`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.ordersCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.orders = res;
        this.dataOrders.next(res);
      })
  }

  getRequirementsCorrelative(): void {
    this.requirementCorrelativeDocument = this.af.doc(`db/${this.auth.userInteriores.db}/correlatives/OR`);
    this.requirementCorrelativeDocument.valueChanges()
      .subscribe(res => {
        this.requirementCorrelative = res;
        this.dataRequirementCorrelative.next(res);
      })
  }

  getOrdersCorrelative(): void {
    this.orderCorrelativeDocument = this.af.doc(`db/${this.auth.userInteriores.db}/correlatives/OPe`);
    this.orderCorrelativeDocument.valueChanges()
      .subscribe(res => {
        this.orderCorrelative = res;
        this.dataOrderCorrelative.next(res);
      })
  }

  // *************************************** PRODUCTION *****************************************

  getRawMaterials(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.rawMaterialsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/rawMaterials`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.rawMaterialsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/rawMaterials`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.rawMaterialsCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.rawMaterials = res;
        this.dataRawMaterials.next(res);
      })
  }

  getCategories(): void {
    this.categoriesCollection = this.af.collection(`db/${this.auth.userInteriores.db}/categories`);
    this.categoriesCollection.valueChanges()
      .subscribe(res => {
        this.categories = res;
        this.dataCategories.next(res);
      })
  }

  getUnits(): void {
    this.unitsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/units`);
    this.unitsCollection.valueChanges()
      .subscribe(res => {
        this.units = res;
        this.dataUnits.next(res);
      })
  }

  getProductionOrders(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.productionOrdersCollection = this.af.collection(`db/${this.auth.userInteriores.db}/productionOrders`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.productionOrdersCollection = this.af.collection(`db/${this.auth.userInteriores.db}/productionOrders`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.productionOrdersCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.productionOrders = res;
        this.dataProductionOrders.next(res);
      })
  }

  getProductionOrdersCorrelative(): void {
    this.productionOrdersCorrelativeDocument = this.af.doc(`db/${this.auth.userInteriores.db}/correlatives/OP`);
    this.productionOrdersCorrelativeDocument.valueChanges()
      .subscribe(res => {
        this.productionOrdersCorrelative = res;
        this.dataProductionOrdersCorrelative.next(res);
      })
  }

  getTickets(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.ticketsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/tickets`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.ticketsCollection = this.af.collection(`db/${this.auth.userInteriores.db}/tickets`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.ticketsCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.tickets = res;
        this.dataTickets.next(res);
      })
  }

  getDepartures(all: boolean, from?: number, to?: number): void {
    if (all) {
      this.departuresCollection = this.af.collection(`db/${this.auth.userInteriores.db}/departures`, ref => ref.orderBy('regDate', 'desc'));
    } else {
      this.departuresCollection = this.af.collection(`db/${this.auth.userInteriores.db}/departures`, ref => ref.where('regDate', '>=', from).where('regDate', '<=', to));
    }

    this.departuresCollection.valueChanges()
      .pipe(
        map(res => {
          res.forEach((element, index) => {
            element['index'] = index;
          });
          return res;
        })
      )
      .subscribe(res => {
        this.departures = res;
        this.dataDepartures.next(res);
      })
  }
}
