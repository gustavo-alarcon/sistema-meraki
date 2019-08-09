import { Component, OnInit, ViewChild } from '@angular/core';
import { Provider, RawMaterial } from 'src/app/core/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/core/database.service';
import { MatDialogRef, MatSnackBar, MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RawMaterialCreateDialogComponent } from 'src/app/main/production/raw-material/raw-material-create-dialog/raw-material-create-dialog.component';
import { startWith, map } from 'rxjs/operators';
import { isObjectValidator } from 'src/app/core/is-object-validator';
import { PurchasesRegisterAddProviderDialogComponent } from '../purchases-register-add-provider-dialog/purchases-register-add-provider-dialog.component';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { PurchasesRegisterEditItemDialogComponent } from '../purchases-register-edit-item-dialog/purchases-register-edit-item-dialog.component';
import { PurchasesRegisterAddRawDialogComponent } from '../purchases-register-add-raw-dialog/purchases-register-add-raw-dialog.component';

@Component({
  selector: 'app-purchases-register-create-dialog',
  templateUrl: './purchases-register-create-dialog.component.html',
  styles: []
})
export class PurchasesRegisterCreateDialogComponent implements OnInit {

  loading = false;

  dataFormGroup: FormGroup;
  itemFormGroup: FormGroup;

  filteredProviders: Observable<Provider[]>;
  filteredRawMaterials: Observable<RawMaterial[]>;

  documentTypes = [
    'FACTURA',
    'BOLETA',
    // 'Recibo por honorarios electrónico',
    // 'Factura electrónica',
    // 'Boleta electrónica',
    // 'Nota de crédito de RHE electrónica',
    // 'Nota de crédito electrónica boleta',
    // 'Nota de débito electrónica boleta',
    // 'Nota de crédito electrónica factura',
    // 'Nota de débito electrónica factura',
    // 'Guia de remisión remitente - bienes fiscalizables',
    // 'Guía de remisión remitente complementaria - bienes fiscalizables',
    // 'Guia de remisión transportista - bienes fiscalizables',
    // 'Guia de remisión transportista complementaría - bienes fiscalizables',
    // 'Ticket POS',
    // 'Ticket ME',
    // 'Nota de crédito ME',
    // 'Envío resumen factura',
    // 'Envío resumen boleta',
    // 'Envío resumen nota de crédito',
    // 'Envío resumen nota de débito',
    // 'Envío resumen ticket',
    // 'Comprobante de retención',
    // 'Comprobante de percepción'
  ];

  displayedColumns: string[] = ['index', 'item', 'quantity', 'import', 'actions'];


  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  providerSelected: boolean = false;
  provider: Provider = {
    id: '',
    name: '',
    shortName: '',
    ruc: 0,
    address: '',
    phone: '',
    createdBy: '',
    createdByUid: '',
    regDate: 0
  };

  itemsList = [];
  currentItem: any;

  paymentTypes = [
    'EFECTIVO',
    'CREDITO',
    'TARJETA'
  ];

  subscriptions: Array<Subscription> = [];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PurchasesRegisterCreateDialogComponent>,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.createForm();
    this.createItemForm();

    this.filteredProviders =
      this.dataFormGroup.get('provider').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.ruc.toString()),
          map(value => value ? this.dbs.providers.filter(option => option.ruc.toString().includes(value) || option.name.toLowerCase().includes(value)) : this.dbs.providers)
        );

    this.filteredRawMaterials =
      this.itemFormGroup.get('item').valueChanges
        .pipe(
          startWith<any>(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()),
          map(value => value ? this.dbs.rawMaterials.filter(option => option.name.toLowerCase().includes(value) || option.code.toLowerCase().includes(value)) : this.dbs.rawMaterials)
        );
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      documentDate: [null, [Validators.required]],
      provider: [null, [Validators.required, isObjectValidator]],
      documentType: [null, [Validators.required]],
      documentSerial: [null, [Validators.required]],
      documentCorrelative: [null, [Validators.required]],
      description: [null, [Validators.required]],
      subtotalImport: null,
      igvImport: null,
      totalImport: [null, [Validators.required]],
      paymentType: [null, [Validators.required]],
      paidImport: [null, [Validators.required]],
      indebtImport: [null, [Validators.required]],
      detractionImport: null,
      detractionDate: null,
    });
  }

  createItemForm(): void {
    this.itemFormGroup = this.fb.group({
      item: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      import: [null, [Validators.required]]
    });
  }

  showProvider(provider: Provider): string | null {
    return provider ? provider.name : null;
  }

  selectedProvider(event) {
    this.provider = event.option.value;
    this.providerSelected = true;
  }

  showItem(item: RawMaterial | string): string {
    if (item === null) return '';
    return (typeof item === 'string') ? item : item.name;
  }

  selectedItem(event) {
    this.itemFormGroup.get('quantity').setValue(null);
    this.itemFormGroup.get('import').setValue(null);
  }

  addProvider(): void {
    this.dialog.open(PurchasesRegisterAddProviderDialogComponent)
      .afterClosed().subscribe(res => {
        if (res) {
          this.dataFormGroup.get('provider').setValue(res);
          this.provider = res;
          this.providerSelected = true;
        } else {
          this.dataFormGroup.get('provider').setValue(this.provider);
        }
      });
  }

  addRawMaterial(): void {
    this.dialog.open(PurchasesRegisterAddRawDialogComponent)
      .afterClosed().subscribe(res => {
        if (res) {
          this.itemFormGroup.get('item').setValue(res);
        } else {
          this.itemFormGroup.get('item').setValue('');
        }
      });
  }

  addItem() {
    if (this.itemFormGroup.valid) {
      const data = {
        index: this.itemsList.length,
        name: this.itemFormGroup.value['item']['name'] ? this.itemFormGroup.value['item']['name'] : this.itemFormGroup.value['item'],
        quantity: this.itemFormGroup.value['quantity'],
        import: this.itemFormGroup.value['import']
      }

      this.itemsList.push(data);
      this.dataSource.data = this.itemsList;

      this.itemFormGroup.get('item').setValue('');
      this.itemFormGroup.get('quantity').setValue('');
      this.itemFormGroup.get('import').setValue('');

    } else {
      this.snackbar.open('Debe completar los campos para agregar un Item!', 'Cerrar', {
        duration: 6000
      });
    }
  }

  editItem(item): void {
    this.dialog.open(PurchasesRegisterEditItemDialogComponent, {
      data: {
        item: item
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.itemsList[res.index] = res;
        this.dataSource.data = this.itemsList;
        this.snackbar.open(`Item ${res.name} editado!`, 'Cerrar', {
          duration: 6000
        });
      }
    })
  }

  deleteItem(item): void {
    this.itemsList.splice(item.index, 1);

    this.itemsList.forEach((element, index) => {
      element.index = index;
    });

    this.dataSource.data = this.itemsList;

    this.snackbar.open(`Item ${item.name} borrado!`, 'Cerrar', {
      duration: 6000
    });
  }



}
