import { CourseListComponent } from './page-component/admin-panel/course-management/course-list/course-list.component';
import { Routes } from '@angular/router';
import { UserRole } from './constants/commonConstants';
import { HomeComponent } from './page-component/home/home.component';
import { DownloadCertificateComponent } from './page-component/academic/download-certificate/download-certificate.component';
import { DownloadFormComponent } from './page-component/academic/download-form/download-form.component';
import { PayFeesComponent } from './page-component/academic/pay-fees/pay-fees.component';
import { SpokenEnglishComponent } from './page-component/course-offered/spoken-english/spoken-english.component';
import { EBookComponent } from './page-component/student/e-book/e-book.component';
import { MarksDivisionComponent } from './page-component/student/marks-division/marks-division.component';
import { NotesComponent } from './page-component/student/notes/notes.component';
import { SoftwareDownloadComponent } from './page-component/student/software-download/software-download.component';
import { NoticeHolidayComponent } from './page-component/student/notice/notice-holiday/notice-holiday.component';
import { NoticeRegistrationComponent } from './page-component/student/notice/notice-registration/notice-registration.component';
import { AboutInstitutionComponent } from './page-component/about/about-institution/about-institution.component';
import { AboutRegistrationComponent } from './page-component/about/about-registration/about-registration.component';
import { CenterVerifyComponent } from './page-component/verification/center-verify/center-verify.component';
import { StudentVerifyComponent } from './page-component/verification/student-verify/student-verify.component';
import { CourseCertificateVerifyComponent } from './page-component/verification/certificate-verify/course-certificate-verify/course-certificate-verify.component';
import { OtherCertificateVerifyComponent } from './page-component/verification/certificate-verify/other-certificate-verify/other-certificate-verify.component';
import { OtherCourseComponent } from './page-component/course-offered/other-course/other-course.component';
import { ComputerCourseComponent } from './page-component/course-offered/computer-course/computer-course.component';
import { DanceCourseComponent } from './page-component/course-offered/dance-course/dance-course.component';
import { DrawingCourseComponent } from './page-component/course-offered/drawing-course/drawing-course.component';
import { GallaryComponent } from './page-component/gallary/gallary.component';
import { ErrorComponent } from './error/error.component';
import { ContactComponent } from './page-component/contact-us/contact/contact.component';
import { FeedbackComponent } from './page-component/contact-us/feedback/feedback.component';
import { RulesComponent } from './page-component/contact-us/rules/rules.component';
import { CreateUserComponent } from './page-component/admin-panel/create-user/create-user.component';
import { HomeSlideshowComponent } from './page-component/admin-panel/update-dashboard-details/home-slideshow/home-slideshow.component';
import { EnumsComponent } from './page-component/admin-panel/enums/enums.component';
import { FranchiseRegistrationComponent } from './page-component/academic/franchise-registration/franchise-registration.component';
import { StudentRegistrationComponent } from './page-component/student/student-registration/student-registration.component';
import { LoginComponent } from './page-component/login/login.component';
import { AuthGuard } from './service/auth/Auth.guard';
import { UnAuthorizeComponent } from './un-authorize/un-authorize.component';
import { LogoutComponent } from './logout/logout.component';
import { AppComponent } from './app.component';
import { MasterDetailsComponent } from './page-component/admin-panel/update-dashboard-details/master-details/master-details.component';
import { BackupComponent } from './page-component/admin-panel/data-backup/backup/backup.component';
import { ApplyFranchiesComponent } from './page-component/academic/apply-franchies/apply-franchies.component';
import { AddPrimaryCourseCategoryComponent } from './page-component/admin-panel/course-management/add-primary-course-category/add-primary-course-category.component';
import { AddSubCourseCategoryComponent } from './page-component/admin-panel/course-management/add-sub-course-category/add-sub-course-category.component';
import { ViewCourseComponent } from './page-component/admin-panel/course-management/view-course/view-course.component';
import { EditSubCourseCategoryComponent } from './page-component/admin-panel/course-management/edit-sub-course-category/edit-sub-course-category.component';
import { ManageCenterComponent } from './page-component/admin-panel/manage-franchise/manage-center/manage-center.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    // { path: 'app', component: AppComponent }, 
    { path: 'home', component: HomeComponent },
    { path: 'verification/center', component: CenterVerifyComponent },
    { path: 'verification/certificate/course', component: CourseCertificateVerifyComponent },
    { path: 'verification/certificate/other', component: OtherCertificateVerifyComponent },
    { path: 'verification/student', component: StudentVerifyComponent },
    { path: 'academic/download-certificate', component: DownloadCertificateComponent },
    { path: 'academic/download-form', component: DownloadFormComponent },
    { path: 'academic/pay-fees', component: PayFeesComponent },
    { path: 'academic/apply-franchise', component: ApplyFranchiesComponent },
    { path: 'course-offered/computer', component: ComputerCourseComponent },
    { path: 'course-offered/dance', component: DanceCourseComponent },
    { path: 'course-offered/drawing', component: DrawingCourseComponent },
    { path: 'course-offered/others', component: OtherCourseComponent },
    { path: 'course-offered/spoken-english', component: SpokenEnglishComponent },
    { path: 'student/e-book', component: EBookComponent },
    { path: 'student/marks-division', component: MarksDivisionComponent },
    { path: 'student/notes', component: NotesComponent },
    { path: 'student/notice/holiday', component: NoticeHolidayComponent },
    { path: 'student/notice/registration', component: NoticeRegistrationComponent },
    { path: 'student/software-download', component: SoftwareDownloadComponent },
    { path: 'gallary/:type', component: GallaryComponent },
    { path: 'about/institution', component: AboutInstitutionComponent },
    { path: 'about/registration', component: AboutRegistrationComponent },
    { path: 'contact-us/contact', component: ContactComponent },
    { path: 'contact-us/feedback', component: FeedbackComponent },
    { path: 'contact-us/rules', component: RulesComponent },
    { path: 'admin-panel/course-list', component: CourseListComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/add/primary-course', component: AddPrimaryCourseCategoryComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/add/sub-course', component: AddSubCourseCategoryComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/view-course/:courseCode', component: ViewCourseComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/update-dashboard-details/home-slideshow', component: HomeSlideshowComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/update-dashboard-details/master-details', component: MasterDetailsComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/edit-sub-course', component: EditSubCourseCategoryComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/create-user', component: CreateUserComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/enum', component: EnumsComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/manage-franchise', component: ManageCenterComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'admin-panel/data-backup', component: BackupComponent, canActivate: [AuthGuard], data: { role: UserRole.ADMIN } },
    { path: 'registration/register-student', component: StudentRegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'un-authorized', component: UnAuthorizeComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', component: ErrorComponent },
];
