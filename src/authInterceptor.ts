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

  const isOnIpBlocker = currentUrl.includes('/ip-blocker');
  const isOnLogin = currentUrl.includes('/login');

  const clonedRequest = token
    ? req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {

      // 409 for rate limit exceeded or ip blocking
      if (error.status === 409) {
        const message = error?.error?.message || 'You have exceeded the request Limit.<br>Please try again after some time.';

        if (token !== null && token !== undefined) {
          authService.logoutWithoutRedirectToLogin();

          if (!isOnIpBlocker) {
            openDialog('IP Blocked', message, ResponseTypeColor.ERROR, 'ip-blocker');
          }
        } else if (!isOnIpBlocker) {
          openDialog('IP Blocked', message, ResponseTypeColor.ERROR, 'ip-blocker');
        }

        return EMPTY;
      }


      // Global status 400 and dto status 69 
      // For jwt expiration or no token found or cors block or api protection and other.
      else if (error.status === 400 && error.error.status === 69) {
        const message = error?.error?.message || 'Unauthorized source of request.<br>Or<br>you do not have permission to access this resource.';

        if (token !== null && token !== undefined) {
          authService.logoutWithoutRedirectToLogin();

          openDialog('Logout', message, ResponseTypeColor.ERROR, 'login');
        } else if (!isOnLogin) {
          openDialog('Logout', message, ResponseTypeColor.ERROR, 'login');
        }

        return EMPTY;
      }

      return throwError(() => error);
    })
  );

  function openDialog(dialogTitle: string, dialogText: string, dialogType: number, navigateRoute: string | null): void {
    const dialogRef = dialog.open(CustomAlertComponent, {
      data: { title: dialogTitle, text: dialogText, type: dialogType }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (navigateRoute) {
        window.location.href = navigateRoute;
      }
    });
  }
};
