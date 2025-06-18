import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkCardItemComponent } from './bookmark-card-item.component';

describe('BookmarkCardItemComponent', () => {
  let component: BookmarkCardItemComponent;
  let fixture: ComponentFixture<BookmarkCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkCardItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookmarkCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
