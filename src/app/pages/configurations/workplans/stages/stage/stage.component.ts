import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {WorkplanService} from "../../../../../services/workplan.service";
import {Stage} from "../../../../../models/workplan";

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
    this.creatingOrUpdating = true;
    this.workplanService.updateStage(event.id, event).subscribe({
      next: () => {
        this.goBack();
      },
      complete: () => {
        this.creatingOrUpdating = false;
      }
    });
  }

  createStage(event: Stage): void {
    this.creatingOrUpdating = true;
    this.workplanService.createStage(event).subscribe({
      next: () => {
        this.goBack();
      },
      complete: () => {
        this.creatingOrUpdating = false;
      }
    });
  }

  onCancelStage(event: boolean) {
    if (event) {
      this.goBack();
    }
  }

  onDeleteStage(event: Stage) {
    console.log(event);
    this.workplanService.deleteStage(event.id).subscribe({
      next: () => {
        this.goBack();
      },
      complete: () => {
        this.deleting = false;
      }
    })
  }

  goBack() {
    this.router.navigate(['configurations/workplans/stages'], {
      skipLocationChange: true,
    }).then();
  }

}
