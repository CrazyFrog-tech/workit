import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonInput, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  imports: [IonGrid, IonRow, IonCol, IonInput, IonLabel]
})
export class TimePickerComponent {
  @Input() hours: number = 0;
  @Input() minutes: number = 0;
  @Input() seconds: number = 0;
  @Output() timeChange = new EventEmitter<{ hours: number, minutes: number, seconds: number }>();

  onInputChange(type: 'hours' | 'minutes' | 'seconds', value: any | undefined) {
    const num = Number(value) || 0;
    if (type === 'hours') this.hours = num;
    if (type === 'minutes') this.minutes = num;
    if (type === 'seconds') this.seconds = num;
    this.timeChange.emit({ hours: this.hours, minutes: this.minutes, seconds: this.seconds });
  }
}
