import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserResponse } from '../../shared/interfaces/user-reponse.interface';
import { User } from '../../shared/interfaces/user.interface';
import { NgIf } from '@angular/common';
import { IsValueExistsPipe } from '../../shared/pipes/is-value-exists.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    IsValueExistsPipe,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit, AfterViewInit {
  userForm: FormGroup;
  currentFormState: Partial<User>;
  updatedFormState: Partial<User> = {};

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly apiService: ApiService = inject(ApiService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.buildForm();
    this.loadUserData();
    this.trackFormValueChanges();
    this.saveCurrentFormState();
  }

  ngAfterViewInit(): void {
    this.cdr.detach();
  }

  private buildForm(): void {
    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      isLegal: [null, [Validators.required]],
    });
  }

  private loadUserData(): void {
    this.apiService.getUserData().pipe(
      map((userResponse: UserResponse) => userResponse.userInfo),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((userData: User) => this.userForm.patchValue(userData, { emitEvent: false }));
  }

  private trackFormValueChanges(): void {
    this.userForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((formValue) => this.apiService.saveUserData(formValue)),
      map((userResponse: UserResponse) => userResponse.userInfo),
      tap((userData: User) => {
        console.log(userData)
        const updatedState: Partial<User> = Object.keys(this.userForm.controls).reduce((acc: Partial<User>, control: string) => {
          if (this.currentFormState[control as keyof User] !== userData[control as keyof User]) {
            return { ...acc, [control]: userData[control as keyof User] };
          }

          return acc;
        }, {});
        this.updateFormState(updatedState);

        this.userForm.patchValue(userData, { emitEvent: false });
        this.saveCurrentFormState();
      }),
      delay(3000),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateFormState({});
    });
  }

  private updateFormState(formValue: Partial<User>): void {
    this.updatedFormState = formValue;
    this.cdr.detectChanges();
  }

  private saveCurrentFormState(): void {
    this.currentFormState = this.userForm.value;
  }
}
