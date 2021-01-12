import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonneComponent } from './abonne.component';

describe('AbonneComponent', () => {
  let component: AbonneComponent;
  let fixture: ComponentFixture<AbonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
