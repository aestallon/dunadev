import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  template: `
    <div class="upload-area"
         [class.has-preview]="previewUrl()"
         [class.dragging]="dragging()"
         (dragover)="onDragOver($event)"
         (dragleave)="dragging.set(false)"
         (drop)="onDrop($event)">

      @if (previewUrl()) {
        <div class="preview-container">
          <img [src]="previewUrl()!" alt="Cover image preview" class="preview-img">
          <button type="button" class="remove-btn" (click)="remove()" title="Remove image">✕</button>
        </div>
      } @else {
        <label class="upload-label" [for]="inputId">
          <span class="upload-icon">🖼️</span>
          <span class="upload-text">
            <strong>Click to upload</strong> or drag and drop
          </span>
          <span class="upload-hint">PNG, JPG, WEBP — recommended 1200×630</span>
          <input [id]="inputId" type="file" accept="image/*" class="file-input"
                 (change)="onFileChange($event)">
        </label>
      }

      @if (uploading()) {
        <div class="upload-progress">Uploading…</div>
      }
    </div>
  `,
  styles: `
    .upload-area {
      border: 2px dashed var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      transition: border-color 0.15s, background 0.15s;
      position: relative;
      overflow: hidden;
    }
    .upload-area.dragging {
      border-color: var(--primary);
      background: rgba(37, 99, 235, 0.04);
    }
    .upload-area.has-preview { border-style: solid; }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 2rem;
      cursor: pointer;
      text-align: center;
    }
    .upload-icon { font-size: 2rem; opacity: 0.6; }
    .upload-text { font-size: 0.875rem; color: var(--text-main); }
    .upload-hint { font-size: 0.75rem; color: var(--text-muted); }
    .file-input { display: none; }

    .preview-container {
      position: relative;
    }
    .preview-img {
      width: 100%;
      max-height: 220px;
      object-fit: cover;
      display: block;
    }
    .remove-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.75rem;
      transition: background 0.15s;
    }
    .remove-btn:hover { background: rgba(220, 38, 38, 0.85); }

    .upload-progress {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--primary);
    }
  `,
})
export class ImageUploadComponent {
  @Input() currentImageUrl: string | null = null;
  @Input() uploading = signal(false);
  @Input() inputId = 'image-upload';

  @Output() fileSelected = new EventEmitter<File>();
  @Output() removed = new EventEmitter<void>();

  readonly previewUrl = signal<string | null>(null);
  readonly dragging = signal(false);

  ngOnInit() {
    if (this.currentImageUrl) {
      this.previewUrl.set(this.currentImageUrl);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.selectFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) this.selectFile(file);
  }

  remove() {
    this.previewUrl.set(null);
    this.removed.emit();
  }

  private selectFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
    this.fileSelected.emit(file);
  }
}
