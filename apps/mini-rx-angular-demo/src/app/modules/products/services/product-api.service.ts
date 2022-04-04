import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from '../models/product';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class ProductApiService {
    private productsUrl = 'api/products';

    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService,
        private toastr: ToastrService
    ) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productsUrl).pipe(
            tap((data) => {
                console.log(JSON.stringify(data));
            }),
            catchError((err) => this.errorHandler.handleError(err))
        );
    }

    createProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // Product Id must be null for the Web API to assign an Id
        const newProduct = { ...product, id: null };
        return this.http.post<Product>(this.productsUrl, newProduct, { headers }).pipe(
            tap((data) => {
                console.log('createProduct: ' + JSON.stringify(data));
                this.toastr.success('Product created');
            }),
            catchError((err) => this.errorHandler.handleError(err))
        );
    }

    deleteProduct(id: number): Observable<{}> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.productsUrl}/${id}`;
        return this.http.delete<Product>(url, { headers }).pipe(
            tap((data) => {
                console.log('deleteProduct: ' + id);
                this.toastr.success('Product deleted');
            }),
            catchError((err) => this.errorHandler.handleError(err))
        );
    }

    updateProduct(product: Product): Observable<Product> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${this.productsUrl}/${product.id}`;
        return this.http.put<Product>(url, product, { headers }).pipe(
            tap(() => {
                console.log('updateProduct: ' + product.id);
                this.toastr.success('Product updated');
            }),
            // Return the product on an update
            map(() => product),
            catchError((err) => this.errorHandler.handleError(err))
        );
    }
}
