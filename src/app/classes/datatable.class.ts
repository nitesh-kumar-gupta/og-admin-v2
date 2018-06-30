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
        this.booleanValues = ['true','false'];
        this.multiSelectSettings = {
          singleSelection: false,
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          classes: 'form-control'
        };
    }
    arrayOf(num: number): number[] {
      let array: number[] = [];
      let upper_limit: number;
      let lower_limit: number;
      if (this.current_page < 5) {
        if (this.total_pages < 5)
          upper_limit = this.total_pages - 1;
        else
          upper_limit = 5;
  
        lower_limit = 2;
      }
      else if (this.current_page >= 5 && this.current_page <= this.total_pages - 5) {
        if (this.total_pages < this.current_page + 1)
          upper_limit = this.total_pages - 1;
        else
          upper_limit = this.current_page + 1;
        lower_limit = this.current_page - 1;
      }
      else {
        upper_limit = this.total_pages - 1;
        lower_limit = this.total_pages - 5;
      }
      for (let i = lower_limit; i <= upper_limit; i++)
        array.push(i);
      return array;
    }
  
    paging(num: number) {
      this.current_page = num;
    }
  
    limitChange(event: any) {
      this.current_page = 1;
      this.current_limit = Number(event.target.value);
    }
  
    prevPage() {
      if (this.current_page != 1) {
        this.current_page--;
      }
    }
  
    nextPage() {
      if (this.current_page != this.total_pages) {
        this.current_page++;
        console.log(this.current_page)
      }
    }
    searchData() {
      this.current_page = 1;
    }
  
    reset() {
      this.current_limit = 10;
      this.current_page = 1;
    }
}
