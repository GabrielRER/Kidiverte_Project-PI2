import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRate } from './star-rate';

describe('StarRate', () => {
  let component: StarRate;
  let fixture: ComponentFixture<StarRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRate],
    }).compileComponents();

    fixture = TestBed.createComponent(StarRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
