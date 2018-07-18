(function ($) {
	'use strict';
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCAh0OS2aoN3uK6Su2FsYYfBrrjcK_Z7eQ",
		authDomain: "bitalino-test.firebaseapp.com",
		databaseURL: "https://bitalino-test.firebaseio.com",
		projectId: "bitalino-test",
		storageBucket: "bitalino-test.appspot.com",
		messagingSenderId: "217778137158"
	};
	firebase.initializeApp(config);
	// Firebase Database Reference and the child
	const dbRef = firebase.database().ref();
	const usersRef = dbRef.child('pacients');
	const bitalino = dbRef.child('bitalino');
	const vitalino = dbRef.child('bitali');
	var interval = null;
	const evaluationActive = dbRef.child('evaluation_active');
	var urlParams = new URLSearchParams(window.location.search);
	readParameter();
	//readBitalino();
	//readEvaluation();
	function readEvaluation(idPacient, idEvaluation) {
		var ww = dbRef.child('bitalino/' + idPacient).orderByChild("idEvaluation")
			.equalTo(idEvaluation);

		ww.on("value", snap => {
			var data = [];
			snap.forEach(childSnap => {
				data.push(childSnap.val().data);
			});
			draw(data);
			console.log(data.length);
		});
	}
	function draw(data) {
		$(".se-pre-con").fadeOut("slow");
		var heartRate = 60; // bpm
		var interval = 60 * 1000 / (data.length * heartRate);
		var cont = 0;
		var inter = setInterval(() => {

			$('.jke-ecgChart').ecgChart('addDataPoint', { x: Date.now(), y: (data[cont] * 1000) });
			cont++;
			if (cont == data.length) {
				clearInterval(inter);
			}
		}, interval);
	}
	function readParameter() {
		var id = urlParams.get('id');
		var idEvaluation = urlParams.get('idElement');
		readUserData(id, idEvaluation);
	}

	function readUserData(id, idEvaluation) {
		var ww = dbRef.child('pacients/' + id);
		ww.on("value", snap => {
			var pacient = snap.val();
			console.log(pacient);
			document.getElementById("nameH5").innerHTML = pacient.name + " " + pacient.lastName;
			document.getElementById("addressH5").innerHTML = pacient.address;
			document.getElementById("dateH5").innerHTML = formatDate(new Date());
			document.getElementById("historyH5").innerHTML = pacient.numberHistory;
		});
		readEvaluation(id, idEvaluation);
	}
	function readActiveEvaluation(id) {
		dbRef.child('evaluation_active/' + id).orderByChild("evaluation")
			.equalTo(false).on("child_added", function (snapshot) {
				clearInterval(interval)

				//readBitalino(snapshot.val().idEvaluation, id);
			});
		var active = dbRef.child('evaluation_active/' + id).orderByChild("evaluation")
			.equalTo(true).on("child_added", function (snapshot) {
				if (snapshot.val().idEvaluation != undefined) {
					readBitalino();
				} else {
					clearInterval(interval)
				}
				//readBitalino(snapshot.val().idEvaluation, id);
			});

	}

	function readBitalino() {
		interval = setInterval(function () {
			$('.jke-ecgChart').ecgChart('addDataPoint', getDataPoint());
		}, interval);

		//bitalino.on("child_added", snap => {

		//snap.forEach(childSnap => {
		//console.log('new record', snapshot.key);
		//$('.jke-ecgChart').ecgChart('addDataPoint', getDataPoint());
		//});
		//})
	}
	// Create a data point generator.
	var getDataPoint = (function () {

		var _x = -1;
		var _max = _data.length;

		return function () {
			_x = (_x + 1) % _max;
			return { x: Date.now(), y: _data[_x] };
		};
	})();
	var heartRate = 60; // bpm
	var interval = 60 * 1000 / (_data.length * heartRate);
	console.log(interval);
	function formatDate(date) {
		var monthNames = [
			"Enero", "Febrero", "Marzo",
			"Abril", "Mayo", "Junio", "Julio",
			"August", "September", "October",
			"November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

})($);
