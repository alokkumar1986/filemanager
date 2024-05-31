import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  FileManagerModule,
  NavigationPaneService,
  ToolbarService as FileManagerToolbarService,
  DetailsViewService,
  FileManagerComponent,
} from '@syncfusion/ej2-angular-filemanager';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  PdfViewerComponent,
  PdfViewerModule,
  LinkAnnotationService,
  BookmarkViewService,
  MagnificationService,
  ThumbnailViewService,
  NavigationService,
  TextSearchService,
  TextSelectionService,
  PrintService,
  FormDesignerService,
  FormFieldsService,
  AnnotationService,
  ToolbarService as PDFToolbarService,
  CustomToolbarItemModel
} from '@syncfusion/ej2-angular-pdfviewer';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    FileManagerModule,
    HttpClientModule,
    PdfViewerModule,
  ],
  providers: [
    NavigationPaneService,
    FileManagerToolbarService,
    PDFToolbarService,
    DetailsViewService,
    LinkAnnotationService,
    BookmarkViewService,
    MagnificationService,
    ThumbnailViewService,
    NavigationService,
    TextSearchService,
    TextSelectionService,
    PrintService,
    FormDesignerService,
    FormFieldsService,
    AnnotationService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('filemanagerr', { static: true })
  fileManagerr!: FileManagerComponent;

  constructor(private http: HttpClient) {}
  @ViewChild('documenteditor_default', { static: false })
  public container!: DocumentEditorContainerComponent;

  @ViewChild('pdfView', { static: false })
  public pdfView!: PdfViewerComponent;
  public pdfSaveFile: CustomToolbarItemModel = {
    prefixIcon: 'e-icons e-save',
    id: 'saveOverwrite',
    tooltipText: 'Salva e sovrascrivi',
  };

  public toolbarClick(args: any): void {
    var pdfViewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
    if (args.item && args.item.id === 'saveOverwrite') {
      console.log("SAVE");
      console.log("documentPath: ", this.pdfView.documentPath)
      this.pdfView.downloadFileName = "test";
      // this.pdfView.documentPath = this.contentRootPath;
      this.pdfView.serverActionSettings.download = 'SaveDocument';
    }
  }

  public service: string =
    'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  public resource: string =
    'https://cdn.syncfusion.com/ej2/23.1.43/dist/ej2-pdfviewer-lib';

  public toolbarSettings: object = {
    showToolbar: true,
    toolbarItems: [
      this.pdfSaveFile,
      'PageNavigationTool',
      'MagnificationTool',
      'PanTool',
      'SelectionTool',
      'SearchOption',
      'PrintOption',
      'DownloadOption',
      'UndoRedoTool'
    ],
    showTooltip: true
  };
  viewHeight: number = 0;
  userRole: string = 'admin';
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateHeight();
  }

  public userFolder: string = '/Alessandro-Bolognini-26-01-15';
  // var contentRootPath = 'C:/Users/lakas/Downloads/FileManager 2 4 3/FileManager 2 4/angularFileManager 2/node-filesystem-provider/MioDOC';
  // public contentRootPath: string =
  //   '/Users/apple/Downloads/FileManager/angularFileManager 2/node-filesystem-provider/MioDOC';
    public contentRootPath: string = '/Users/ISU_375/Desktop/angularFileManager 2/node-filesystem-provider/MioDOC';
  @ViewChild('fileManager', { static: false })
  public fileManager!: FileManagerModule;

  updateHeight() {
    this.viewHeight = window.innerHeight - 50;
  }

  public ajaxSettings?: object;
  public view?: string;
  public allowDragAndDrop?: boolean;
  public hostUrl: string = 'http://localhost:8090/';

  public ngOnInit(): void {
    this.ajaxSettings = {
      url: this.hostUrl,
      getImageUrl: this.hostUrl + 'GetImage',
      // uploadUrl: this.hostUrl + 'Upload',
      // downloadUrl: this.hostUrl + 'Download',
      getDocumentUrl: this.hostUrl + 'GetDocument',
    };

    this.allowDragAndDrop = true;
    this.view = 'Details';
    this.updateHeight();
  }

  onBeforeSend(args: any): void {
    // Assicurati che args.ajaxSettings.data sia un oggetto e non una stringa
    if (typeof args.ajaxSettings.data === 'string') {
      args.ajaxSettings.data = JSON.parse(args.ajaxSettings.data);
    }

    if (args.action == 'Download') {
      debugger;
    }
    // var value = 'Destination';
    if (args.action == 'Upload') {
      var data1: any = [];
      const requestData = args.ajaxSettings.data;

      const extractedData = requestData.map((item: any) => {
        var pathName;
        var dataName;
        var fileName;

        if (item.path) {
          pathName = item.path;
        }
        if (item.data) {
          dataName = item.data;
        }
        if (item.filename) {
          fileName = item.filename;
        }
        data1.push({
          path: pathName,
          data: dataName,
          filename: fileName,
          contentRootPath: this.contentRootPath + this.userFolder,
        });
      });
      args.ajaxSettings.data = JSON.stringify(data1);
    } else {
      args.ajaxSettings.data = {
        ...args.ajaxSettings.data,
        contentRootPath: this.contentRootPath + this.userFolder,
      };

      args.ajaxSettings.data = JSON.stringify(args.ajaxSettings.data);
    }

    // if (args.action == 'Download') {
    //   args.ajaxSettings.data = {
    //     ...args.ajaxSettings.data,
    //     contentRootPath: this.contentRootPath + this.userFolder,
    //   };

    //   //Serializza l'oggetto dati modificato in una stringa JSON
    //   args.ajaxSettings.data = JSON.stringify(args.ajaxSettings.data);
    // }
  }

  beforeDownload(args: any): void {
    let ajax: XMLHttpRequest = new XMLHttpRequest();
    ajax.open('POST', this.hostUrl + 'Download', true);
    ajax.setRequestHeader('content-type', 'application/json');

    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          this.container.documentEditor.open(ajax.responseText);
        }
      }
    };

    // args.ajaxSettings.data = {
    //   ...args.ajaxSettings.data,
    //   contentRootPath: this.contentRootPath + this.userFolder,
    // };

    ajax.send(
      JSON.stringify({
        contentRootPath: this.contentRootPath + this.userFolder,
        Action: 'Download',
        keyDownEvent: 'keydown',
      })
    );
  }

  fileOpen(args: {
    fileDetails: { name: string; filterPath: string; type: string };
  }) {
    let fileName: string = args.fileDetails.name;
    let filePath: string =
      args.fileDetails.filterPath.replace(/\\/g, '/') + fileName;
    let fileType: string = args.fileDetails.type;

    if (fileType == '.pdf') {
      this.showPDFViewer(fileName);
      this.getFileStream(filePath, true);
    }
  }

  showPDFViewer(name: string) {
    (<HTMLElement>(
      document.getElementsByClassName('file-container')[0]
    )).style.visibility = 'hidden';
    (<HTMLElement>(
      document.getElementsByClassName('pdf-container')[0]
    )).style.visibility = 'visible';
    document.getElementsByClassName('pdf-title')[0].innerHTML = name;
  }

  // downloadFileorFolder(filePath: string, contentRootPath: string) {
  //   console.log('================================================');
  //   let ajax: XMLHttpRequest = new XMLHttpRequest();
  //   ajax.open('POST', this.hostUrl + 'Download', true);
  //   ajax.setRequestHeader('content-type', 'application/json');

  //   ajax.onreadystatechange = () => {
  //     if (ajax.readyState === 4) {
  //       debugger;
  //       if (ajax.status === 200 || ajax.status === 304) {
  //         // if (!isPDF) {
  //         // open SFDT text in document editor
  //         this.container.documentEditor.open(ajax.responseText);
  //         // } else {
  //         // var pdfviewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
  //         // pdfviewer.load(ajax.responseText, null);
  //         //opens the file in pdf viewer
  //         //this.pdfView.load(ajax.responseText, '');
  //         // }
  //       }
  //     }
  //   };
  //   ajax.send(
  //     JSON.stringify({
  //       contentRootPath: this.contentRootPath + this.userFolder,
  //       path: filePath,
  //       Action: 'Download',
  //     })
  //   );
  // }
  getFileStream(filePath: string, isPDF: boolean) {
    let ajax: XMLHttpRequest = new XMLHttpRequest();
    ajax.open('POST', this.hostUrl + 'GetDocument', true);
    ajax.setRequestHeader('content-type', 'application/json');

    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          if (!isPDF) {
            // open SFDT text in document editor
            this.container.documentEditor.open(ajax.responseText);
          } else {
            var pdfviewer = (<any>document.getElementById('pdfViewer'))
              .ej2_instances[0];
            pdfviewer.load(ajax.responseText, null);
            //opens the file in pdf viewer
            //this.pdfView.load(ajax.responseText, '');
          }
        }
      }
    };
    ajax.send(
      JSON.stringify({
        contentRootPath: this.contentRootPath + this.userFolder,
        path: filePath,
        Action: !isPDF ? 'ImportFile' : 'LoadPDF',
      })
    );
  }

  onClicked() {
    (<HTMLElement>(
      document.getElementsByClassName('file-container')[0]
    )).style.visibility = 'visible';
    (<HTMLElement>(
      document.getElementsByClassName('pdf-container')[0]
    )).style.visibility = 'hidden';
  }

  public customArgs: any;

  onOpenComplete(args: any) {
    this.customArgs = args.response.data.customArgs;
  }

  // File Manager's file drag start event function
  onFileDragStart(args: any) {
    console.log('File drag start');
  }
  // File Manager's file drag stop event function
  onFileDragStop(args: any) {
    console.log('File drag stop');
  }
  // File Manager's file dragging event function
  onFileDragging(args: any) {
    console.log('File dragging');
  }
  // File Manager's file dropped event function
  onFileDropped(args: any) {
    console.log('File dropped');
  }

  isFileManagerAccessible(): boolean {
    // Implement access control logic based on user role
    return this.userRole === 'admin'; // Example: Allow access for admin role
  }
}
