export class Datatable {
    limits: number[];
    current_limit: number;
    total_pages: number;
    search: string;
    current_page: number;
    stringOperators: Array<string>;
    numberOperators: Array<string>;
    fixedValueOperator: Array<string>;
    booleanValues: Array<Object>;
    multiSelectSettings = {};
    constructor() {
        this.limits = [15, 25, 50, 100];
        this.current_limit = 15;
        this.total_pages = 1;
        this.search = '';
        this.current_page = 1;
        this.stringOperators = [
          'equals', 'not equal to', 'starts with', 'ends with', 'contains', 'does not contain'
        ];
        this.numberOperators = [
          'equals', 'not equal to', 'less than', 'less than equal', 'greater than', 'greater than equal', 'between'
        ];
        this.fixedValueOperator = [
          'equals', 'not equal to', 'includes', 'does not include'
        ];
        this.booleanValues = [
          {
            id: true,
            itemName: 'TRUE'
          },
          {
            id: false,
            itemName: 'FALSE'
          }
        ];
        this.multiSelectSettings = {
          singleSelection: false,
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          classes: 'form-control'
        };
    }
    prevPage() {
        this.current_page -= 1;
    }
    nextPage() {
        this.current_page += 1;
    }

    searchData(){
      this.current_page = 1;
    }

}
