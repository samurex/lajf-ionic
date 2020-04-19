import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { Mood } from '@lajf-app/mood/models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'moods-picker',
  templateUrl: './moods-picker.component.html',
  styleUrls: ['./moods-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoodsPickerComponent),
      multi: true
    }
  ]
})
export class MoodsPickerComponent implements ControlValueAccessor {
  disabled = false;
  moodId: number = null;
  @Input() moods: Mood[];

  constructor() { }

  select(moodId: number) {
    if (!this.disabled) {
      this.writeValue(moodId);
    }
  }

  // Function to call when the rating changes.
  onChange = (moodId: number) => {};

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {};

  // Allows Angular to update the model (rating).
  // Update the model and changes needed for the view here.
  writeValue(moodId: number): void {
    this.moodId = moodId;
    this.onChange(this.moodId);
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (moodId: number) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
