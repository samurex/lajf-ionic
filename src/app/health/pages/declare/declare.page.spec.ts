import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeclarePage } from './declare.page';

describe('DeclarePage', () => {
  let component: DeclarePage;
  let fixture: ComponentFixture<DeclarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclarePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeclarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
