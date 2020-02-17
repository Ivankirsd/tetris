import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {FigureComponent} from './figure.component';
import {FigureService} from '../../../services/figure.service';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('FigureComponent', () => {
  let component: FigureComponent;
  let fixture: ComponentFixture<FigureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FigureComponent],
      providers: [
        FigureService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setting figure should set figureModel', () => {
    const figureService = TestBed.get(FigureService);
    component.figure = figureService.generateRandomFigure();

    expect(component.figureModel).toBeTruthy();
  });

  it('setting figureModel should render figure template ', () => {
    let rowsCount: number;
    let cellCount: number;

    const figureModels = [
      [
        [1, 1],
        [1, 1],
      ], [
        [1, 1, 1, 1],
      ]
    ];

    figureModels.forEach(figureModel => {
      component.figureModel = figureModel;
      fixture.detectChanges();

      rowsCount = fixture.debugElement.queryAll(By.css('.row')).length;
      cellCount = fixture.debugElement.queryAll(By.css('.cell')).length / rowsCount;

      expect(rowsCount).toBe(figureModel.length);
      expect(cellCount).toBe(figureModel[0].length);
    });
  });

  it('active cells should coincide with figure', fakeAsync(() => {
      let figureRows: DebugElement[];
      let figureRowCells: DebugElement[];

      const figureModels = [
        [
          [1, 1],
          [1, 1],
        ], [
          [1, 1, 1, 1],
        ], [
          [null, 1, 1],
          [1, 1, null],
        ], [
          [null, 1, null],
          [1, 1, 1],
        ]
      ];

      figureModels.forEach(figureModel => {
        component.figureModel = figureModel;
        fixture.detectChanges();

        figureRows = fixture.debugElement.queryAll(By.css('.row'));
        figureModel.forEach((row, i) => {
          figureRowCells = figureRows[i].queryAll(By.css('.cell'));
          row.forEach((cell, j) => {

            expect(figureRowCells[j].nativeElement.classList.contains('active-cell')).toBe(!!cell);
          });
        });
      });
    }
  ));
});
