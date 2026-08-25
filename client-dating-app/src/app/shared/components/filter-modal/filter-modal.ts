import {  Component, ElementRef, inject, output, signal, ViewChild } from '@angular/core';
import { IQuery } from '../../../core/interfaces/pagination';
import { FormsModule } from '@angular/forms';
import { LocalStorage } from '../../../core/services/local-storage';

@Component({
  selector: 'dating-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') filterModal!: ElementRef<HTMLDialogElement>;
  private readonly storageService = inject(LocalStorage);

  closeModal = output();
  submitData = output<IQuery>();
  filterQuery = signal<IQuery>({
    pageNumber: 1,
    pageSize: 50,
    minAge: 18,
    maxAge: 100,
    gender: '',
    orderBy: 'lastActive',
  });

  constructor() {
    const filters = this.storageService.getItem<IQuery>('filters');
    if (filters) {
      const pagination = {
        ...filters,
      };
    this.filterQuery.set({...pagination})
    }
  }
  openModal() {
    this.filterModal.nativeElement.showModal();
  }

  close() {
    this.filterModal.nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit({ ...this.filterQuery() });
    this.close();
  }

  onMinAgeChange() {
    if (Number(this.filterQuery().minAge) < 18) {
      this.filterQuery().minAge = 18;
    }
  }

  onMaxAgeChange() {
    if (Number(this.filterQuery().maxAge) > 100) {
      this.filterQuery().maxAge = this.filterQuery().minAge;
    }
  }
}
