import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AbonneService {
  constructor(protected http: HttpClient) {}
  configuration = {
    headers: {
      'x-auth-token': localStorage.getItem('x-auth-token'),
    },
  };

  createAbonne(abonne) {
    return this.http.post(
      environment.URL + 'api/abonne/',
      abonne,
      this.configuration
    );
  }

  editAbonne(id, abonne) {
    return this.http.put(
      environment.URL + 'api/abonne/' + id,
      abonne,
      this.configuration
    );
  }

  fetchAbonnes() {
    return this.http.get(environment.URL + 'api/abonne', this.configuration);
  }

  getAbonne(id) {
    return this.http.get(
      environment.URL + 'api/abonne/' + id,
      this.configuration
    );
  }

  deleteAbonne(id) {
    return this.http.delete(
      environment.URL + 'api/abonne/' + id,
      this.configuration
    );
  }

  addAbonnement(id, abonnement) {
    return this.http.put(
      environment.URL + 'api/abonne/' + id + '/abonnement',
      abonnement,
      this.configuration
    );
  }

  deleteAbonnement(id, idabonnement) {
    return this.http.delete(
      environment.URL + 'api/abonne/' + id + '/abonnement/' + idabonnement,
      this.configuration
    );
  }

  addPresence(id, idabonnement) {
    let nothing;
    return this.http.put(
      environment.URL + 'api/abonne/' + id + '/presence/' + idabonnement,
      nothing,
      this.configuration
    );
  }

  deletePresence(id, idabonnement, idPresence) {
    return this.http.delete(
      environment.URL +
        'api/abonne/' +
        id +
        '/presence/' +
        idabonnement +
        '/' +
        idPresence,
      this.configuration
    );
  }

  addPay(id, idabonnement, pay) {
    return this.http.put(
      environment.URL + 'api/abonne/' + id + '/abonnement/' + idabonnement,
      pay,
      this.configuration
    );
  }
}
