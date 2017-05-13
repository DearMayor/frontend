import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Client } from 'elasticsearch';

import { Marker } from './interfaces/markers';

@Injectable()
export class ApiService {

    private client;

    constructor(private http: Http) {
        this.client = new Client({
            host: 'http://localhost:9200',
            log: 'trace'
        });
    }

    fetchData(): any {
        const query = {
            match_all: {}
        };

        return this.doQuery(query, undefined);
    }

    doQuery(query, post_filter) {
        return new Promise((resolve, reject) => {
            this.client.search({
                index: 'dearmayor',
                body: {
                    query: query,
                    aggregations: {
                        categories: {
                            terms: {
                                field: 'category'
                            }
                        },
                        status: {
                            terms: {
                                field: 'status'
                            }
                        }
                    },
                    post_filter: post_filter
                }
            }, function (error, response) {
                resolve({
                    hits: response.hits,
                    aggregations: response.aggregations
                });
            });
        });
    }
}
