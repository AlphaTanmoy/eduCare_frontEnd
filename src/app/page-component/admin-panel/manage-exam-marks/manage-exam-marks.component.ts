import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap } from '../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../constants/commonConstants';

@Component({
  selector: 'app-manage-exam-marks',
  imports: [],
  templateUrl: './manage-exam-marks.component.html',
  styleUrl: './manage-exam-marks.component.css'
})
export class ManageExamMarksComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;
  
  studentId: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.params.subscribe(params => {
      this.studentId = params['studentId'];
      if (!this.studentId) {
        this.openDialog("Course","Student Id is required", ResponseTypeColor.ERROR, 'control-panel/manage-student');
        return;
      }
      // this.fetchCourseDetails();
    });
  }

  activeMatProgressBar() {
      this.matProgressBarVisible = true;
      this.cdr.detectChanges();
    }
  
    hideMatProgressBar() {
      this.matProgressBarVisible = false;
      this.cdr.detectChanges();
    }
  
    openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
      const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (navigateRoute) {
          this.router.navigate([navigateRoute]);
        }
      });
    }
}
