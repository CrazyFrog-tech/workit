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

  timerStartAudio = new Audio('assets/sounds/race-start-beeps-125125.mp3');
  timerEndAudio = new Audio('assets/sounds/school-bell-310293.mp3');

  prepTime = 5;
  restMin = 0;
  restSec = 5;
  sets = 1;

  currentSet = 0;
  currentPhase = '';
  displayTime = '';

  private timerInterval: any;

  workTimeHrs: number = 0;
  workTimeMins: number = 0;
  workTimeSecs: number = 5;

  private totalWorkTime: number = 0;

  prepTimeHrs: number = 0;
  prepTimeMins: number = 0;
  prepTimeSecs: number = 5;

  restTimeHrs: number = 0;
  restTimeMins: number = 0;
  restTimeSecs: number = 5;

  isRunning: boolean = false;
  isPaused: boolean = false;

  private remainingTime: number = 0;
  private countdownCallback: (() => void) | null = null;

  showFireworks: boolean = false;

  stopAllSounds() {
    this.timerStartAudio.pause();
    this.timerStartAudio.currentTime = 0;
    this.timerEndAudio.pause();
    this.timerEndAudio.currentTime = 0;
  }
  puaseSound() {
    this.timerStartAudio.pause();
    this.timerEndAudio.pause();
  }
  resumeSound() {
    if (this.timerStartAudio.paused) {
      this.timerStartAudio.play().catch(error => {
        console.error('Error playing start sound:', error);
      }
      );
    } else if (this.timerEndAudio.paused) {
            this.timerEndAudio.play().catch(error => {
        console.error('Error playing end sound:', error);
      });

    }
  }

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
    this.stopAllSounds();
    this.totalWorkTime =
      (Number(this.workTimeHrs) || 0) * 3600 +
      (Number(this.workTimeMins) || 0) * 60 +
      (Number(this.workTimeSecs) || 0);

    this.prepTime =
      (Number(this.prepTimeHrs) || 0) * 3600 +
      (Number(this.prepTimeMins) || 0) * 60 +
      (Number(this.prepTimeSecs) || 0);

    const restTime =
      (Number(this.restTimeHrs) || 0) * 3600 +
      (Number(this.restTimeMins) || 0) * 60 +
      (Number(this.restTimeSecs) || 0);

    this.restMin = Math.floor(restTime / 60);
    this.restSec = restTime % 60;

    this.currentSet = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.runPreparation();
  }

  pauseTimer() {
    this.puaseSound();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.isPaused = true;
      this.isRunning = false;
      const [m, s] = this.displayTime.split(':').map(Number);
      this.remainingTime = m * 60 + s;
    }
  }

  resumeTimer() {
    this.resumeSound();
    if (this.isPaused && this.remainingTime > 0 && this.countdownCallback) {
      this.isPaused = false;
      this.isRunning = true;
      const callback = this.countdownCallback;
      const time = this.remainingTime;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.runCountdown(time, callback);
    }
  }

  playStartSound() {
    this.timerStartAudio.currentTime = 0;
    this.timerStartAudio.play().catch(error => {
      console.error('Error playing start sound:', error);
    });
  }

  playEndSound() {
    this.timerEndAudio.currentTime = 0;
    this.timerEndAudio.play().catch(error => {
      console.error('Error playing end sound:', error);
    });
  }

  stopTimer() {
    this.stopAllSounds();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.isRunning = false;
    this.isPaused = false;
    this.currentPhase = '';
    this.displayTime = '';
    this.currentSet = 0;
    this.remainingTime = 0;
    this.countdownCallback = null;
  }

  runPreparation() {
    this.currentPhase = 'Preparation';
    this.runCountdown(this.prepTime, () => this.runWorkout());
  }

  runWorkout() {
    if (this.currentSet >= this.sets) {
      this.currentPhase = 'Workout Complete!';
      this.displayTime = '';
      this.triggerFireworks();
      return;
    }

    this.currentSet++;
    this.currentPhase = `Work (Set ${this.currentSet})`;
    this.runCountdown(this.totalWorkTime, () => this.runRest());
  }

  triggerFireworks() {
    this.showFireworks = true;
    setTimeout(() => {
      this.showFireworks = false;
    }, 3000);
  }

  runRest() {
    const restTime = this.restMin * 60 + this.restSec;
    this.currentPhase = 'Rest';
    this.runCountdown(restTime, () => this.runWorkout());
  }

  runCountdown(seconds: number, callback: () => void) {
    let timeLeft = seconds;
    this.countdownCallback = callback;
    this.updateDisplay(timeLeft);

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      timeLeft--;
      this.updateDisplay(timeLeft);

      if (timeLeft == 4) {
        this.playStartSound();
      }

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.countdownCallback = null;
        this.remainingTime = 0;
        if (this.sets > 0 && this.currentSet >= this.sets && this.currentPhase === 'Rest') {
          this.playEndSound();
        }
        callback();
      } else {
        this.remainingTime = timeLeft;
      }
    }, 1000);
  }

  updateDisplay(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    this.displayTime = `${m}:${s}`;
  }

}