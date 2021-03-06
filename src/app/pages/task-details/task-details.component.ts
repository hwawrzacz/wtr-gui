import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { WorkLogsListComponent } from 'src/app/components/work-logs-list/work-logs-list.component';
import { PriorityStringifier, StatusStringifier, stringifyUser } from 'src/app/helpers/parsers';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from 'src/app/model/constants';
import { Priority } from 'src/app/model/enums/priority';
import { Status } from 'src/app/model/enums/status';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { Task } from 'src/app/model/task';
import { TaskDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './task-details.component.scss']
})
export class TaskDetailsComponent extends CommonItemDetailsComponent<Task> implements OnInit {
  private _workersLoading: boolean;

  @ViewChild('workLogsList')
  private _workLogsList: WorkLogsListComponent;

  //#region Getters and setters
  get stringId(): string {
    return this._initialItem ? this._initialItem.stringId : '';
  }

  get projectStringId(): string {
    return this._initialItem ? this._initialItem.project.stringId : '';
  }

  get projectId(): string {
    return this._initialItem ? this._initialItem.project._id : '';
  }

  get parentProject(): Project {
    return this._initialItem ? this._initialItem.project : null;
  }

  get workersLoading(): boolean {
    return this._workersLoading;
  }

  get workers(): SimpleUser[] {
    return Object.assign([], this._form.get('workers').value);
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }

  // Form constraints
  get minDate(): Date {
    return new Date();
  }

  get maxDate(): Date {
    return
  }

  get titleMaxLength(): number {
    return TITLE_MAX_LENGTH;
  }

  get descriptionMaxLength(): number {
    return DESCRIPTION_MAX_LENGTH;
  }
  //#endregion

  get canLog(): boolean {
    return (
      // Current user is assigned to task
      this._initialItem.workers.filter(worker => worker._id === this._authService.userId).length > 0
      || (
        // Current user is a manager of root project
        this._authService.isManager
        && (
          !!this.parentProject
          && !!this.parentProject.idManager
          && this.parentProject.idManager === this._authService.userId
        )
      )
    );
  }
  //#endregion

  constructor(
    navigator: NavigatorService<Task>,
    broker: TaskDetailsBrokerService,
    restService: SingleTaskRestService,
    formBuilder: FormBuilder,
    changeDetector: ChangeDetectorRef,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
    authService: AuthService,
    mobileDetector: MobileDetectorService,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector, snackBarService, dialogService, authService, mobileDetector)

    const projectFilter = { name: 'stringId', values: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(TITLE_MAX_LENGTH)]],
      priority: [{ value: '', disabled: true }, [Validators.required]],
      dutyDate: [{ value: '', disabled: true }, [Validators.required]],
      status: [{ value: '', disabled: true }, [Validators.required]],
      description: [{ value: '', disabled: true }],
      workers: [{ value: [], disabled: true }],
    });
  }
  //#endregion

  //#region Data updates
  protected updateForm(task: Task): void {
    this._form.patchValue({
      title: task.title,
      priority: task.priority,
      status: task.status,
      dutyDate: task.dutyDate,
      description: task.description,
      workers: Object.assign([], task.workers),
    })
  }

  protected parseItemFromForm(): Task {
    return {
      title: this._form.get('title').value,
      priority: this._form.get('priority').value,
      status: this._form.get('status').value,
      dutyDate: this.parseDateToISOFormat(this._form.get('dutyDate').value),
      description: this._form.get('description').value,
      workers: this._form.get('workers').value,
      workersIds: this._form.get('workers').value.map(worker => worker._id),
    } as Task;
  }

  public updateWorkers(workers: SimpleUser[]): void {
    const newWorkers = Object.assign([], workers);
    this._form.get('workers').patchValue(newWorkers);
  }

  public reloadWorkLogs() {
    this._workLogsList.loadData();
  }

  public updateStatus(status: Status): void {
    if (!!status) this._initialItem.status = status;
  }
  //#endregion

  public canEdit(): boolean {
    return (
      // // !this.isMobile
      // && (
      this._authService.isAdmin
      || (
        // Current user is a manager of root project
        this._authService.isManager
        && this.parentProject
        && this.parentProject.idManager
        && this.parentProject.idManager === this._authService.userId
      )
      // )
      && this._initialItem && this._initialItem.status !== Status.DONE
    );
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Pole jest wymagane.';
    if (control.hasError('maxlength')) return 'Wartość jest za długa.';
    if (control.hasError('min')) return 'Wartość jest za mała.';
    if (control.hasError('max')) return 'Wartość jest za duża.';
    if (!control.valid) return 'Pole jest nieprawidłowe 🤐';

    return null;
  }

  //#region Parsers
  public stringifyUser(user: SimpleUser): string {
    return stringifyUser(user);
  }

  private parseDateToISOFormat(dateStr: string): string {
    return new Date(dateStr).toISOString();
  }

  getStatusString(status: Status): string {
    return StatusStringifier.getStatusString(status);
  }

  public getPriorityString(value: Priority): string {
    return PriorityStringifier.getPriorityString(value);
  }
  //#endregion
}
