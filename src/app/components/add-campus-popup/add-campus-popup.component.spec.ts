import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCampusPopupComponent } from './add-campus-popup.component';

describe('AddCampusPopupComponent', () => {
  let component: AddCampusPopupComponent;
  let fixture: ComponentFixture<AddCampusPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCampusPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCampusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
