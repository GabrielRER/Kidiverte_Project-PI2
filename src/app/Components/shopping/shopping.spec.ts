import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shopping } from './shopping';

describe('Shopping', () => {
  let component: Shopping;
  let fixture: ComponentFixture<Shopping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shopping],
    }).compileComponents();

    fixture = TestBed.createComponent(Shopping);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
