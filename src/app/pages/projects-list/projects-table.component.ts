import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { CommonItem } from 'src/app/model/common-item';
import { Project } from 'src/app/model/project';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsTableComponent extends CommonTableComponent<Project> {
  constructor(
    navigator: NavigatorService<Project>,
    loginService: AuthService
  ) {
    super(navigator, loginService);

    this._detailsUrl = 'projects';
    this._columnsDefinitions = [
      {
        defName: 'id',
        displayName: 'ID',
        propertyName: 'stringId',
      },
      {
        defName: 'title',
        displayName: 'Tytuł',
        propertyName: 'title',
      },
      {
        defName: 'manager',
        displayName: 'Menedżer',
        // TODO: Change to manager, when supported by backend
        propertyName: 'idManager',
        formatter: (user: User) => `${user.firstName} ${user.lastName}`,
      },
      {
        defName: 'workers',
        displayName: 'Pracownicy',
        propertyName: 'workers',
        formatter: (workers: User[]) => {
          return `${workers.length}`;
        }
      },
    ];

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (item: CommonItem) => {
          this.navigateToStatsWithData(item);
        },
        canDisplay: () => {
          return this.canShowStats();
        },
        color: 'primary',
        tooltip: 'Pokaż statystyki'
      },
      // {
      //   icon: 'edit',
      //   action: (item: CommonItem) => {
      //     this.navigateToDetailsWithData(item, true);
      //   },
      //   tooltip: 'Edytuj element'
      // },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
        },
        canDisplay: () => {
          return this.canDelete();
        },
        color: 'warn',
        tooltip: 'Usuń element'
      }
    ]
  }
}