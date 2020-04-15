import { Injectable } from '@angular/core';
import { Observable, from, EMPTY } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { delayWhen, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private loading: LoadingService, private toast: ToastService) { }

  wrapRequest<T>(
    request: Observable<T>,
    errorToast?: (_: any) => string,
    successToast?: (_: any) => string,
    loadingText: string = null,
  ): Observable<T> {
    this.loading.showLoading(loadingText);
    return request
      .pipe(
        delayWhen(_ => from(this.loading.hideLoading())),
        delayWhen(response => successToast ? from(this.toast.showToastSuccess(successToast(response))) : EMPTY),
        catchError(async err => {
            await this.loading.hideLoading();
            this.toast.showToastError(errorToast ? errorToast(err) : parseError(err));
            throw err;
        }),
      );
  }
}

function parseError(e: any): string {
  if (typeof e === 'string') {
    return e;
  }
  // response errors
  if (e.error && e.status) {
    const status =  e.status;
    const error = e.error;

    // laravel validation error response
    if (status === 422) {
      return error.errors ? Object.values(error.errors).join('<br>') : error.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  // stripe errors
  if (e.message) {
    return e.message;
  }

  // TODO: dont show this on prod!
  return JSON.stringify(e);
}
