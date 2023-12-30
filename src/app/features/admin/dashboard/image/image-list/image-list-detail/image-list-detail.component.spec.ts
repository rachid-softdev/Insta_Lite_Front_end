import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageListDetailComponent } from './image-list-detail.component';

describe('ImageListDetailComponent', () => {
  let component: ImageListDetailComponent;
  let fixture: ComponentFixture<ImageListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageListDetailComponent],
    });
    fixture = TestBed.createComponent(ImageListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
