import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer and run preparation', () => {
    spyOn(component, 'runPreparation');
    component.startTimer();
    expect(component.currentSet).toBe(0);
    expect(component.runPreparation).toHaveBeenCalled();
  });

  it('should run preparation and then workout', fakeAsync(() => {
    component.prepTime = 1;
    spyOn(component, 'runWorkout');
    component.runPreparation();
    expect(component.currentPhase).toBe('Preparation');
    tick(1100);
    expect(component.runWorkout).toHaveBeenCalled();
  }));

  it('should complete workout after all sets', () => {
    component.sets = 1;
    component.currentSet = 1;
    component.runWorkout();
    expect(component.currentPhase).toBe('Workout Complete!');
    expect(component.displayTime).toBe('');
  });

  it('should increment set and run work countdown', fakeAsync(() => {
    component.sets = 2;
    component.currentSet = 0;
    component.workTime = 1;
    spyOn(component, 'runRest');
    component.runWorkout();
    expect(component.currentPhase).toContain('Work');
    tick(1100);
    expect(component.runRest).toHaveBeenCalled();
  }));

  it('should run rest and then workout', fakeAsync(() => {
    component.restMin = 0;
    component.restSec = 1;
    spyOn(component, 'runWorkout');
    component.runRest();
    expect(component.currentPhase).toBe('Rest');
    tick(1100);
    expect(component.runWorkout).toHaveBeenCalled();
  }));

  it('should update display time correctly', () => {
    component.updateDisplay(65);
    expect(component.displayTime).toBe('01:05');
    component.updateDisplay(5);
    expect(component.displayTime).toBe('00:05');
  });

  it('should clear interval and call callback at end of countdown', fakeAsync(() => {
    const callback = jasmine.createSpy('callback');
    component.runCountdown(1, callback);
    tick(1100);
    expect(callback).toHaveBeenCalled();
  }));
});
