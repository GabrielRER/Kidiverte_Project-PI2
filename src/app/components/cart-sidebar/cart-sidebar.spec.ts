import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSidebar } from './cart-sidebar';

describe('CartSidebar', () => {
  let component: CartSidebar;
  let fixture: ComponentFixture<CartSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
