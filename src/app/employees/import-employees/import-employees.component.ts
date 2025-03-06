import { Component } from '@angular/core';
import { PossibleFields } from '../../shared/models/import-fields';
import { EmployeeService } from '../../services/employee/employee.service';
import { Option } from '../../../libs/matchy/src/models/classes/option';
import { Matchy } from '../../../libs/matchy/src/main';

@Component({
  selector: 'app-import-employees',
  imports: [],
  templateUrl: './import-employees.component.html',
  styleUrl: './import-employees.component.css'
})
export class ImportEmployeesComponent {
  possible_fiels!: Option[]

  constructor(
    private employeeService: EmployeeService
  ) {

  }

  ngOnInit() {
    this.loadMatchyLib()
  }

  loadMatchyLib() {
    //   this.employeeService.getPossibleFields().subscribe({
    //     next: (res) => {
    //       debugger
    //       this.possible_fiels = res.possible_fields
    //       const matchy = new Matchy(this.possible_fiels)
    //       document.getElementById("matchy")?.appendChild(matchy)
    //     },
    //     error: (error) => {
    //       console.log(error)
    //     }
    //   })
  }
}
