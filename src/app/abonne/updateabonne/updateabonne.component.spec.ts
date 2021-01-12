import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateabonneComponent } from './updateabonne.component';

describe('UpdateabonneComponent', () => {
  let component: UpdateabonneComponent;
  let fixture: ComponentFixture<UpdateabonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateabonneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateabonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
