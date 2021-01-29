define('basetmap', ['jquery', 'tmap', 'd3', 'd3SvgOverlay', 'leaflet', 'leaflet-tilelayer-wmts-src'],
	function($) {


		var baseTmap = function() {

			this.tmap;
			//默认滨海新区范围
			this.center = new T.LngLat(117.654173, 39.032846);
			this.zoom = 10;
			this.bhjson = 'data/BinhaiNewDistrict.json';
		};
		//天地图初始化
		baseTmap.prototype.initialize = function(div) {
			this.tmap = new T.Map(div, {
				datasourcesControl: true
			});
			this.tmap.centerAndZoom(this.center, this.zoom);
			this.tmap.setViewport(this.center);
			return this.tmap;
		}
		//放大缩小控件 （参数leftTOP、rightTOP、leftBOTTOM、rightBOTTOM）
		baseTmap.prototype.zoomControl = function(controlPositionStr) {
			//创建缩放平移控件对象
			control = new T.Control.Zoom();
			//添加缩放平移控件
			this.tmap.addControl(control);
			var controlPosition;
			if (controlPositionStr == "leftTOP")
				controlPosition = T_ANCHOR_TOP_LEFT;
			else if (controlPositionStr == "rightTOP")
				controlPosition = T_ANCHOR_TOP_RIGHT;
			else if (controlPositionStr == "leftBOTTOM")
				controlPosition = T_ANCHOR_BOTTOM_LEFT;
			else if (controlPositionStr == "rightBOTTOM")
				controlPosition = T_ANCHOR_BOTTOM_RIGHT;
			control.setPosition(controlPosition);
		};
		//比例尺控件
		baseTmap.prototype.scaleControl = function() {
			//创建比例尺控件对象
			var scale = new T.Control.Scale();
			//添加比例尺控件
			this.tmap.addControl(scale);
		};
		//鹰眼控件
		baseTmap.prototype.overviewMapControl = function() {
			var miniMap = new T.Control.OverviewMap({
				isOpen: true,
				size: new T.Point(150, 150)
			});
			this.tmap.addControl(miniMap);
		};
		//地图，卫星图切换
		baseTmap.prototype.mapTypeControl = function(type) {
			//创建对象
			// var mapTypes = [{
			// 		title: '地图', //地图控件上所要显示的图层名称
			// 		icon: 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png', //地图控件上所要显示的图层图标（默认图标大小80x80）
			// 		layer: TMAP_NORMAL_MAP //地图类型对象，即MapType。
			// 	},
			// 	{
			// 		title: '卫星',
			// 		icon: ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png',
			// 		layer: TMAP_SATELLITE_MAP
			// 	}
			// ];
			// var ctrl = new T.Control.MapType(mapTypes);
			if (type == 1) {
				//移动图层
				this.tmap.removeControl(TMAP_NORMAL_MAP);
				this.tmap.removeControl(TMAP_SATELLITE_MAP);
				//添加控件
				this.tmap.addControl(TMAP_SATELLITE_MAP);
			}
			if (type == 2) {
				//移动图层
				this.tmap.removeControl(TMAP_NORMAL_MAP);
				this.tmap.removeControl(TMAP_SATELLITE_MAP);
				//添加控件
				this.tmap.addControl(TMAP_NORMAL_MAP);
			}
		}
		
		baseTmap.prototype.BHGeoJson = function() {
			
			this.d3GeoJson(this.bhjson, {
				fillColor: '#fcff00',
				line: 'stroke',
				lineColor: '#ffffff'
			}, function(sel, transform) {
				sel.selectAll('path.geojson').each(function(d, i) {
					d3.select(this).attr('d', transform.pathFromGeojson)
					//console.log(d);
				})
			});
		}
		
		
		//D3加载geojson文件
		//color 填充颜色 例#e2f418
		//redraw 回调函数
		baseTmap.prototype.d3GeoJson = function(geojson, style, redraw) {
			var tmap = this.tmap;
			var countries = [];
			d3.json(geojson, function(data) {
				countries = data.features;

				var countriesOverlay = new T.D3Overlay(init, redraw);
				//var hsl = this.rgbToHSL(231, 23, 165);
				function init(sel, transform) {
					var upd = sel.selectAll('path.geojson').data(countries);
					if (style == undefined || style.line == undefined) {
						style.line = 'stroke';
					}
					if (style == undefined || style.lineColor == undefined) {
						style.lineColor = '#ff0000';
					}
					if (style == undefined || style.fillColor == undefined) {
						style.fillColor = '#18f432';
					}
					upd.enter().append('path').attr("class", "geojson").attr(style.line, style.lineColor).attr('fill', function(d,
						i) {
						//var color = Math.random() * 360;
						//console.log(color);
						//色相、饱和度、亮度
						//return d3.hsl(style, 1, 0.5)
						return d3.rgb(style.fillColor);
					}).attr('fill-opacity', '0.5')
				}
				if (typeof redraw === "function") {
					redraw;
				}

				tmap.addOverLay(countriesOverlay);
				//countriesOverlay.bringToBack()；
				countriesOverlay.bringToFront();
				//console.log(countriesOverlay);
				//countriesOverlay.hide();

			});

		}

		//加载geojson实现聚合 markerCallback回调函数 默认聚合
		baseTmap.prototype.d3MarkerClusterer = function(geojson, markerCallback, marge) {
			var self = this;
			d3.json(geojson, function(data) {

				var markers = self.getMarker(data, markerCallback);
				//开启聚合
				if (marge == undefined || marge == '') {
					var markerClusterer = new T.MarkerClusterer(self.tmap, {
						markers: markers
					});
				} else {
					for (var marker in markers) {
						var p = markers[marker]
						self.tmap.addOverLay(p);
					}

				}
			})
		}




		//解析featuresCollection获取标注 markerCallback回调函数
		baseTmap.prototype.getMarker = function(featuresCollection, markerCallback) {

			var features = featuresCollection.features;
			var markers = [];
			for (var i = 0; i < features.length; i++) {
				if (features[i].geometry.type == "Point") {
					var jg = {};
					jg.id = features[i].properties.ID;
					jg.jgmc = features[i].properties.JGMC;
					jg.lxfs = features[i].properties.LXFS;
					jg.fwfw = features[i].properties.FWFW;
					jg.dz = features[i].properties.DZ;
					jg.lng = features[i].geometry.coordinates[0];
					jg.lat = features[i].geometry.coordinates[1];
					// //向地图上添加自定义标注
					var icon = new T.Icon({
						iconUrl: "images/marker-icon.png",
						iconSize: new T.Point(6, 10),
						iconAnchor: new T.Point(6, 10)
					});
					var marker = new T.Marker(new T.LngLat(jg.lng, jg.lat), {
						icon: icon
					});
					marker.data = jg; //取值e.target.data
					markers.push(marker);
					marker.addEventListener('click', markerCallback);
				}
			}
			return markers;

		}


		//解析featuresCollection
		//layerName自定义图层名称
		//style标注图标样式或范围颜色
		baseTmap.prototype.getLayerGroup = function(featuresCollection, layerName, style) {
			var self = this;
			var features = featuresCollection.features;
			var myArr = [];
			for (var i = 0; i < features.length; i++) {
				var jg = {};
				if (features[i].geometry.type == "Point") {
					jg.id = features[i].properties.ID;
					jg.jgmc = features[i].properties.JGMC;
					jg.jgjs = features[i].properties.JGJS;
					jg.bgjs = features[i].properties.BGSJ;
					jg.lxfs = features[i].properties.LXFS;
					jg.fwfw = features[i].properties.FWFW;
					jg.dz = features[i].properties.DZ;
					jg.lng = features[i].geometry.coordinates[0];
					jg.lat = features[i].geometry.coordinates[1];
					//向地图上添加自定义标注
					var icon = new T.Icon(
						style //{iconUrl: "images/marker-icon.png",iconSize: new T.Point(6, 10),iconAnchor: new T.Point(6, 10)}
					);
					var marker = new T.Marker(new T.LngLat(jg.lng, jg.lat), {
						icon: icon
					});
					self.tmap.addOverLay(marker);
					marker.type = 'Point';
					marker.data = jg; //取值e.target.data
					marker.layName = layerName; //图层名字
					myArr.push(marker);
				}
				if (features[i].geometry.type == "Polygon") {
					//data[i].geometry.coordinates.length == 1
					var points = [];
					if (features[i].geometry.coordinates.length == 1) {
						jg.id = features[i].properties.ID;
						jg.jgid = features[i].properties.JGID;
						jg.jgmc = features[i].properties.JGMC;
						jg.gnqname = features[i].properties.GNQNAME;
						jg.jzname = features[i].properties.JZNAME
						jg.comid = features[i].properties.ComId
						jg.streetid = features[i].properties.StreetId
						jg.comname = features[i].properties.ComNAME
						for (var j = 0; j < features[i].geometry.coordinates[0].length; j++) {
							points.push(new T.LngLat(features[i].geometry.coordinates[0][j][0], features[i].geometry.coordinates[
								0][j][1]));
						}
					} else {
						for (var k = 0; k < features[i].geometry.coordinates.length; k++) {
							for (var j = 0; j < features[i].geometry.coordinates[k][0].length; j++) {
								points.push(new T.LngLat(features[i].geometry.coordinates[k][0][j][0], features[i].geometry.coordinates[
									k][0][j][1]));
							};
						}
					}
					var polygon = new T.Polygon(points,
						style //{color: "blue", weight: 1, opacity: 0.5, fillColor: "#FFFFFF", fillOpacity: 0.5}
					);
					polygon.type = 'Polygon';
					polygon.data = jg;
					polygon.layName = layerName; //图层名字
					self.tmap.addOverLay(polygon);

					myArr.push(polygon);
				}
			}
			// if (myArr.length>0 && myArr[0].type=="Point") {
			// 	var markerClusterer = new T.MarkerClusterer(self.tmap, {
			// 		markers: myArr
			// 	});
			// }
			return myArr;
		}


		//返回延迟对象
		baseTmap.prototype.getGeoJson= function(json) {
			var def = $.Deferred();
			$.getJSON(json, function(data) {
				//成功
				def.resolve(data);
			})
			return def.promise();
		}

		//leaflet加载geojson
		baseTmap.prototype.leafGeoJson = function(json, style) {
			var def = $.Deferred();
			$.getJSON(json, function(data) {

				if (style == undefined) {
					style = {
						radius: 8,
						fillColor: "#faf5ab", //填充
						color: "#f8382f", //边框
						weight: 1,
						opacity: 0.9,
						fillOpacity: 0.6
					};
				}
				var layerGeo = L.geoJSON(data.features, {
					style: style,
					//自定义过滤条件
					filter: function(feature, layer) {
						//return feature.properties.show_on_map;
						return true;
					},
					// pointToLayer: function(feature, latlng) {
					// 	return L.circleMarker(latlng);
					// },
					onEachFeature: function(feature, layer) {
						// does this feature have a property named popupContent?
						if (feature.properties && feature.properties.JGMC) {
							layer.bindPopup(feature.properties.JGMC);
						}
					}
				});
				//成功
				def.resolve(layerGeo);
			})
			return def.promise();
		}

		//标注添加弹出信息事件
		//marker需要有机构坐标信息
		baseTmap.prototype.openInfoWindow = function(marker) {

			marker.addEventListener("click", function(e) {
				var info = new T.InfoWindow(new T.LngLat(e.target.data.lng, e.target.data.lat));
				//设置信息窗口要显示的内容
				info.setContent(e.target.data.jgmc);
				e.target.openInfoWindow(info);
			});
		}

		return {
			baseTmap: new baseTmap()
		};
	})
