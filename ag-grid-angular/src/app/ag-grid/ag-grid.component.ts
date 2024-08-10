import { Component, inject, OnInit } from '@angular/core';
import { ColDef, GridReadyEvent, GridApi, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit{
  private empService: EmployeeService = inject(EmployeeService);
  empData:any[] = [];
  gridOptions!: GridOptions; 
  private gridApi! : GridApi<any>;
  paginationPageSizeSelector: number[] = [5,7,10,15,20];
  paginationPageSize: number = 5;

  ngOnInit(): void { 
    this.empService.getAllEmployee().subscribe({ 
      next: (res)=>{ 
        this.empData = res;
        this.loadGrid(); 
        console.log(this.empData); 
      },
      error: (err)=>{ 
        console.log(err);
      } })
  }
      
  loadGrid(){ 
    this.gridOptions = { 
      columnDefs: this.columnDefs,
      rowData: this.empData, 
      defaultColDef: this.defaultColDef, 
      rowSelection: 'multiple', 
      pagination: true, 
      paginationPageSize: this.paginationPageSize, 
      paginationPageSizeSelector: this.paginationPageSizeSelector, 
      onGridReady: this.onGridReady.bind(this) 
    }; 
  } 

  columnDefs: ColDef[] = [
    { field: 'id', headerName: "Id", checkboxSelection: true, headerCheckboxSelection: true},
    { field: 'firstname', headerName: "First Name", valueFormatter: p => p.value.toLocaleString() },
    { field: 'lastname', headerName: "Last Name" },
    { headerName: "Full Name", valueGetter: params => params.data.firstname + ' ' + params.data.lastname },
    { field: 'email', headerName: "Email" }
  ];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: 'agTextColumnFilter',
    sorting: true,
  }

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];

  onGridReady(event: GridReadyEvent){
    this.gridApi = event.api;
  }
  onBtExport(){
    this.gridApi.exportDataAsCsv();
  }
}
