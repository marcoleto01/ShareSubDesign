import { TestBed } from '@angular/core/testing';

import { SubpurchaseService } from './subpurchase.service';

describe('SubpurchaseService', () => {
  let service: SubpurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubpurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
