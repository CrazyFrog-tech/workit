import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { TimePickerComponent } from "../timePicker/time-picker.component";


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  imports: [IonItem, IonLabel, IonInput, IonButton, FormsModule, NgIf, TimePickerComponent],

  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {

  prepTime = 10;
  restMin = 0;
  restSec = 30;
  sets = 5;

  currentSet = 0;
  currentPhase = '';
  displayTime = '';

  private timerInterval: any;

  workTimeHrs: number = 0;
  workTimeMins: number = 0;
  workTimeSecs: number = 0;

  private totalWorkTime: number = 0;

  // Preparation time fields
  prepTimeHrs: number = 0;
  prepTimeMins: number = 0;
  prepTimeSecs: number = 0;

  // Rest time fields
  restTimeHrs: number = 0;
  restTimeMins: number = 0;
  restTimeSecs: number = 0;

  onPrepTimeChange(ev: { hours: number, minutes: number, seconds: number }) {
    this.prepTimeHrs = ev.hours;
    this.prepTimeMins = ev.minutes;
    this.prepTimeSecs = ev.seconds;
  }

  onWorkTimeChange(ev: { hours: number, minutes: number, seconds: number }) {
    this.workTimeHrs = ev.hours;
    this.workTimeMins = ev.minutes;
    this.workTimeSecs = ev.seconds;
  }

  onRestTimeChange(ev: { hours: number, minutes: number, seconds: number }) {
    this.restTimeHrs = ev.hours;
    this.restTimeMins = ev.minutes;
    this.restTimeSecs = ev.seconds;
  }

  startTimer() {
    // Calculate total work time in seconds from hrs, mins, secs
    this.totalWorkTime =
      (Number(this.workTimeHrs) || 0) * 3600 +
      (Number(this.workTimeMins) || 0) * 60 +
      (Number(this.workTimeSecs) || 0);

    // Calculate total prep time in seconds
    this.prepTime =
      (Number(this.prepTimeHrs) || 0) * 3600 +
      (Number(this.prepTimeMins) || 0) * 60 +
      (Number(this.prepTimeSecs) || 0);

    // Calculate total rest time in seconds
    const restTime =
      (Number(this.restTimeHrs) || 0) * 3600 +
      (Number(this.restTimeMins) || 0) * 60 +
      (Number(this.restTimeSecs) || 0);

    this.restMin = Math.floor(restTime / 60);
    this.restSec = restTime % 60;

    this.currentSet = 0;
    this.runPreparation();
  }

  runPreparation() {
    this.currentPhase = 'Preparation';
    this.runCountdown(this.prepTime, () => this.runWorkout());
  }

  runWorkout() {
    if (this.currentSet >= this.sets) {
      this.currentPhase = 'Workout Complete!';
      this.displayTime = '';
      return;
    }

    this.currentSet++;
    this.currentPhase = `Work (Set ${this.currentSet})`;
    this.runCountdown(this.totalWorkTime, () => this.runRest());
  }

  runRest() {
    const restTime = this.restMin * 60 + this.restSec;
    this.currentPhase = 'Rest';
    this.runCountdown(restTime, () => this.runWorkout());
  }

  runCountdown(seconds: number, callback: () => void) {
    let timeLeft = seconds;
    this.updateDisplay(timeLeft);

    this.timerInterval = setInterval(() => {
      timeLeft--;
      this.updateDisplay(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        callback();
      }
    }, 1000);
  }

  updateDisplay(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    this.displayTime = `${m}:${s}`;
  }

}
