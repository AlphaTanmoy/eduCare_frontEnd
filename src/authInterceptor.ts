import { HttpInterceptorFn } from '@angular/common/http';
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

  return from(GetIpAddress()).pipe(
    switchMap((ipAddress: string) => {
      let headers = req.headers;
      let clonedRequest: any;

      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }

      if (ipAddress) {
        if (req.method !== 'GET') {
          headers = headers.set('ipaddress', ipAddress);
        } else {
          // Add IP as query param
          // Which I don't think a good idea
          // Have to re-think
        }
      }

      clonedRequest = req.clone({ headers });

      return next(clonedRequest).pipe(
        catchError((error) => {
          console.error("Caught in interceptor:", error);

          if (error.status === 409) {
            authService.logoutWithoutRedirectToLogin();
            openDialog('Logout', error?.error?.message || 'Authentication Error Or Request Limit Exceeded', ResponseTypeColor.ERROR, 'login');
            return EMPTY;
          }

          return throwError(() => error);
        })
      );
    }),
    catchError(() => {
      // If GetIpAddress fails, continue with the original request
      return next(req);
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
