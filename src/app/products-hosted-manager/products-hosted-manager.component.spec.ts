import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHostedManagerComponent } from './products-hosted-manager.component';

describe('ProductsHostedManagerComponent', () => {
  let component: ProductsHostedManagerComponent;
  let fixture: ComponentFixture<ProductsHostedManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHostedManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHostedManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
