export class Sale {
  id!: string;
  storeName!: string;
  category!: string;
  subCategory!: string;
  sku!: string;
  quantity!: number;
  salesAmount!: string;
  isDeleting: boolean = false;
}
