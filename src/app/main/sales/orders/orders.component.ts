import { Component, OnInit } from '@angular/core';

export interface Link {
  path: string;
  label: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  navLinks: Array<Link> = [
    {path: 'form', label: 'Solicitar'},
    {path: 'list', label: 'Lista'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
