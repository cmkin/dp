define('index', ['jquery', 'tmap', 'turf', 'd3', 'd3SvgOverlay', 'basetmap', 'toolLayers', 'uibase', 'html2canvas',
		'leaflet',
		'leaflet-tilelayer-wmts-src', 'message'
	],
	function($, tmap, turf, d3, d3SvgOverlay, bmap, toolLayers, uibase, html2canvas, L) {

		var map;
		var zoom = 12;
		var localsearch;
		var MAP = null;
		var countries = [];

		var center = new T.LngLat(117.654173, 39.032846);
		var bhjson = 'data/BinhaiNewDistrict.json';
		//var site = 'http://121.36.143.229:7777/';
		var site = 'http://bhmap.wenxingkeji.net/';
		var dataroot = 'data/Area.json';
		

		return {
			initialize: function() {
				$(function() {

					//初始化地图对象
					basemap = bmap.baseTmap;
					//地图初始化
					map = basemap.initialize("mapDiv");
					//放大缩小
					basemap.zoomControl("rightBOTTOM");
					//比例尺
					//basemap.scaleControl();
					//鹰眼
					//basemap.overviewMapControl();
					//加载滨海json
					basemap.BHGeoJson();
					

					$('#searchBtn').on('click', function(data) {
						var key = $('#searchInput').val();
						if (key != '') {
							searchNearby(key, function(data) {
								document.getElementById("uls").innerHTML = "";
								pois(data.getPois())
							}, center)
						}
					});
					//关键字搜索
					var key = uibase.getQueryVariable('key');
					if (key != '' && key.length > 0) {
						searchNearby(key, function(data) {
							document.getElementById("uls").innerHTML = "";
							pois(data.getPois())
						}, center)
					}
					//调用toolLayers组件
					toolLayers.initToolLayers();
				 
				})
			},
		}
	 
		//搜索
		function searchNearby(keyWord, callback, center, radius) {
			 
			if (center == undefined) {
				center = new T.LngLat(center)
			}
			if (radius == undefined) {
				radius = 5000
			}
			var config = {
				pageCapacity: 100000,
				onSearchComplete: function(data) {
					if (typeof callback == 'function') {
						callback(data)
					}
				}
			};
			map.localsearch = new T.LocalSearch(map, config);
			map.localsearch.searchNearby(keyWord, center, 5000)
		}



		//替换模板内容
		function InfoWindow(searcRecord) {
			var icon = new T.Icon({
				iconUrl: "images/dingwei.png",
				iconSize: new T.Point(30, 38),
				iconAnchor: new T.Point(15, 38)
			});
			var lnglat = new T.LngLat(searcRecord.lng, searcRecord.lat);
			var marker = new T.Marker(lnglat, {
				icon: icon
			});
			map.addOverLay(marker);
			marker.addEventListener("click", function() {
				var infoWin1 = new T.InfoWindow();
				var inwindowTemplate = $('.infowindow');
				var tempJsonStr = JSON.stringify(searcRecord).replace(/\"/g, "'");
				var name = inwindowTemplate.find('.info_name').text(searcRecord.key);
				var address = inwindowTemplate.find('.info_address').text(searcRecord.street);
				infoWin1.setContent(inwindowTemplate.html());
				marker.openInfoWindow(infoWin1);
				$('.remarker').on('click', function() {
					remarker(searcRecord);
				});
				$('.jietu').on('click', function() {
					saveRecord(searcRecord);
				});
			});
			return marker;
		}
		//保存
		function saveRecord(searcRecord) {
			html2canvas(document.body).then(canvas => {
				var imgUrl = canvas.toDataURL("image/png", 1);
				var file = dataURLtoFile(imgUrl, "1.png");
				var url = site + 'uploadfile';
				var operatorId = '123';
				var formData = new FormData();
				formData.append("file", file);
				formData.append("operatorId", operatorId);
				$.ajax({
					url: url,
					dataType: "json",
					type: "post",
					data: formData,
					processData: false,
					contentType: false,
					error: function(res) {},
					success: function(res) {
						searcRecord.photo = res;
						url = site + 'search/SaveSearchrecord';
						$.post(url, searcRecord, function(data) {
							console.log(data);
							window.parent.postMessage({
								refresh: {
									data
								}
							}, '*');
							var tempJsonStr = JSON.stringify(data).replace(/\"/g, "'");
							toast({
								msg: '信息保存成功！',
								type: 'loading',
								time: 3000
							})
							//alert('信息保存成功！'+'\n' +tempJsonStr);
						})

					}
				})
			})
		}

		function pois(obj) {
			removeOverLay();
			if (obj) {
				var divMarker = document.createElement("div");
				var zoomArr = [];
				var dtd = $.Deferred();
				for (var i = 0; i < obj.length; i++) {
					(function(i) {
						var name = obj[i].name;
						var address = obj[i].address;
						var town = obj[i].town;
						var area = obj[i].area;
						var tel = obj[i].tel;
						var lnglatArr = obj[i].lonlat.split(" ");
						var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);

						$.getJSON(dataroot, function(data) {
							var Street = '' || '暂无数据';
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
								var pt = turf.point = ([lnglatArr[0], lnglatArr[1]]);
								var poly = turf.polygon([polygon1]);
								if (turf.booleanPointInPolygon(pt, poly)) {
									Street = arr[i].properties.JZNAME;
								}
								if (polygon2.length !== 0) {
									var poly2 = turf.polygon([polygon2]);
									if (turf.booleanPointInPolygon(pt, poly2)) {
										Street = arr[i].properties.JZNAME;
									}
								}
							}
							var searcRecord = {};
							searcRecord.key = name;
							searcRecord.address = address;
							searcRecord.street = Street;
							searcRecord.lng = lnglatArr[0];
							searcRecord.lat = lnglatArr[1];
							var marker = InfoWindow(searcRecord);
							zoomArr.push(lnglat);
							var ul = document.getElementById("uls");
							var li = document.createElement("li");
							ul.appendChild(li);
							li.classList.add("list-group-itemlist-group-item-actionactive");
							var a = document.createElement("a");
							li.appendChild(a);
							var img = document.createElement("img");
							var div1 = document.createElement("div");
							a.appendChild(div1);
							var span1 = document.createElement("span");
							var div2 = document.createElement("div");
							a.appendChild(div2);
							var div3 = document.createElement("div");
							a.appendChild(div3);
							div1.classList.add("div1");
							div2.classList.add("div2");
							div3.classList.add("div3");
							span1.classList.add("span1");
							img.src = "images/arrowlist.png";
							div1.appendChild(img);
							div1.appendChild(span1);
							div1.href = "javascript://";
							span1.innerHTML = name;
							a.style.textDecoration = "none";
							div2.innerHTML = "街镇：" + Street;
							div3.innerHTML = "地址：" + address;
							document.getElementById("resultDiv").style.display = "block";
							$(li).on('click', function() {
								removeOverLay();
								var marker = InfoWindow(searcRecord);
							});
							a.appendChild(document.createElement("br"))
						})
					})(i)
				}
				map.setViewport(zoomArr);
				document.getElementById("searchDiv").appendChild(divMarker);
				document.getElementById("resultDiv").style.display = "block"
			}
		}


		function removeOverLay() {
			var lays = map.getOverlays();
			for (var i = lays.length - 1; i > 0; i--) {
				if (lays[i].Type = 1000) {
					map.removeOverLay(lays[i])
				}
			}
		}

		function remarker(searcRecord) {
			var flag = true;
			removeOverLay();
			map.addEventListener("click", function(e) {
				if (flag) {
					flag = false;
					var newlnglat = e.lnglat;
					// var marker = new T.Marker(e.lnglat);

					$.getJSON(dataroot, function(data) {
						var Street = '' || '暂无数据';
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
							var pt = turf.point = ([e.lnglat.lng, e.lnglat.lat]);
							var poly = turf.polygon([polygon1]);
							if (turf.booleanPointInPolygon(pt, poly)) {
								Street = arr[i].properties.JZNAME
							}
							if (polygon2.length !== 0) {
								var poly2 = turf.polygon([polygon2]);
								if (turf.booleanPointInPolygon(pt, poly2)) {
									Street = arr[i].properties.JZNAME
								}
							}
						}
						searcRecord.lat = newlnglat.lat;
						searcRecord.lng = newlnglat.lng;
						searcRecord.street = Street;
						InfoWindow(searcRecord);

					})
				}
			})
		}


		function dataURLtoFile(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new File([u8arr], filename, {
				type: mime
			})
		};
	});
