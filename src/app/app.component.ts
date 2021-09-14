import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser';

import { Prediction, RESULT, EMPTY_PREDICTION, DISPLAYED_COLUMNS } from './constants';

import * as tf from '@tensorflow/tfjs'

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'angular-app'

  filePath: string[] = [];
  currentFileName: string;
  fileNames: string[] = [];
  images: HTMLImageElement[] = [];

  loadingModel: Boolean = true;
  tableReady: Boolean = false;
  model: tf.LayersModel

  result = RESULT;
  order: Array<any>;

  predictResult: Uint8Array | Float32Array | Int32Array;

  predictions: any;

  displayedColumns = DISPLAYED_COLUMNS;
  dataSource: MatTableDataSource<Prediction>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private  sanitizer: DomSanitizer) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource([...EMPTY_PREDICTION]);
  }

  ngOnInit(): void {
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/model.json')
    this.loadingModel = false;
  }

  loadInputFiles(e: Event) {
    const files = (e.target as HTMLInputElement).files!;
    this.fileNames = [];
    this.filePath = [];
    this.images = [];

    Object.keys(files).forEach((key, index) => {
      this.fileNames.push(files[index].name);
    const reader = new FileReader()
    reader.onload = () => {
        this.filePath.push( reader.result as string);
        this.images.push(new Image());
    }
      reader.readAsDataURL(files[index])
    })
  }

  predictionLoop() {
    this.filePath.forEach((file, index) => {
      this.images[index].src = file;
    })
    this.images.forEach((x, index) => {
      x.onload = () => {
        this.predict(x, this.fileNames[index]);
      };
    });
  }

  async predict(image: HTMLImageElement, fileName: string) {
    let pre_image = tf.browser.fromPixels(image, 3)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .div(255)
      .reverse(-1);
    let predictResult = await (this.model.predict(pre_image) as tf.Tensor).data();
    this.predictions = Array.from(predictResult)
      .map( (p, i) => {
        return {
          probability: parseFloat(p.toFixed(2)),
          className: this.result[i]
        }
    })
    .reduce((map: {[key: string]: number}, obj: {probability: number, className: string}) => {
      map[obj.className.toLowerCase()] = obj.probability;
      return map;
    }, {})

    this.predictions['fileName'] = fileName.length > 8 ? `${fileName.substr(0,4)}...${fileName.substr(-1,3)}` : fileName;
    this.predictions['preview'] = this.sanitizer.bypassSecurityTrustUrl(image.src);

    let data = this.dataSource.data;
    if (JSON.stringify(data) === JSON.stringify(EMPTY_PREDICTION)) {
      data.pop();
      this.tableReady = true;
    }
    data.push(this.predictions);
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

