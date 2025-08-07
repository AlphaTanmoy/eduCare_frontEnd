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

      // 409 for rate limit exceeded or ip blocking
      if (error.status === 409) {
        if (token !== null && token !== undefined) {
          authService.logoutWithoutRedirectToLogin();

          const message = error?.error?.message || 'You have exceeded the request Limit.<br>Please try again after some times.'
          openDialog('Logout', message, ResponseTypeColor.ERROR, 'ip-blocker');
        } else if (!currentUrl.includes('/ip-blocker')) {
          window.location.href = 'ip-blocker';
        }

        return EMPTY;
      }

      
      // 69/(any other status code)) for jwt expiration or no token found or cors block or api protection and other.
      if (error.status === 69) {
        if (token !== null && token !== undefined) {
          authService.logoutWithoutRedirectToLogin();

          const message = error?.error?.message || 'Unauthorized source of request.<br>Or<br>you do not have permission to access this resource.';
          openDialog('Logout', message, ResponseTypeColor.ERROR, 'login');
        } else if (!currentUrl.includes('/login')) {
          window.location.href = 'login';
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
