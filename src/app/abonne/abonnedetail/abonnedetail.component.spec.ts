import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnedetailComponent } from './abonnedetail.component';

describe('AbonnedetailComponent', () => {
  let component: AbonnedetailComponent;
  let fixture: ComponentFixture<AbonnedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonnedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonnedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
