import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreWorkOrdersComponent } from './store-work-orders.component';

describe('StoreWorkOrdersComponent', () => {
  let component: StoreWorkOrdersComponent;
  let fixture: ComponentFixture<StoreWorkOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreWorkOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreWorkOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
