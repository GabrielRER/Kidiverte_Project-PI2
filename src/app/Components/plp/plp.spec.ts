import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plp } from './plp';

describe('Plp', () => {
  let component: Plp;
  let fixture: ComponentFixture<Plp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plp],
    }).compileComponents();

    fixture = TestBed.createComponent(Plp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
