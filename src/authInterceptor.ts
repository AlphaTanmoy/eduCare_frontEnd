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

      if (token) {
        headers = headers.set('Authorization', 'Bearer ' + token);
      }

      if (ipAddress) {
        if (req.method === 'GET') {
          // Append IP to query params
          const url = new URL(req.url, window.location.origin);
          url.searchParams.set('ipAddress', ipAddress);
          const clonedRequest = req.clone({ url: url.toString(), headers });
          return next(clonedRequest);
        } else {
          // Add IP as custom header
          headers = headers.set('ipaddress', ipAddress);
          const clonedRequest = req.clone({ headers });
          return next(clonedRequest);
        }
      }

      const clonedRequest = req.clone({ headers });

      return next(clonedRequest).pipe(
        catchError((error) => {
          console.log(error)
          if (error.status === 409) {
            authService.logoutWithoutRedirectToLogin();
            openDialog('Logout', error.error.message, ResponseTypeColor.ERROR, 'login');
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
