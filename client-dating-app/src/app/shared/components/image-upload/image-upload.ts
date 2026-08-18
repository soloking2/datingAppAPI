import { Component, HostListener, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'dating-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
})
export class ImageUpload {
  fileType = input.required<string>();
  protected imageSrc = signal<string | ArrayBuffer | null>(null);
  protected isDragging = signal(false);
  protected fileToUpload = signal<File | null>(null);
  public loading = model(false);
  public uploadFile = output<File>();


  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener("drop", ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if(event.dataTransfer?.files.length) {
      const file = event?.dataTransfer?.files[0];
      this.showImagePreview(file);
      this.fileToUpload.set(file);
    }
  }

  private showImagePreview(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => this.imageSrc.set(e?.target?.result as string);

    reader.readAsDataURL(file);
  }

  protected onCancel() {
    this.imageSrc.set(null);
    this.fileToUpload.set(null);

  }

  protected uploadImage() {
    this.uploadFile.emit(this.fileToUpload() as File);
  }
}
