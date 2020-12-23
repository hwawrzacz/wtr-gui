import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { stringifyUser } from 'src/app/helpers/parsers';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { Task } from 'src/app/model/task';
import { TaskDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleProjectRestService } from 'src/app/services/rest/single-project-rest.service';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './task-details.component.scss']
})
export class TaskDetailsComponent extends CommonItemDetailsComponent<Task> implements OnInit {
  private _workers: SimpleUser[];
  private _workersLoading: boolean;
  private _parentProject: Project;

  //#region Getters and setters
  get stringId(): string {
    return this._initialItem ? this._initialItem.stringId : '';
  }

  get parentProject(): Project {
    return this._parentProject;
  }

  get workersLoading(): boolean {
    return this._workersLoading;
  }

  get workers(): SimpleUser[] {
    return this._workers;
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
  //#endregion

  constructor(
    navigator: NavigatorService<Task>,
    broker: TaskDetailsBrokerService,
    restService: SingleTaskRestService,
    formBuilder: FormBuilder,
    changeDetector: ChangeDetectorRef,
    snackBarService: SnackBarService,
    private _projectRestService: SingleProjectRestService,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector, snackBarService);

    const projectFilter = { name: 'stringId', values: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [{ value: '', disabled: true }, [Validators.required]],
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
      workers: task.workers,
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
    } as Task;
  }

  public updateWorkers(workers: SimpleUser[]): void {
    this._form.get('workers').patchValue(workers);
  }
  //#endregion


  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Pole jest wymagane.';
    if (control.hasError('matDatepickerParse')) return 'Nieprawidłowy format daty.';
    else if (!control.valid) return 'Pole jest nieprawidłowe 🤐';

    return null;
  }

  //#region Parsers
  public stringifyUser(user: SimpleUser): string {
    return stringifyUser(user);
  }

  private parseDateToISOFormat(dateStr: string): string {
    return new Date(dateStr).toISOString();
  }
  //#endregion
}
