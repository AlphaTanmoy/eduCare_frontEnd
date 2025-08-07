import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './app/service/auth/Auth.Service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from './app/common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from './app/constants/commonConstants';
import { catchError, EMPTY, from, switchMap, throwError } from 'rxjs';
import { GetIpAddress } from './app/utility/common-util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const dialog = inject(MatDialog);
  const currentUrl = window.location.pathname;

  const clonedRequest = token
    ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 409) {
        if (token !== null && token !== undefined && token !== '') {
          authService.logoutWithoutRedirectToLogin();
          openDialog('Logout', error?.error?.message || 'Authentication Error Or Request Limit Exceeded.<br>Please try again after some times.', ResponseTypeColor.ERROR, 'ip-blocker');
        } else if (!currentUrl.includes('/ip-blocker')) {
          window.location.href = 'ip-blocker';
        }

        return EMPTY;
      }

      return EMPTY;
    })
  );

  function openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        if (navigateRoute === "login") {
          window.location.href = navigateRoute;
        }
      }
    });
  }
};
