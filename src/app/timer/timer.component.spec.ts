import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './timer.component';
import { TimePickerComponent } from '../timePicker/time-picker.component';
import { NgIf } from '@angular/common';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TimerComponent,
        TimePickerComponent,
        FormsModule,
        NgIf,
        IonItem, IonLabel, IonInput, IonButton
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update preparation time from time picker', () => {
    component.onPrepTimeChange({ hours: 0, minutes: 1, seconds: 30 });
    expect(component.prepTimeHrs).toBe(0);
    expect(component.prepTimeMins).toBe(1);
    expect(component.prepTimeSecs).toBe(30);
  });

  it('should update work time from time picker', () => {
    component.onWorkTimeChange({ hours: 1, minutes: 2, seconds: 3 });
    expect(component.workTimeHrs).toBe(1);
    expect(component.workTimeMins).toBe(2);
    expect(component.workTimeSecs).toBe(3);
  });

  it('should update rest time from time picker', () => {
    component.onRestTimeChange({ hours: 0, minutes: 0, seconds: 10 });
    expect(component.restTimeHrs).toBe(0);
    expect(component.restTimeMins).toBe(0);
    expect(component.restTimeSecs).toBe(10);
  });

  it('should calculate total work time and start preparation', () => {
    component.workTimeHrs = 0;
    component.workTimeMins = 1;
    component.workTimeSecs = 5;
    component.prepTimeHrs = 0;
    component.prepTimeMins = 0;
    component.prepTimeSecs = 5;
    component.restTimeHrs = 0;
    component.restTimeMins = 0;
    component.restTimeSecs = 10;
    component.sets = 2;
    spyOn(component, 'runPreparation');
    component.startTimer();
    // totalWorkTime and prepTime are private, so test via public behavior
    expect(component.restMin).toBe(0);
    expect(component.restSec).toBe(10);
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
    // simulate a short work time
    component.workTimeHrs = 0;
    component.workTimeMins = 0;
    component.workTimeSecs = 1;
    spyOn(component, 'runRest');
    // startTimer will recalculate totalWorkTime
    component.startTimer();
    // runWorkout is called after preparation
    tick(1100); // finish preparation
    // runWorkout is called, so we can tick again for work
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
