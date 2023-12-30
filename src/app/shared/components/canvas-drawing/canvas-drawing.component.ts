import {
  Component,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Afin de manipuler le DOM Angular fournit
 * car accèder au document (ex: document.getElementById) est unsafe.
 */

type TextItem = {
  content: string;
  color: string;
  x: number;
  y: number;
};

@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.css'],
})
export class CanvasDrawingComponent implements OnInit, OnDestroy, AfterViewInit {
  private _fileInputId = '';
  private _size = 25;
  private _color = '#000000';
  private _texts: TextItem[] = [];
  private _fileChange = new EventEmitter<File>();
  private _editedFile: File | null = null;

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _renderer: Renderer2,
    private readonly _toastrService: ToastrService,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvasDrawing();
  }

  public get getFileInputId(): string {
    return this._fileInputId;
  }

  @Input()
  public set setFileInputId(fileInputId: string) {
    this._fileInputId = fileInputId;
  }

  @Output()
  public get getFileChange(): EventEmitter<File> {
    return this._fileChange;
  }

  public get getSize(): number {
    return this._size;
  }

  public set setSize(size: number) {
    this._size = size;
  }

  public get getColor(): string {
    return this._color;
  }

  public set setColor(color: string) {
    this._color = color;
  }

  public get getEditedFile(): File | null {
    return this._editedFile;
  }

  public set setEditedFile(file: File | null) {
    this._editedFile = file;
  }

  public onColorChange(event: Event) {
    this.setColor = (event.target as HTMLInputElement).value;
  }

  public onSizeChange(event: Event) {
    this.setSize = parseInt((event.target as HTMLInputElement).value, 10);
  }

  private fileToDataUri(field: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      });
      reader.readAsDataURL(field);
    });
  }

  private canvasToBlob(canvasElement: HTMLCanvasElement): Blob {
    function dataURItoBlob(dataURI: string) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
      else byteString = unescape(dataURI.split(',')[1]);
      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    }
    const img = canvasElement.toDataURL();
    const file: Blob = dataURItoBlob(img);
    return file;
  }

  private drawImage(
    canvasElement: HTMLCanvasElement,
    canvasRenderingContext: CanvasRenderingContext2D,
    imageElement: HTMLImageElement,
  ) {
    const imageWidth = imageElement.width;
    const imageHeight = imageElement.height;
    canvasElement.width = imageWidth;
    canvasElement.height = imageHeight;
    canvasRenderingContext.drawImage(imageElement, 0, 0, imageWidth, imageHeight);
  }

  private drawTexts(canvasRenderingContext: CanvasRenderingContext2D, texts: any[]) {
    canvasRenderingContext.font = '20px Arial';
    canvasRenderingContext.textAlign = 'center';
    canvasRenderingContext.textBaseline = 'middle';
    texts.forEach((text) => {
      canvasRenderingContext.fillStyle = text.color;
      canvasRenderingContext.fillText(text.content, text.x, text.y);
    });
  }

  private isInsideText(canvasRenderingContext: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
    return this._texts.some((text) => {
      const textWidth = canvasRenderingContext.measureText(text.content).width;
      const textHeight = parseInt(canvasRenderingContext.font);
      return (
        mouseX > text.x - textWidth / 2 &&
        mouseX < text.x + textWidth / 2 &&
        mouseY > text.y - textHeight / 2 &&
        mouseY < text.y + textHeight / 2
      );
    });
  }

  private initializeTextDrawing(canvasElement: HTMLCanvasElement, canvasRenderingContext: CanvasRenderingContext2D) {
    /**
     * au lieu d'utiliser une fonction fléché (e) => {},
     * sauvegarde le context et donc accèder aux propriétés de l'objet dans la fonction anonyme de addEventListener sans utilisé la fonction fléché
     * qui elle permet d'accèder au context this dans la fonction anonyme de addEventListener.
     */
    const self = this;
    this._elementRef.nativeElement.querySelector('#textForm').addEventListener('submit', function (e: Event) {
      e.preventDefault();
      const textInput = self._elementRef.nativeElement.querySelector('#textInput') as HTMLInputElement;
      const content = textInput?.value ?? '';
      const color = self.getColor;
      const x = Math.random() * canvasElement.width;
      const y = Math.random() * canvasElement.height;
      const textItem: TextItem = { content, color, x, y };
      self._texts.push(textItem);
      self.drawTexts(canvasRenderingContext, self._texts);
      textInput.value = '';
    });
  }

  private initiliazeCanvasEvents(canvasElement: HTMLCanvasElement, canvasRenderingContext: CanvasRenderingContext2D) {
    let isDrawing = false;
    let isDragging = false;
    canvasElement.onmousedown = (e) => {
      isDrawing = true;
      const mouseX = e.clientX - canvasElement.getBoundingClientRect().left;
      const mouseY = e.clientY - canvasElement.getBoundingClientRect().top;
      // Si pas sur texte, alors dessine
      if (!this.isInsideText(canvasRenderingContext, mouseX, mouseY)) {
        const rect = canvasElement.getBoundingClientRect();
        const scaleX = canvasElement.width / rect.width;
        const scaleY = canvasElement.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        canvasRenderingContext.beginPath();
        canvasRenderingContext.lineWidth = this.getSize;
        canvasRenderingContext.strokeStyle = this.getColor;
        canvasRenderingContext.lineJoin = 'round';
        canvasRenderingContext.lineCap = 'round';
        canvasRenderingContext.moveTo(x, y);
      }
      // Texte
      const self = this;
      this._texts.forEach((text, index) => {
        const textWidth = canvasRenderingContext.measureText(text.content).width;
        const textHeight = parseInt(canvasRenderingContext.font);
        if (this.isInsideText(canvasRenderingContext, mouseX, mouseY)) {
          function move(e: MouseEvent) {
            // Efface l'ancienne position du texte sans effacer tout le canvas
            canvasRenderingContext.clearRect(
              text.x - textWidth / 2 - 1,
              text.y - textHeight / 2 - 1,
              textWidth + 2,
              textHeight + 2,
            );
            text.x = e.clientX - canvasElement.getBoundingClientRect().left;
            text.y = e.clientY - canvasElement.getBoundingClientRect().top;
            self.drawTexts(canvasRenderingContext, self._texts);
          }
          if (!isDragging) {
            isDragging = true;
            canvasElement.addEventListener('mousemove', move);
            canvasElement.addEventListener('mouseup', function () {
              isDragging = false;
              canvasElement.removeEventListener('mousemove', move);
            });
          } else {
            isDragging = false; // Arrête le glissement si on reclique
            canvasElement.removeEventListener('mousemove', move);
          }
        }
      }, /** paramètre de la fonction anonyme du foreach */ isDragging);
    };
    canvasElement.onmousemove = (e) => {
      const mouseX = e.clientX - canvasElement.getBoundingClientRect().left;
      const mouseY = e.clientY - canvasElement.getBoundingClientRect().top;
      if (isDrawing && !this.isInsideText(canvasRenderingContext, mouseX, mouseY)) {
        const rect = canvasElement.getBoundingClientRect();
        const scaleX = canvasElement.width / rect.width;
        const scaleY = canvasElement.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        canvasRenderingContext.lineTo(x, y);
        canvasRenderingContext.stroke();
      }
    };
    canvasElement.onmouseup = () => {
      isDrawing = false;
      canvasRenderingContext.closePath();
    };
  }

  private initiliazeCanvasClearingEvent(
    canvasElement: HTMLCanvasElement,
    canvasRenderingContext: CanvasRenderingContext2D,
    imageElement: HTMLImageElement,
  ) {
    const clearElement = this._elementRef.nativeElement.querySelector('#clear') as HTMLButtonElement;
    clearElement.onclick = () => {
      canvasRenderingContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
      this.drawImage(canvasElement, canvasRenderingContext, imageElement);
    };
  }

  private initializeImageDownloadEvent(canvasElement: HTMLCanvasElement): void {
    const self = this;
    this._elementRef.nativeElement.querySelector('#download').addEventListener('click', function () {
      const link = self._renderer.createElement('a');
      link.href = canvasElement.toDataURL(self.getEditedFile?.type ?? 'image/png');
      link.download = 'canvas_image.png';
      link.click();
    });
  }

  private initializeCanvasDrawing(): void {
    const canvasElement: HTMLCanvasElement = this._elementRef.nativeElement.querySelector(
      '#canvas',
    ) as HTMLCanvasElement;
    const canvasRenderingContext: CanvasRenderingContext2D | null = canvasElement.getContext('2d');
    if (!canvasElement || !canvasRenderingContext) return;
    this.initiliazeCanvasEvents(canvasElement, canvasRenderingContext);
    this.initializeTextDrawing(canvasElement, canvasRenderingContext);
    this.initializeImageDownloadEvent(canvasElement);
    // Utilise le document car accès à l'input
    const fileInput: HTMLInputElement = document.getElementById(`${this.getFileInputId}`) as HTMLInputElement;
    fileInput.addEventListener('change', async (e) => {
      const files: FileList | null = fileInput.files;
      let file: File | null = null;
      if (files && files.length > 0) {
        file = files[0];
        this.setEditedFile = file;
      } else {
        this._toastrService.error('Aucune image sélectionnée, veuillez indiquer une image', 'Aucune image');
        return;
      }
      const imageElement = this._renderer.createElement('img');
      imageElement.src = await this.fileToDataUri(file);
      imageElement.addEventListener('load', () => {
        this.drawImage(canvasElement, canvasRenderingContext, imageElement);
        this.initiliazeCanvasClearingEvent(canvasElement, canvasRenderingContext, imageElement);
      });
    });
    const validateEdition: HTMLButtonElement = this._elementRef.nativeElement.querySelector(
      '#validate',
    ) as HTMLButtonElement;
    validateEdition.addEventListener('click', (e) => {
      const blob: Blob = this.canvasToBlob(canvasElement);
      const newFile: File = new File([blob], this.getEditedFile?.name ?? 'file.png', { type: blob.type });
      const newFileList: DataTransfer = new DataTransfer();
      newFileList.items.add(newFile);
      /** Met à jour le  fileInput.files même s'il n'ait pas utilisé pour récuperer le fichier (le fichier est récupéré par l'EventEmitter getFileChange) */
      fileInput.files = newFileList.files;
      /** Envoie le nouveau fichier à l'EventEmitter getFileChange pour le donner au formulaire */
      this.getFileChange.emit(newFile);
      this._toastrService.success("L'édition du fichier a été validé", "Validation de l'édition");
    });
  }
}
