import { Component, OnInit } from '@angular/core'

import { Prediction, RESULT } from './constants';

import * as tf from '@tensorflow/tfjs'

import { AfterViewInit, ViewChild } from '@angular/core';
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

  filePath: string = '';

  loadingModel: Boolean = true;
  model: tf.LayersModel

  result = RESULT;
  order: Array<any>;

  predictResult: Uint8Array | Float32Array | Int32Array;

  predictions: Array<{probability: number, className: string}>;

  displayedColumns: string[] = [
    'fileName', 'blaireau', 'brebis', 'cervide', 'chat', 'cheval', 'chevreuil', 'chevre',
    'chien', 'daim', 'ecureuil', 'humain', 'isard', 'lievre', 'marmotte',
'martre', 'oiseaux', 'ours', 'renard', 'rien', 'sanglier', 'tetras', 'vache'
  ];
  dataSource: MatTableDataSource<Prediction>;

  emptyPrediction: Prediction = {fileName: 'DSC0001', preview: '', blaireau: 0, brebis: 0, cervide: 0, chat: 0,
  cheval: 0, chevreuil: 0, chevre: 0, chien: 0, daim: 0, ecureuil: 0, humain: 0,
  isard: 0, lievre: 0, marmotte: 0, martre: 0, oiseaux: 0, ours: 0, renard: 0,
  rien: 0, sanglier: 0, tetras: 0, vache: 0};

  predictions2 = [this.emptyPrediction];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor() {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.predictions2);
  }

  ngOnInit(): void {
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/model.json')
    this.loadingModel = false;
  }

  imagePreview(e: Event) {
    const file = (e.target as HTMLInputElement).files![0]

    const reader = new FileReader()
    reader.onload = () => {
      this.filePath = reader.result as string
    }
    reader.readAsDataURL(file)
  }


   async predict() {
    let image = document.getElementById('selected-image') as HTMLImageElement;
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
          probability: p,
          className: this.result[i]
        }
      }).sort(function (a, b) {
        return b.probability - a.probability
      });
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
