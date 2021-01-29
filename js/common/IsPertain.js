var IsPertain = {

	IsPertainStreet: function(lng, lat) {
		var dataroot = "js/json/Area.json";
		$.getJSON(dataroot, function(data) {
			var Street = ''
			var arr = data.features;
			for (var i = 0; i < arr.length; i++) {
				var polygon1 = [];
				var polygon2 = [];
				if (i == 24) {
					for (var j = 0; j < arr[24].geometry.coordinates.length; j++) {
						for (var k = 0; k < arr[24].geometry.coordinates[0][0].length; k++) {
							polygon1.push([arr[24].geometry.coordinates[0][0][k][0], arr[24].geometry.coordinates[0][0][k][1]])
						}
					}
					for (var j = 0; j < arr[24].geometry.coordinates.length; j++) {
						for (var k = 0; k < arr[24].geometry.coordinates[1][0].length; k++) {
							polygon2.push([arr[24].geometry.coordinates[1][0][k][0], arr[24].geometry.coordinates[1][0][k][1]])
						}
					}
				} else if (i == 14) {
					for (var j = 0; j < arr[14].geometry.coordinates.length; j++) {
						for (var k = 0; k < arr[14].geometry.coordinates[0].length; k++) {
							polygon1.push([arr[14].geometry.coordinates[0][k][0], arr[14].geometry.coordinates[0][k][1]])
						}
					}
					for (var j = 0; j < arr[14].geometry.coordinates.length; j++) {
						for (var k = 0; k < arr[14].geometry.coordinates[1].length; k++) {
							polygon2.push([arr[14].geometry.coordinates[1][k][0], arr[14].geometry.coordinates[1][k][1]])
						}
					}
				} else {
					for (var j = 0; j < arr[i].geometry.coordinates.length; j++) {
						for (var k = 0; k < arr[i].geometry.coordinates[0].length; k++) {
							polygon1.push([arr[i].geometry.coordinates[0][k][0], arr[i].geometry.coordinates[0][k][1]])
						}
					}
				}
				var pt = turf.point = ([lng, lat]);
				var poly = turf.polygon([polygon1]);
				if (turf.booleanPointInPolygon(pt, poly)) {
					Street = arr[i].properties.JZNAME;
					console.log(Street)
					return Street
				}
				if (polygon2.length !== 0) {
					var poly2 = turf.polygon([polygon2]);
					if (turf.booleanPointInPolygon(pt, poly2)) {
						Street = arr[i].properties.JZNAME;
						console.log(Street)
						return Street
					}
				}
			}
		});
	}
};


// var checkPoint = [117.5853, 39.01065];
// for (var j = 0; j < arr[i].geometry.coordinates.length; j++) {
// 	for (var k = 0; k < arr[i].geometry.coordinates[j].length; k++) {
// 		polygonPoints.push([arr[i].geometry.coordinates[j][k][0], arr[i].geometry.coordinates[j][k][1]])
// 	}
// }
// 
// var counter = 0;
// var i;
// var xinters;
// var p1, p2;
// var pointCount = polygonPoints.length;
// p1 = polygonPoints[0];

// for (i = 1; i <= pointCount; i++) {
// 	p2 = polygonPoints[i % pointCount];
// 	if (
// 		checkPoint[0] > Math.min(p1[0], p2[0]) &&
// 		checkPoint[0] <= Math.max(p1[0], p2[0])
// 	) {
// 		if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
// 			if (p1[0] != p2[0]) {
// 				xinters =
// 					(checkPoint[0] - p1[0]) *
// 					(p2[1] - p1[1]) /
// 					(p2[0] - p1[0]) +
// 					p1[1];
// 				if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
// 					counter++;
// 				}
// 			}
// 		}
// 	}
// 	p1 = p2;
// }
// if (counter % 2 !== 0) {
// 	console.log(arr[i].properties.JZNAME)
// }
