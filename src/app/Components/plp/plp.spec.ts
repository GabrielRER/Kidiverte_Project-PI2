import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PLP } from './plp';

describe('PLP', () => {
  let component: PLP;
  let fixture: ComponentFixture<PLP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PLP],
    }).compileComponents();

    fixture = TestBed.createComponent(PLP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
