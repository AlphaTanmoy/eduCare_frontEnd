import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './app/service/auth/Auth.Service';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from './app/common-component/custom-alert/custom-alert.component';
import { ResponseTypeColor } from './app/constants/commonConstants';
import { catchError, EMPTY, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const dialog = inject(MatDialog);

  if (token) {
    const clonedRequest = token
      ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
      : req;

    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 409) {
          authService.logoutWithoutRedirectToLogin();
          openDialog('Logout', error.error.message, ResponseTypeColor.ERROR, "login");
          return EMPTY;
        }

        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }

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
