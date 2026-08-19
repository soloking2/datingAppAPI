import { Component, computed, input, model, output } from '@angular/core';
import { IQuery } from '../../core/interfaces/pagination';

@Component({
  selector: 'dating-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  PAGE_SIZE = input([5, 10, 20, 50]);
  pageNumber = model(1);
  pageSize = model(10);
  totalCount = input(0);
  pageCount = input(0);

  pageChange = output<IQuery>();
  lastItemIndex = computed(() => Math.min(this.pageNumber() * this.pageSize(), this.totalCount()));

  onPageChange(newPage?: number, pageSize?: EventTarget | null) {
    if (newPage) this.pageNumber.set(newPage);
    if (pageSize) {
      const size = (pageSize as HTMLSelectElement).value;
      this.pageSize.set(Number(size));
    }

    this.pageChange.emit({ pageNumber: this.pageNumber(), pageSize: this.pageSize() });
  }
}
