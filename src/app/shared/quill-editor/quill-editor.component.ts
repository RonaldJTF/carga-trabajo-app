
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
import ImageResize from 'quill-image-resize';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorComponent),
      multi: true
    }
  ]
})
export class QuillEditorComponent implements ControlValueAccessor {
  onChange = (value: string) => {};
  registerOnChange(fn: (value: string) => void): void {this.onChange = fn}
  writeValue(value: string): void {
    this.contentHtml = value;
  }
  registerOnTouched(){}
  
  @ViewChild('editorContainer') editorContainer: ElementRef;
  @Output() onContentChange: EventEmitter<{ contentHtml: string }> = new EventEmitter<{ contentHtml: string}>();
  
  contentHtml: string;

  editorModules = {
    toolbar: {
      container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
      ]
    },
    imageResize: {
      displaySize: true
    }
  };

  contentChange(data: any){
    this.onChange(data.html);
    this.onContentChange.emit({ contentHtml: data.html});
  }

  readyEditor(){
    const toolbar: any = this.editorContainer.nativeElement.querySelector('.ql-toolbar');
    const container: any = this.editorContainer.nativeElement.querySelector('.ql-container');
    const editor = container.querySelector('.ql-editor');
    toolbar.classList.add('p-editor-toolbar');
    container.classList.add('p-editor-content');
    container.style.minHeight = '120px'; 
    editor.style.minHeight = '120px'; 
  }
}
