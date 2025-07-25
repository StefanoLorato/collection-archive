import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionListComponent } from './collection-list.component';

describe('CollectionList', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
