"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Heading,
  Underline,
  Alignment,
  List,
  Image,
  ImageUpload,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Base64UploadAdapter,
  FontColor,
  FontSize,
  FontFamily,
  FontBackgroundColor,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  BlockQuote,
  HorizontalLine,
  Link,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Indent,
  IndentBlock,
  RemoveFormat,
  Enter,
  ShiftEnter,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "ckeditor5/ckeditor5-content.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editorRef?: React.MutableRefObject<any>;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  editorRef,
}: RichTextEditorProps) {
  const normalizedContent = content || '<p></p>';
  
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={normalizedContent}
        onReady={(editor) => {
          if (editorRef) {
            editorRef.current = editor;
          }
          // Prevent auto-select all on focus
          editor.editing.view.document.on('focus', () => {
            const selection = editor.model.document.selection;
            if (selection.isCollapsed) {
              return;
            }
          }, { priority: 'high' });
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Enter,
            ShiftEnter,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            Heading,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Alignment,
            List,
            Indent,
            IndentBlock,
            BlockQuote,
            Link,
            Image,
            ImageUpload,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            Base64UploadAdapter,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            HorizontalLine,
            RemoveFormat,
            Undo,
          ],
          toolbar: [
            "heading",
            "|",
            "fontFamily",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "subscript",
            "superscript",
            "code",
            "|",
            "link",
            "uploadImage",
            "insertTable",
            "blockQuote",
            "horizontalLine",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
            "|",
            "removeFormat",
            "|",
            "undo",
            "redo",
          ],
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            ],
          },
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif',
            ],
          },
          fontSize: {
            options: [
              'tiny',
              'small',
              'default',
              'big',
              'huge'
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties'
            ],
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative',
            ],
            resizeOptions: [
              {
                name: 'resizeImage:original',
                label: 'Original',
                value: null,
              },
              {
                name: 'resizeImage:25',
                label: '25%',
                value: '25',
              },
              {
                name: 'resizeImage:50',
                label: '50%',
                value: '50',
              },
              {
                name: 'resizeImage:75',
                label: '75%',
                value: '75',
              },
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
          },
          placeholder: placeholder || "Write your content here...",
          initialData: normalizedContent,
        }}
      />
    </div>
  );
}
