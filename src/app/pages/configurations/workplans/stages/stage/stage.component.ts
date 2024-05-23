import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WorkplanService} from "../../../../../services/workplan.service";
import {Stage} from "../../../../../models/workplan";
import {finalize} from "rxjs";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  idStage: number;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  stage: Stage;

  constructor(private route: ActivatedRoute, private workplanService: WorkplanService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idStage = params['id'];
    });

    if (this.idStage != null) {
      this.updateMode = true;
      this.getStage(this.idStage);
    }
  }

  getStage(idStage: number) {
    this.workplanService.getStage(idStage).subscribe({
      next: (data) => {
        this.stage = data;
      }
    })
  }

  updateStage(event: Stage): void {
    console.log(event);
    this.creatingOrUpdating = true;
    this.workplanService.updateStage(event.id, event).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })).subscribe({
      next: () => {
        this.goBack();
      }
    });
  }

  createStage(event: Stage): void {
    console.log(event);
    this.creatingOrUpdating = true;
    this.workplanService.createStage(event).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })).subscribe({
      next: () => {
        this.goBack();
      }
    });
  }

  onCancelStage(event: boolean) {
    if (event) {
      this.goBack();
    }
  }

  onDeleteStage(event: Stage) {
    this.deleting = true;
    this.workplanService.deleteStage(event.id).pipe(
      finalize(() => {
        this.deleting = false;
      })).subscribe({
      next: () => {
        this.goBack();
      }
    })
  }

  goBack() {
    this.router.navigate(['configurations/workplans/stages'], {
      skipLocationChange: true,
    }).then();
  }

}
