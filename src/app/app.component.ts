import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from "@angular/forms"

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
  myForm: FormGroup;

  loadingModel: Boolean = true;
  model: tf.LayersModel

  result = RESULT;
  order: Array<any>;

  predictResult: Uint8Array | Float32Array | Int32Array;

  predictions: Array<{probability: number, className: string}>;


  constructor(public fb: FormBuilder) {
    this.myForm = this.fb.group({
      img: [null],
      filename: ['']
    })
  }

  ngOnInit(): void {
    this.loadModel();
  }

  async loadModel() {
    this.model = await tf.loadLayersModel('/assets/model.json')
    this.loadingModel = false;
  }

  fileEvent(fileInput: Event){
    let file = (fileInput.target as HTMLInputElement).files
    let fileName = file![0].name
  }

  imagePreview(e: Event) {
    const file = (e.target as HTMLInputElement).files![0]

    this.myForm.patchValue({
      img: file
    })

    this.myForm.get('img')!.updateValueAndValidity()

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
