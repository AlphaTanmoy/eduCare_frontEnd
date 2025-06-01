import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../../../../common-component/custom-alert/custom-alert.component';
import { StudentService } from '../../../../service/student/student.service';
import { firstValueFrom } from 'rxjs';
import { ResponseTypeColor } from '../../../../constants/commonConstants';

@Component({
  selector: 'app-manage-student',
  imports: [],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.css'
})
export class ManageStudentComponent {
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  matProgressBarVisible = false;
  readonly dialog = inject(MatDialog);

  constructor(
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
  ) { }

  async ngOnInit() {
    this.bootstrapElements = loadBootstrap();

    try {
      this.activeMatProgressBar();
      const res = await firstValueFrom(this.studentService.getAllAvailableStudents());
      if (res.status !== 200) {
        this.openDialog("Student", res.message, ResponseTypeColor.ERROR, false);
        return;
      }

      console.log(res.data);
    } catch (error) {
      this.openDialog("Student", "Internal server error", ResponseTypeColor.ERROR, false);
    } finally {
      this.hideMatProgressBar();
    }
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  activeMatProgressBar() {
    this.matProgressBarVisible = true;
    this.cdr.detectChanges();
  }

  hideMatProgressBar() {
    this.matProgressBarVisible = false;
    this.cdr.detectChanges();
  }

  openDialog(dialogTitle: string, dialogText: string, dialogType: number, pageReloadNeeded: boolean): void {
    const dialogRef = this.dialog.open(CustomAlertComponent, { data: { title: dialogTitle, text: dialogText, type: dialogType } });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (pageReloadNeeded) {
        window.location.reload();
      }
    });
  }
}
