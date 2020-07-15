import { TestBed } from '@angular/core/testing';

import { KeycloakSecurityService } from './keycloak-security.service';

describe('KeycloakSecurityService', () => {
  let service: KeycloakSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
