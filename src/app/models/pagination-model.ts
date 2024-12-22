export class PaginationModel{
    total:number;
    list:Array<any>;
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage:boolean;
    isLastPage:boolean;
    hasPreviousPage:boolean;
    hasNextPage:boolean;
    navigatePages: number;
    navigatepageNums:Array<number>;
    navigateFirstPage: number;
    navigateLastPage: number;
    lastPage: number;
    firstPage: number;
    constructor(){
        this.total= 0;
        this.list= new Array<any>();
        this.pageNum= 0;
        this.pageSize= 0;
        this.size= 0;
        this.startRow= 0;
        this.endRow= 0;
        this.pages= 0;
        this.prePage= 0;
        this.nextPage= 0;
        this.isFirstPage= false;
        this.isLastPage= false;
        this.hasPreviousPage= false;
        this.hasNextPage= false;
        this.navigatePages= 0;
        this.navigatepageNums= new Array<number>();
        this.navigateFirstPage= 0;
        this.navigateLastPage= 0;
        this.lastPage= 0;
        this.firstPage= 0;
    }
}