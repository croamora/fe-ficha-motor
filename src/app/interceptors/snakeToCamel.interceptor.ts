import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SnakeToCamelInterceptor implements HttpInterceptor {
  snakeToCamel(key: string): string {
    return key.replace(/(_\w)/g, (k) => k[1].toUpperCase());
  }

  transformToCamel(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformToCamel(item));
    }

    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = this.snakeToCamel(key);
      acc[camelKey] = this.transformToCamel(obj[key]);
      return acc;
    }, {} as any);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          return event.clone({ body: this.transformToCamel(event.body) });
        }
        return event;
      })
    );
  }
}