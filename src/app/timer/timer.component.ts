import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, FormsModule, NgIf],

  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {

 prepTime = 10;
  workTime = 30;
  restMin = 0;
  restSec = 30;
  sets = 5;

  currentSet = 0;
  currentPhase = '';
  displayTime = '';

  private timerInterval: any;

  startTimer() {
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
    this.runCountdown(this.workTime, () => this.runRest());
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
