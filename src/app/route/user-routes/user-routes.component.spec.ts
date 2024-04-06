import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoutesComponent } from './user-routes.component';

describe('UserRoutesComponent', () => {
  let component: UserRoutesComponent;
  let fixture: ComponentFixture<UserRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoutesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
