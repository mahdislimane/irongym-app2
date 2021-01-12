import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddabonnementComponent } from './addabonnement.component';

describe('AddabonnementComponent', () => {
  let component: AddabonnementComponent;
  let fixture: ComponentFixture<AddabonnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddabonnementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddabonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
