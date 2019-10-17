import { Component } from "@angular/core";
import {
  process,
  State,
  GroupDescriptor,
  DataResult,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { avuMai } from "./avu";

import {
  GridComponent,
  GridDataResult,
  DataStateChangeEvent
} from "@progress/kendo-angular-grid";

@Component({
  selector: "my-app",
  template: `
    <kendo-grid
      [data]="gridData"
      [pageSize]="state.take"
      [skip]="state.skip"
      [sort]="state.sort"
      [filter]="state.filter"
      [sortable]="true"
      [pageable]="true"
      [groupable]="true"
      [filterable]="true"
      [group]="groups"
      (filterChange)="filterChange($event)"
      (groupChange)="groupChange($event)"
      (dataStateChange)="dataStateChange($event)"
    >
      <kendo-grid-column
        field="codePS"
        title="CodePS"
        width="40"
        [filterable]="true"
      >
      </kendo-grid-column>

      <kendo-grid-column
        field="codeFP"
        title="CodeFP"
        width="40"
        [filterable]="true"
      >
      </kendo-grid-column>

      <kendo-grid-column
        field="montantAllocation"
        title="Allocation"
        width="40"
        [filterable]="false"
      >
      </kendo-grid-column>
    </kendo-grid>
  `
})
export class AppComponent {
  public groups: GroupDescriptor[] = [{ field: "codePS" }];

  public gridData: DataResult;

  public filteredData: any;

  public state: State = {
    skip: 0,
    take: 500

    // Initial filter descriptor
    // filter: {
    //   logic: 'and'
    //filters: [{ field: 'CodePS', operator: 'contains', value: 'Chef' }]
    //}
  };

  public ngOnInit(): void {
    this.filteredData = avuMai.detailCalculPSParFP;
    this.loadAvu();
  }

  //public gridData: GridDataResult = process(avuMai.detailCalculPSParFP, this.state);

  public filterChange(ev: CompositeFilterDescriptor) {
    console.log(JSON.stringify(ev));

    this.filteredData = avuMai.detailCalculPSParFP;

    for (let oneFilter of ev.filters) {
      console.log(oneFilter.field); // 1, "string", false

      if(oneFilter.field === "codeFP"){
          this.filteredData = this.filteredData.filter(c=> oneFilter.value.indexOf(c.codeFP)!= -1);
      }
    }

    this.loadAvu();
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(avuMai.detailCalculPSParFP, this.state);
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.loadAvu();
  }

  private loadAvu(): void {
    this.gridData = process(this.filteredData, { group: this.groups });
  }
}
