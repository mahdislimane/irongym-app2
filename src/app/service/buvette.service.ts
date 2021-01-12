import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class BuvetteService {
  constructor(protected http: HttpClient) {}
  configuration = {
    headers: {
      'x-auth-token': localStorage.getItem('x-auth-token'),
    },
  };

  getBuvette() {
    return this.http.get(environment.URL + 'api/buvette/', this.configuration);
  }

  addBuvette(buvette) {
    return this.http.post(
      environment.URL + 'api/buvette/',
      buvette,
      this.configuration
    );
  }

  deleteBuvette(id) {
    return this.http.delete(
      environment.URL + 'api/buvette/' + id,
      this.configuration
    );
  }
}
