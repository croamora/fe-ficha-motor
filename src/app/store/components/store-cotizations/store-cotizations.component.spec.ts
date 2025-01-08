import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCotizationsComponent } from './store-cotizations.component';

describe('StoreCotizationsComponent', () => {
  let component: StoreCotizationsComponent;
  let fixture: ComponentFixture<StoreCotizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCotizationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCotizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
