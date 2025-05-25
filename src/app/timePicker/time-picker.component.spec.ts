import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimePickerComponent } from './time-picker.component';
import { IonInput, IonLabel } from '@ionic/angular/standalone';
import { By } from '@angular/platform-browser';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimePickerComponent, IonInput, IonLabel]
    }).compileComponents();

    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit timeChange when hours input changes', () => {
    spyOn(component.timeChange, 'emit');
    component.onInputChange('hours', '2');
    expect(component.hours).toBe(2);
    expect(component.timeChange.emit).toHaveBeenCalledWith({ hours: 2, minutes: 0, seconds: 0 });
  });

  it('should emit timeChange when minutes input changes', () => {
    spyOn(component.timeChange, 'emit');
    component.onInputChange('minutes', '15');
    expect(component.minutes).toBe(15);
    expect(component.timeChange.emit).toHaveBeenCalledWith({ hours: 0, minutes: 15, seconds: 0 });
  });

  it('should emit timeChange when seconds input changes', () => {
    spyOn(component.timeChange, 'emit');
    component.onInputChange('seconds', '45');
    expect(component.seconds).toBe(45);
    expect(component.timeChange.emit).toHaveBeenCalledWith({ hours: 0, minutes: 0, seconds: 45 });
  });

  it('should handle invalid input as zero', () => {
    component.onInputChange('hours', undefined);
    expect(component.hours).toBe(0);
    component.onInputChange('minutes', '');
    expect(component.minutes).toBe(0);
    component.onInputChange('seconds', null);
    expect(component.seconds).toBe(0);
  });
});
