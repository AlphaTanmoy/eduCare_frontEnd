import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap } from '../../../../load-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from '../../../constants/commonConstants';
import { StudentService } from '../../../service/student/student.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-manage-exam-marks',
  imports: [
    CommonModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatProgressBarModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './manage-exam-marks.component.html',
  styleUrl: './manage-exam-marks.component.css'
})
export class ManageExamMarksComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  readonly dialog = inject(MatDialog);
  matProgressBarVisible = false;

  StudentId: string | null = null;

  MaximumPracticalMarks: number = 0;
  MaximumTheoreticalMarks: number = 0;
  ModuleCount: number = 0;
  ModuleDetails: any[] = [];
  OriginalMarks: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.bootstrapElements = loadBootstrap();
    this.route.params.subscribe(params => {
      this.StudentId = params['studentId'];
      if (!this.StudentId) {
        this.openDialog("Marks Update", "Student Id is required", ResponseTypeColor.ERROR, 'control-panel/manage-student');
        return;
      }
    });
    this.FetchStudentCourseDetails();
  }

  FetchStudentCourseDetails() {
    this.activeMatProgressBar();

    this.studentService.getStudentCourseInfo(this.StudentId).subscribe({
      next: (response) => {
        this.hideMatProgressBar();

        if (response.status === 200) {
          this.MaximumPracticalMarks = response.data[0].maximum_practical_marks;
          this.MaximumTheoreticalMarks = response.data[0].maximum_theory_marks;
          this.ModuleCount = response.data[0].module_count;
          this.ModuleDetails = response.data[0].module_details;
          this.OriginalMarks = response.data[0].original_marks;

          console.log("this.MaximumPracticalMarks", this.MaximumPracticalMarks);
          console.log("this.MaximumTheoreticalMarks", this.MaximumTheoreticalMarks);
          console.log("this.ModuleCount", this.ModuleCount);
          console.log("this.ModuleDetails", this.ModuleDetails);
          console.log("this.OriginalMarks", this.OriginalMarks);
        } else {
          this.openDialog("Student", response.message, ResponseTypeColor.ERROR, null);
        }
      },
      error: (err) => {
        this.hideMatProgressBar();
        this.openDialog("Student", err.error.message ?? "Internal server error", ResponseTypeColor.ERROR, null);
      }
    });
  }

  SaveMarks(data: any) {
    
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
