import { Component, OnInit } from '@angular/core';

export interface Link {
  path: string;
  label: string;
}

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
})
export class RequirementsComponent implements OnInit {

  navLinks: Array<Link> = [
    {path: 'form', label: 'Solicitar'},
    {path: 'list', label: 'Lista'}
  ];

  cols: string = '12';
  gutter: string = '24px';

  constructor() { }

  ngOnInit() {
  }

}
