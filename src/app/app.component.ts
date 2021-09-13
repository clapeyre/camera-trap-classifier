import { Component, OnInit } from '@angular/core'

import { RESULT } from './result';

import * as tf from '@tensorflow/tfjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-app'

  filePath: string = ''

  loadingModel: Boolean = true;
  model: tf.LayersModel

  result = RESULT;
  order: Array<any>;

  predictResult: Uint8Array | Float32Array | Int32Array;

  predictions: Array<{probability: number, className: string}>;


  constructor() {}

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
    console.log('async function works');
    let image = document.getElementById('selected-image') as HTMLImageElement;

      console.log({image});

      let pre_image = tf.browser.fromPixels(image, 3)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()
        .div(255)
        .reverse(-1);
        console.log({pre_image});


      let predictResult = await (this.model.predict(pre_image) as tf.Tensor).data();

      console.log({predictResult});

      this.predictions = Array.from(predictResult)
        .map( (p, i) => {
          return {
            probability: p,
            className: this.result[i]
          }
        }).sort(function (a, b) {
          return b.probability - a.probability
        });


	this.predictions.forEach( (p) => { console.log('in the loop', p); })

  }
}
