import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourbeComponent } from './courbe.component';

describe('CourbeComponent', () => {
  let component: CourbeComponent;
  let fixture: ComponentFixture<CourbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourbeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
