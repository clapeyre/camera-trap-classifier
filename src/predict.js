const Result = {
    0:  'Blaireau',
    1:  'Brebis',
    2:  'Cervide-cerf',
    3:  'Chat',
    4:  'Cheval',
    5:  'Chevreuil',
    6:  'Chèvre',
    7:  'Chien',
    8:  'Daim',
    9:  'Ecureuil',
    10: 'Humain',
    11: 'Isard',
    12: 'Lievre',
    13: 'Marmotte',
    14: 'Martre',
    15: 'Oiseaux',
    16: 'Ours',
    17: 'Renard',
    18: 'Rien',
    19: 'Sanglier',
    20: 'Tetras',
    21: 'Vache'
}

document.querySelector("#image-selector").addEventListener( "change", function () {
	let reader = new FileReader()
	reader.onload = function () {
		let dataURL = reader.result;
		document.getElementById('selected-image').setAttribute("src", dataURL);
		document.getElementById("prediction-list").innerHTML = '';
	}
	let file = document.getElementById("image-selector").files[0];
	reader.readAsDataURL(file);
})

let model
document.addEventListener("DOMContentLoaded", async function () {
	// document.getElementsByClassName('.progress-bar').style.display == "block"
	model = await tf.loadLayersModel('model/model.json')
	console.log('Model Loaded')
	// document.getElementsByClassName('progress-bar').style.display == "none"
})

document.getElementById("predictBtn").addEventListener( "click", async function () {
	let image = document.getElementById('selected-image')
	console.log({image: document.getElementById('selected-image')});
	let pre_image = tf.browser.fromPixels(image, 3)
		.resizeNearestNeighbor([224, 224])
		.expandDims()
		.toFloat()
	        .div(255)
		.reverse(-1) 
	let predict_result = await model.predict(pre_image).data()
	console.log(predict_result)
	let order = Array.from(predict_result)
		.map(function (p, i) { 
			return {
				probability: p,
				className: Result[i] 
			}
		}).sort(function (a, b) {
			return b.probability - a.probability
		}).slice(0, 5)
	console.log(order)

	document.getElementById("prediction-list").innerHTML = '';
	order.forEach(function (p) {
		document.getElementById("prediction-list").insertAdjacentHTML("beforeend",`<li>${p.className}: ${parseInt(Math.trunc(p.probability * 100))} %</li>`)
	})
})
