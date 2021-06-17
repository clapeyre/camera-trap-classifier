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
};

$("#image-selector").change(function () {
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
	}

	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
$(document).ready(async function () {
	$('.progress-bar').show();
	model = await tf.loadLayersModel('model/model.json');
	$('.progress-bar').hide();
});

$("#predictBtn").click(async function () {
	let image = $('#selected-image').get(0);
	
	let pre_image = tf.browser.fromPixels(image, 3)
		.resizeNearestNeighbor([224, 224])
		.expandDims()
		.toFloat()
	        .div(255)
		.reverse(-1); 
	let predict_result = await model.predict(pre_image).data();
	console.log(predict_result);
	let order = Array.from(predict_result)
		.map(function (p, i) { 
			return {
				probability: p,
				className: Result[i] 
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 5);
	console.log(order);

	$("#prediction-list").empty();
	order.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${parseInt(Math.trunc(p.probability * 100))} %</li>`);
	});
});
