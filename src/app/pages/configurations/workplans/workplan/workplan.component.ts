import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Workplan} from "../../../../models/workplan";
import {WorkplanService} from "../../../../services/workplan.service";

@Component({
  selector: 'app-workplan',
  templateUrl: './workplan.component.html',
  styleUrls: ['./workplan.component.scss']
})
export class WorkplanComponent implements OnInit {

  formWorkplan !: FormGroup;

  workplan: Workplan;

  idWorkplan: number;

  updateMode: boolean;

  deleting: boolean = false;

  creatingOrUpdating: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private workplanService: WorkplanService, private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.buildForm();

    this.route.params.subscribe((params) => {
      this.idWorkplan = params['id'];
    });

    if (this.idWorkplan != null) {
      this.updateMode = true;
      this.getWorkplan(this.idWorkplan);
    }
  }

  buildForm() {
    this.formWorkplan = this.formBuilder.group({
      id: null,
      nombre: ['', Validators.required],
      descripcion: ''
    })
  }

  getWorkplan(id: number) {
    this.workplanService.getWorkplan(id).subscribe({
      next: (data) => {
        this.workplan = data;
      }
    });
  }

  updateWorkplan(event: Workplan): void {
    this.creatingOrUpdating = true;
    this.workplanService.updateWorkplan(event.id, event).subscribe({
      next: () => {
        this.goBack();
      },
      complete: () => {
        this.creatingOrUpdating = false;
      }
    });
  }

  createWorkplan(event: Workplan): void {
    this.creatingOrUpdating = true;
    this.workplanService.createWorkplan(event).subscribe({
      next: () => {
        this.goBack();
      },
      complete: () => {
        this.creatingOrUpdating = false;
      }
    });
  }

  onDeleteWorkplan(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.workplanService.deleteWorkplan(this.workplan.id).subscribe({
      next: () => {
        //this.store.dispatch(StructureActions.removeFromList({id: this.workplain.id}));
        this.goBack();
      },
      complete: () => {
        this.deleting = false;
      },
    });
  }

  onCancelWorkplan(event: boolean): void {
    if (event) {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['configurations/workplans'], {
      skipLocationChange: true,
    }).then();
  }

}
