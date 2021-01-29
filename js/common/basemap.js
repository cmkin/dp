/***
 * 地图基类
 */
var BaseMap = function(config) {

	this.map;
	if (config == undefined) config = {};
	var c = config;
	//基础路径
	this.basePath = c.basePath || '';
	//初始化内部默认属性
	this._initDefaultProps();
	/*****参数及参数解析*******/
	//宽度
	//this.width = c.width || 800;
	//高度
	this.height = c.height || 600;
	//地图面板id
	this.mapId = c.mapId || 'mapDiv';
	//投影方式
	this.projection = c.projection || 'EPSG:4326';
	//放大级别
	this.zoom = c.zoom || 12;
	//地图中心经度
	this.mapCenterLng = c.mapCenterLng || 117.704463;
	//地图中心纬度
	this.mapCenterLat = c.mapCenterLat || 39.00262;
	//地图搜索范围
	this.mapRadius = c.mapRadius || 10000;

	//定位
	this.isGeolocation = (c.isGeolocation == undefined) ? true : (c.isGeolocation ? true : false);
	//地图图层
	this.isShowMapTileLayer = (c.isShowMapTileLayer == undefined) ? true : (c.isShowMapTileLayer ? true : false);

	//默认地图类型（矢量地图1=TMAP_NORMAL_MAP、卫星2=TMAP_SATELLITE_MAP、混合3=TMAP_HYBRID_MAP）
	this.mapType = c.mapType || 1;
	//是否显示地图类型切换按钮
	this.isShowMapTypeBtn = (c.isShowMapTypeBtn == undefined) ? true : (c.isShowMapTypeBtn ? true : false);
	//放大缩小
	this.isControl = (c.isControl == undefined) ? true : (c.isControl ? true : false);

	//鹰眼配置(anchor、size、isOpen)
	this.isMiniMap = (c.isMiniMap == undefined) ? true : (c.isMiniMap ? true : false);
	//是否显示比例尺（默认true）
	this.isScale = (c.isScale == undefined) ? true : (c.isScale ? true : false);
	//是否显示缩放平移控件（在没有传递isNavBtn的情况下，如果传递了navBtnCfg则未true），默认false
	this.isNavBtn = c.isNavBtn == undefined ? ((c.navBtnCfg && true) ? true : false) : (c.isNavBtn ? true : false);
	//缩放平移控件配置
	this.navBtnCfg = c.navBtnCfg || this.defaultNavBtnCfg;
	//默认标注点
	this.defaultMarkerPoints = c.defaultMarkerPoints || null;
	//经度key
	this.markerPointLngKey = c.markerPointLngKey || 'lng';
	//纬度key
	this.markerPointLatKey = c.markerPointLatKey || 'lat';
	//标注点图标key
	this.markerPointIconKey = c.markerPointIconKey || 'icon';
	//默认图标
	this.markerPointIcon = c.markerPointIcon || this.defaultMarkerPointIcon;
	this.markerPointToolIcon = c.markerPointToolIcon || this.defaultMarkerPointToolIcon;
	//标注点提示框标题
	this.markerPointMsgBoxTitle = c.markerPointMsgBoxTitle || '';
	//面提示框标题
	this.polygonMsgBoxTitle = c.polygonMsgBoxTitle || '';
	//面标注参数配置
	this.polygonCfg = c.polygonCfg || this.defaultPolygonCfg;
	//默认面标注点
	this.defaultPolygonPoints = c.defaultPolygonPoints || null;
	//与面标注点（defaultPolygonPoints）对应，要么是一个object（所有面标注共用数据），
	//要么是一个数组（与defaultPolygonPoints索引对应数据）
	this.polygonPointDatas = c.polygonPointDatas || null;

	/*******内部数据********/
	this.data = {};
	//标注点
	this.data.markers = [];
	//面标注区域
	this.data.polygons = [];
	//搜索功能区ID
	this.data.searchBtnsId = [];
	//导航功能区ID
	this.data.navigationId = [];

	//面标注工具标注后的数据存储
	this.data.polygonToolDrawData = null;

	//当前点标注工具标注点的数据存储
	this.data.markerToolPointData = null;


	/*******方法回调********/
	//获取标注点的提示文字
	this.getPointAltText = c.getPointAltText || null;

	/*******事件处理********/
	//当标注点加载后触发，参数：point , marker
	this.onMarkerPointAdded = c.onMarkerPointAdded || null;
	this.onMarkerPointClick = c.onMarkerPointClick || null;

	//如果没有处理标注点单击事件，是否允许默认事件处理
	this.isAllowDefaultPointClickHandle = (c.isAllowDefaultClickHandle == undefined) ? true : (c.isAllowDefaultClickHandle ?
		true : false);

	//当面标注区域加载后触发，参数：points , polygon
	this.onPolygonPointsAdded = c.onPolygonPointsAdded || null;
	this.onPolygonPointsClick = c.onPolygonPointsClick || null;

	//如果没有处理面单击事件，是否允许默认事件处理
	this.isAllowDefaultPolygonClickHandle = (c.isAllowDefaultPolygonClickHandle == undefined) ? true : (c.isAllowDefaultPolygonClickHandle ?
		true : false);

	//当面标注完成后触发
	this.onDrawPolygonComplete = c.onDrawPolygonComplete || null;

	//执行初始化
	this.map = this.initialize();
	return this;
};

//初始化内部默认属性
BaseMap.prototype._initDefaultProps = function() {
	/*******内部默认属性********/
	//比例尺控件对象
	this.scale = null;
	//放大缩小工具
	this.control = null;
	//缩放平移控件对象 
	this.navBtnControl = null;

	//鹰眼
	this.miniMap = null;

	//面标注工具
	this.polygonTool = null;

	//点标注工具
	this.markerTool = null;
	//当前点标注工具标注的点
	this.currentMarkerPoint = null;

	//缩放平移控件默认配置
	this.defaultNavBtnCfg = {
		//缩放平移的显示类型 
		type: "TMAP_NAVIGATION_CONTROL_LARGE",
		//缩放平移控件显示的位置
		anchor: "TMAP_ANCHOR_TOP_LEFT",
		//缩放平移控件的偏移值 
		offset: [0, 0],
		showZoomInfo: true
	};

	//默认面标注配置
	this.defaultPolygonCfg = {
		//边线颜色
		strokeColor: '#F16C78',
		//填充颜色。当参数为空时，多边形覆盖物将没有填充效果
		fillColor: '#F4C3C3',
		//边线的宽度，以像素为单位
		strokeWeight: 4,
		//边线透明度，取值范围0 - 1
		strokeOpacity: 0.8,
		//填充的透明度，取值范围0 - 1
		fillOpacity: 0.3,
		//边线的样式，solid或dashed
		strokeStyle: 'solid',
		//是否显示面积，如果不显示面积，则可以作为画面控件使用，默认值为true
		showLabel: true
	};

	//默认标注点图标
	this.defaultMarkerPointIcon = this.getIcon('marker05', '');

	//默认标注工具图标
	this.defaultMarkerPointToolIcon = this.getIcon('marker05', '');
};

/**获取images/markers目录下的图标**/
BaseMap.prototype.getIcon = function(name, size) {
	//if (!size) size = 24;
	//return new T.Icon(this.basePath + '/images/markers/' + name + '_' + size + '.png', new TSize(size, size));
	var icon = new T.Icon({
		iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
		iconSize: new T.Point(19, 27),
		iconAnchor: new T.Point(10, 25)
	});
	return icon;

};
//获取图标
BaseMap.prototype.getIconByUrl = function(url, size) {
	if (!size) {
		size = 24;
	}
	if (url.indexOf('http') == 0) {
		return new T.Icon(url, new TSize(size, size));
	}
	return new T.Icon(this.basePath + url, new TSize(size, size));
};

//地图初始化
BaseMap.prototype.initialize = function() {
	var me = this;

	//设置地图大小
	document.getElementById(me.mapId).style.height = me.height + "px";
	me.map = new T.Map(me.mapId, me.projection);
	//设置中心点
	me.map.centerAndZoom(new T.LngLat(me.mapCenterLng, me.mapCenterLat), me.zoom);
	//生成图层工具
	if (me.isShowMapTileLayer) {
		me.isShowMapTileLayer = new T.Control({
			position: T_ANCHOR_TOP_RIGHT,
		});
		me.isShowMapTileLayer.onAdd = function(me) {
			var container = document.createElement("div");
			var zicsstext =
				"height:42pt;width:42pt;border-radius:6pt;background:#FFF;top:94pt";
			this.zoomInButton = createButton('img', container, zicsstext);
			// this.zoomInButton.onclick = zoomIn;
			return container;
		};
		me.map.addControl(me.isShowMapTileLayer);

		function createButton(className, container, csstext) {
			var link = document.createElement("img");
			if (container) {
				container.appendChild(link);
			}
			container.style.cssText = csstext;
			link.src = "../../images/cad.png"
			link.style.cssText = "height:32pt;width:32pt;margin-left: 5pt;margin-top: 5pt;";
			return link;
		};
	}
	//生成定位工具
	if (me.isGeolocation) {
		me.isGeolocation = new T.Control({
			position: T_ANCHOR_BOTTOM_LEFT
		});
		me.isGeolocation.onAdd = function() {
			var container = document.createElement("div");
			var zicsstext =
				"height:42pt;width:42pt;border-radius:6pt;background:#FFF";
			this.zoomInButton = createButton('img', container, zicsstext);
			this.zoomInButton.addEventListener("tap", function() {
				me.map.clearOverLays();
				var startlng = localStorage.getItem("startlng");
				var lnglat = startlng.split(" ");
				me.map.centerAndZoom(new T.LngLat(lnglat[0], lnglat[1]), 13);
				var marker = new T.Marker(new T.LngLat(lnglat[0], lnglat[1]));
				me.map.addOverLay(marker);
			})
			return container;
		};
		me.map.addControl(me.isGeolocation);

		function createButton(className, container, csstext) {
			var link = document.createElement("img");
			if (container) {
				container.appendChild(link);
			}
			container.style.cssText = csstext;
			link.src = "../../images/geolocation.png"
			link.style.cssText = "height:26pt;width:26pt;margin-left: 8pt;margin-top: 8pt;";
			return link;
		};
	}
	//生成缩放工具
	if (me.isControl) {
		me.control = new T.Control.Zoom();
		//添加缩放平移控件
		me.control.setPosition('bottomright');
		me.map.addControl(me.control);
	}
	// 鹰眼
	if (me.isMiniMap) {

		me.miniMap = new T.Control.OverviewMap({
			isOpen: true,
			size: new T.Point(50, 50)
		});
		me.map.addControl(me.miniMap);
	}
	//比例尺
	if (me.isScale) {
		//创建比例尺控件对象
		me.scale = new T.Control.Scale();
		//添加比例尺控件
		me.map.addControl(me.scale);
	}
	// 地图类型
	if (me.mapType) {
		if (me.mapType === 2) {
			me.map.setMapType(TMAP_SATELLITE_MAP);
		} else if (me.mapType === 3) {
			me.map.setMapType(TMAP_HYBRID_MAP);
		} else {
			//默认矢量地图
			me.map.setMapType(TMAP_NORMAL_MAP);
		}
	}

	//地图类型按钮
	if (me.isShowMapTypeBtn) {
		me.map.addControl(new T.Control.MapType({
			mapTypes: [TMAP_NORMAL_MAP, TMAP_SATELLITE_MAP, TMAP_HYBRID_MAP]
		}));
	}

	//加载默认标注点
	if (me.defaultMarkerPoints) {
		me.addMarkerPoints(me.defaultMarkerPoints, null);
	}

	//加载默认面标注
	if (me.defaultPolygonPoints) {
		me.addPolygonPoints(me.defaultPolygonPoints, null);
	}
	return me.map;
};

//生成ID
BaseMap.prototype._genDomID = function(type) {
	__map_gen_dom_idx++;
	return "_basemap_gen_" + (type || '') + __map_gen_dom_idx;
};

//清除标注点
BaseMap.prototype.clearMarkerPoints = function() {
	var me = this;
	if (me.data.markers && me.data.markers.length) {
		for (var i in me.data.markers) {
			me.map.removeOverLay(me.data.markers[i]);
		}
		me.data.markers.length = 0;
	}
	me.data.markers = [];
};

//添加标注点
//cfg = {centerLng:'',centerLat:'',zoom:12,isClear:false} 
//配置包含中心点经纬度，地图放大级别，是否清除已有的标注点
BaseMap.prototype.addMarkerPoints = function(points, cfg) {
	var me = this;
	if (cfg && cfg.isClear) {
		me.clearMarkerPoints();
	}

	if (points) {
		if (!me.data.markers) {
			me.data.markers = [];
		}
		if (points.length) {
			for (var i = 0; i < points.length; i++) {
				var p = points[i];
				var marker = new T.Marker(new T.LngLat(p[me.markerPointLngKey], p[me.markerPointLatKey]));
				var markerIcon = me.markerPointIcon;
				if (p[me.markerPointIconKey]) {
					markerIcon = me.getIconByUrl(p[me.markerPointIconKey]);
				}
				marker.setIcon(markerIcon);
				var altText = null;
				if (me.getPointAltText) {
					altText = me.getPointAltText.call(me, p, marker);
				}
				if (altText) {

					var markerInfoWin = new T.InfoWindow(altText);
					marker.addEventListener("click", function() {
						marker.openInfoWindow(markerInfoWin);
					}); // 将标注添加到地图中
				}
				// var clickEventHandler = null;
				// if (me.onMarkerPointClick) {
				// 	clickEventHandler = me.onMarkerPointClick;
				// } else if (me.isAllowDefaultPointClickHandle) {
				// 	clickEventHandler = me.defaultPointClickHandler;
				// }
				// if (clickEventHandler) {
				// 	(function(me, p, marker) {
				// 		TEvent.addListener(marker, "click", function() {
				// 			clickEventHandler.call(me, p, marker, this);
				// 		});
				// 	})(me, p, marker);
				// }
				me.map.addOverLay(marker);
				me.data.markers.push(marker);
				if (me.onMarkerPointAdded) {
					(function(me, p, marker) {
						me.onMarkerPointAdded.call(me, p, marker);
					})(me, p, marker);
				}
			}
		} else {
			var p = points;
			var marker = new T.Marker(new T.LngLat(p[me.markerPointLngKey], p[me.markerPointLatKey]));
			var markerIcon = me.markerPointIcon;
			if (p[me.markerPointIconKey]) {
				markerIcon = me.getIconByUrl(p[me.markerPointIconKey]);
			}
			marker.setIcon(markerIcon);
			var altText = null;
			if (me.getPointAltText) {
				altText = me.getPointAltText.call(me, p, marker);
			}
			if (altText) {
				marker.setTitle(altText);
			}
			var clickEventHandler = null;
			if (me.onMarkerPointClick) {
				clickEventHandler = me.onMarkerPointClick;
			} else if (me.isAllowDefaultPointClickHandle) {
				clickEventHandler = me.defaultPointClickHandler;
			}
			if (clickEventHandler) {
				(function(me, p, marker) {
					TEvent.addListener(marker, "click", function() {
						clickEventHandler.call(me, p, marker, this);
					});
				})(me, p, marker);
			}
			me.map.addOverLay(marker);
			me.data.markers.push(marker);
			if (me.onMarkerPointAdded) {
				(function(me, p, marker) {
					me.onMarkerPointAdded.call(me, p, marker);
				})(me, p, marker);
			}
		}
	}

	//解析配置
	if (cfg) {
		if (cfg.centerLng != undefined && cfg.centerLat != undefined) {
			me.map.centerAndZoom(new T.LngLat(cfg.centerLng, cfg.centerLat), cfg.zoom || me.zoom);
		}
	}
};

//清除标注点
BaseMap.prototype.clearPolygonPoints = function() {
	var me = this;
	if (me.data.polygons && me.data.polygons.length) {
		for (var i in me.data.polygons) {
			me.map.removeOverLay(me.data.polygons[i]);
		}
		me.data.polygons.length = 0;
	}
	me.data.polygons = [];
};


//添加标注面
//polygonPointStrs 一个字符串或字符串数组
//一个字符串代表一个多边形，字符串中包含多个经纬度，多个经纬度组合用竖线(|)分隔，经度、纬度之间用逗号(,)分隔
//cfg = {centerLng:'',centerLat:'',zoom:12,isClear:false} 
//配置包含中心点经纬度，地图放大级别，是否清除已有的面标注点
BaseMap.prototype.addPolygonPoints = function(polygonPointStrs, cfg) {
	var me = this;
	if (cfg && cfg.isClear) {
		me.clearPolygonPoints();
	}

	if (polygonPointStrs) {
		var p = null,
			polygon = null;
		if (!me.data.polygons) {
			me.data.polygons = [];
		}
		if (typeof polygonPointStrs == 'string') {
			//单个面标注数据
			if (typeof me.polygonPointDatas == 'string') {
				me._addPolygon(polygonPointStrs, me.polygonPointDatas);
			} else if (me.polygonPointDatas && me.polygonPointDatas.length) {
				me._addPolygon(polygonPointStrs, me.polygonPointDatas[0] || null);
			} else {
				me._addPolygon(polygonPointStrs, me.polygonPointDatas || null);
			}
		} else {
			//多个面标注数据
			for (var i in polygonPointStrs) {
				if (typeof me.polygonPointDatas == 'string') {
					me._addPolygon(polygonPointStrs[i], me.polygonPointDatas);
				} else if (me.polygonPointDatas && me.polygonPointDatas.length) {
					me._addPolygon(polygonPointStrs[i], me.polygonPointDatas[i] || null);
				} else {
					me._addPolygon(polygonPointStrs[i], me.polygonPointDatas || null);
				}
			}
		}
	}

	//解析配置
	if (cfg) {
		if (cfg.centerLng != undefined && cfg.centerLat != undefined) {
			me.map.centerAndZoom(new T.LngLat(cfg.centerLng, cfg.centerLat), cfg.zoom || me.zoom);
		}
	}
};

//添加面标注（私有方法）
BaseMap.prototype._addPolygon = function(polygonPointStr, polygonPointData) {
	var me = this;
	var items = polygonPointStr.split("|");
	if (items && items.length) {
		var lngLatStr = null,
			lngLat = null;
		var polygon = null,
			points = [];
		for (var i in items) {
			lngLatStr = items[i];
			if (lngLatStr == null || '' == lngLatStr) {
				continue;
			}
			lngLat = lngLatStr.split(",");
			points.push(new T.LngLat(lngLat[0], lngLat[1]));
		}
		//面标注至少3个点
		if (points.length >= 3) {
			// polygon = new TPolygon(points, me.polygonCfg);
			// var clickEventHandler = null;
			// if (me.onPolygonPointsClick) {
			// 	clickEventHandler = me.onPolygonPointsClick;
			// } else if (me.isAllowDefaultPolygonClickHandle) {
			// 	clickEventHandler = me.defaultPolygonClickHandler;
			// }
			// if (clickEventHandler) {
			// 	(function(me, points, polygonPointData, polygon) {
			// 		TEvent.addListener(polygon, "click", function(eventPixel) {
			// 			clickEventHandler.call(me, points, polygonPointData, polygon, eventPixel, this);
			// 		});
			// 	})(me, points, polygonPointData, polygon);
			// }

			// me.map.addOverLay(polygon);
			// me.data.polygons.push(polygon);

			// if (me.onPolygonPointsAdded) {
			// 	(function(me, points, polygonPointData, polygon) {
			// 		me.onPolygonPointsAdded.call(me, points, polygonPointData, polygon);
			// 	})(me, points, polygonPointData, polygon);
			// }
		}
	}
};

//标注点单击事件默认处理方法，弹出提示框
BaseMap.prototype.defaultPointClickHandler = function(point, marker, event) {
	var me = this;
	var config = {
		offset: new TPixel(-125, 90),
		position: new T.LngLat(marker.getLngLat().lng, marker.getLngLat().lat)
	};
	me.showMsgBox((me.markerPointMsgBoxTitle || ''), point && point.msgDatas, config, 320, 155);
};

//面单击事件默认处理方法，弹出提示框
BaseMap.prototype.defaultPolygonClickHandler = function(points, polygonPointData, polygon, pixel, event) {
	var me = this;
	var bounds = polygon.getBounds();
	var center = bounds.getCenter();
	var config = {
		offset: new TPixel(-130, 20),
		//position: new T.LngLat(points[0].getLng(), points[0].getLat())
		position: new T.LngLat(center.getLng(), center.getLat())
	};
	me.showMsgBox((me.polygonMsgBoxTitle || ''), polygonPointData, config, 320, 155);
};

//弹出提示
BaseMap.prototype.showMsgBox = function(title, msgDatas, cfg, width, height) {
	var me = this;
	var contentWidth = width - 20;
	if (contentWidth < 220) {
		contentWidth = 220;
	}
	var contentHeight = height - 55;
	if (contentHeight < 50) {
		contentHeight = 50;
	}
	var html = [];
	var msgLabelId = me._genDomID('alt_msg_label');
	html.push('<div id="' + msgLabelId + '" style="width:' + width + 'px;">');
	html.push('<div style="margin:4px 10px 3px 10px;height:18px;"><b><span style="color:#333333;font-size:14px;">' +
		(title || '') + '</span><span  style="float:right;width:12px;height:12px;background:url(\'' +
		me.basePath +
		'/images/btn_close.jpg\') no-repeat 0px 0px;cursor:pointer;" title="关闭" class="close_btn"></span></b></div>');
	html.push('<hr style="height: 2px;padding:0px;margin:0px 3px; background-color: #484848;">');
	html.push('<div style="margin:10px;height:' + contentHeight + 'px;overflow:auto;">');
	html.push('<table width="' + contentWidth + '" border="0" style="font-size:12px;">');
	if (typeof msgDatas == 'string') {
		html.push('<tr><td align="left">' + msgDatas + '</td></tr>');
	} else {
		if (msgDatas && msgDatas.length) {
			for (var i in msgDatas) {
				if (typeof msgDatas[i] == 'string') {
					html.push('<tr><td align="left" colspan="2">' + msgDatas[i] + '</td></tr>');
				} else {
					html.push('<tr><td class="key" width="60" align="left" style="font-weight:bold;">' + (msgDatas[i]['text'] || ''));
					html.push('</td><td class="value" align="left">' + (msgDatas[i]['content'] || '') + '</td></tr>');
				}
			}
		}
	}
	html.push('</table>');
	html.push('</div>');
	html.push('</div>');

	var altMsgLabel = new TLabel(cfg);
	altMsgLabel.setTitle(title || '');
	altMsgLabel.setLabel(html.join(''));
	altMsgLabel.setBorderColor('#B3B3B3');
	me.map.addOverLay(altMsgLabel);

	//绑定关闭图层事件
	$('#' + msgLabelId + ' .close_btn').delegate('', 'click', function() {
		me.map.removeOverLay(altMsgLabel);
	});
};

//开启面标注工具
BaseMap.prototype.openPolygonTool = function(polygonCfg) {
	var me = this;
	if (!me.map) {
		return;
	}
	if (!me.polygonTool) {
		//清除数据
		me.data.polygonToolDrawData = null;
		me.polygonTool = new TPolygonTool(me.map, polygonCfg || me.polygonCfg);
		//注册测面工具绘制完成后的事件 
		//参数说明： 
		//points：用户最后绘制的折线的点坐标数组。 
		//length：用户最后绘制的折线的地理长度。
		//polyline：当前测距所画线的对象。
		TEvent.addListener(this.polygonTool, "draw", function(points, length, polyline) {
			//数据存储
			me.data.polygonToolDrawData = {
				//坐标点数组
				'points': points,
				//总面积（单位：平方米）
				'area': length,
				//坐标点总距离
				'totalDistance': me.polygonTool.getDistance(points)
			};

			//关闭面标注工具
			me.closePolygonTool();

			//回调事件
			if (me.onDrawPolygonComplete) {
				me.onDrawPolygonComplete.call(me, points, length, polyline, this);
			}
		});
	}
	me.polygonTool.open();
};

//关闭面标注工具
BaseMap.prototype.closePolygonTool = function() {
	var me = this;
	if (me.polygonTool) {
		me.polygonTool.close();
	}
};

//获取面标注数据
BaseMap.prototype.getPolygonToolDrawData = function() {
	return this.data.polygonToolDrawData;
};

//获取面标注坐标串
BaseMap.prototype.getPolygonToolDrawPointStr = function() {
	if (this.data.polygonToolDrawData) {
		var points = this.data.polygonToolDrawData.points;
		var pointStrArr = [];
		if (points && points.length) {
			for (var i in points) {
				pointStrArr.push(points[i].getLng() + ',' + points[i].getLat());
			}
		}
		if (pointStrArr.length) {
			return pointStrArr.join('|');
		}
	}
	return '';
};


//开启点标注工具
BaseMap.prototype.openMarkerTool = function(markerIcon) {
	var me = this;
	if (!me.map) {
		return;
	}
	if (!me.markerTool) {
		me.data.markerToolPointData = null;
		me.markerTool = new TMarkTool(me.map);
		//注册标注的mouseup事件 
		TEvent.addListener(me.markerTool, "mouseup", function(point) {
			me.data.markerToolPointData = {
				'lng': point.getLng(),
				'lat': point.getLat()
			};

			me.currentMarkerPoint = new TMarker(point);
			me.currentMarkerPoint.setTitle('经纬度：' + point.getLng() + ',' + point.getLat());
			if (markerIcon) {
				me.currentMarkerPoint.setIcon(markerIcon);
			} else {
				me.currentMarkerPoint.setIcon(me.markerPointToolIcon);
			}
			me.map.addOverLay(me.currentMarkerPoint);
			me.currentMarkerPoint.enableEdit();
			TEvent.bind(me.currentMarkerPoint, "dragend", me.currentMarkerPoint, function(lngLat) {
				me.data.markerToolPointData = {
					'lng': lngLat.getLng(),
					'lat': lngLat.getLat()
				};
				me.currentMarkerPoint.setTitle('经纬度：' + lngLat.getLng() + ',' + lngLat.getLat());
			});
			me.markerTool.close();
		});
		me.markerTool.open();
	} else {
		if (this.currentMarkerPoint) {
			this.currentMarkerPoint.enableEdit();
		}
	}
};

//关闭点标注
BaseMap.prototype.closeMarkerTool = function(markerCfg) {
	if (this.currentMarkerPoint) {
		this.currentMarkerPoint.disableEdit();
	}
}

//获取点标注数据
BaseMap.prototype.getMarkerToolPointData = function() {
	return this.data.markerToolPointData;
};



/********************************************************************导航函数************************************************************/
//生成导航面板
BaseMap.prototype.showNavigation = function() {
	var me = this;
	me.data.navigationId.starBtnId = me._genDomID('starBtn');
	me.data.navigationId.endBtnId = me._genDomID('endBtn');
	me.data.navigationId.searchBtnId = me._genDomID('searchBtnId');
	me.data.navigationId.resultDiv = me._genDomID('resultDivNavigation');
	me.data.navigationId.start = me._genDomID('start');
	me.data.navigationId.end = me._genDomID('end');
	me.data.navigationId.endTips = me._genDomID('endTips');
	var searchDivId = me._genDomID('searchDiv');

	var html = '';
	html += '<div id=' + searchDivId + ' style="background-color: RGB(237,244,255);height=500px;">';
	html += '<div style="font-size:13px; border:1px solid #999999; line-height:27px; padding-left:7px">';
	html += '<input type="radio" name="planType" value="0" checked="checked"/>最少时间';
	html += '<input type="radio" name="planType" value="1"/>最短距离';
	html += '<input type="radio" name="planType" value="2"/>避开高速';
	html += '<input type="radio" name="planType" value="3"/>步行';
	html += '<br/>';
	html += '起点：<input type="text" id="' + me.data.navigationId.start + '" value="" readonly="readonly"/>';
	html += '<input type="button" value="选择起点" id="' + me.data.navigationId.starBtnId + '" />';
	html += '<br/>';
	html += '终点：<input type="text" id="' + me.data.navigationId.endTips + '" value="" readonly="readonly"/>';
	html += '<input type="hidden" id="' + me.data.navigationId.end + '" value=""/>';
	html += '<input type="button" id=' + me.data.navigationId.endBtnId + ' value="终点"/>';
	html += '<br/>';
	html += '<input type="button" id=' + me.data.navigationId.searchBtnId + ' value="驾车路线搜索"/>';
	html += '</div>';
	html += '<br/>';
	html += '<div id="' + me.data.navigationId.resultDiv +
		'" style=" width:300px; overflow-y:scroll; border: solid 1px gray;"></div>';
	html += '</div>';

	var navigationPanelWidth = 310;
	var mapWidth = me.width - navigationPanelWidth - 20;
	me.containerId = me.mapId;
	me.mapId = me._genDomID('mapDiv');
	var navigationPanelId = me._genDomID('navigationPanel');
	var mapContainerDom = $('#' + me.containerId);
	mapContainerDom.css('width', me.width);
	mapContainerDom.css('height', me.height);
	mapContainerDom.layout();
	mapContainerDom.layout('add', {
		region: 'west',
		width: navigationPanelWidth,
		height: me.height,
		style: {
			zIndex: 100
		},
		title: '导航',
		content: '<div id="' + navigationPanelId + '"></div>',
		split: true,
		onCollapse: function() {
			me.map.checkResize();
		},
		onExpand: function() {
			me.map.checkResize();
		}
	});

	$('#' + navigationPanelId).append($(html));

	mapContainerDom.layout('add', {
		region: 'center',
		style: {
			zIndex: 98
		},
		content: '<div id="' + me.mapId + '" style="width:100%;height:100%;"></div>'
	});

	$('#' + searchDivId).height((me.height - 30));

};



//返回用户当前位置 参数mark:true地图上标注
BaseMap.prototype.getCurrentPosition = function(mark) {

	var dtd = $.Deferred();
	// console.log(dtd)
	var me = this;
	var lo = new T.Geolocation().getCurrentPosition(function(e) {
		var lnglat = e.lnglat;
		if (this.getStatus() == 0) {
			me.map.centerAndZoom(e.lnglat, 15);
			dtd.resolve(e.lnglat);
		}
		if (this.getStatus() == 1) {
			me.map.centerAndZoom(e.lnglat, e.level);
			dtd.resolve(e.lnglat);
		}
		if (mark) {
			var marker = new T.Marker(lnglat);
			me.map.addOverLay(marker);
		}
	})
	// console.log(lo)
	return dtd.promise();

}

//定位关键点 
BaseMap.prototype.showNavigationPosition = function(lng, lat, des) {
	var me = this;
	if (me.infoWin) {
		me.map.removeOverLay(me.infoWin);
		me.infoWin = null;
	}
	var lnglat = new T.LngLat(lng, lat);
	me.infoWin = new TInfoWindow(lnglat, new TPixel([0, 0]));
	me.infoWin.setLabel(des);
	me.map.addOverLay(me.infoWin);
	//打开信息窗口时地图自动平移 
	me.infoWin.enableAutoPan();
}

//注册导航功能
BaseMap.prototype.registerNavigation = function() {
	var me = this;
	me.startIcon = me.basePath + '/images/start.png';
	me.endIcon = me.basePath + '/images/end.png';
	var configCar = {
		policy: 0,
		onSearchComplete: function(result) {
			//添加起始点 
			var icon = new TIcon(me.startIcon, new TSize(24, 24), {
				anchor: new TPixel(12, 12)
			})
			var startMarker = new TMarker(me.startLngLat, {
				icon: icon
			});
			me.map.addOverLay(startMarker);
			//向地图上添加终点 
			var icon = new TIcon(me.endIcon, new TSize(24, 24), {
				anchor: new TPixel(12, 12)
			})
			var endMarker = new TMarker(me.endLngLat, {
				icon: icon
			});
			me.map.addOverLay(endMarker);

			me.obj = result;
			var resultList = document.createElement("div");
			//获取方案个数  
			var routes = result.getNumPlans();
			for (var i = 0; i < routes; i++) {
				//获得单条驾车方案结果对象 
				var plan = result.getPlan(i);

				//显示单个方案面板 
				var div = document.createElement("div");
				div.style.cssText = "font-size:12px; cursor:pointer; border:1px solid #999999";

				//显示方案内容 
				var describeStr = "<strong>总时间：" + plan.getDuration() + "秒，总距离：" + Math.round(plan.getDistance()) +
					"公里</strong>";
				describeStr += "<div><img src='" + me.startIcon + "'/>" + $('#' + me.data.navigationId.start).val() + "</div>";

				//显示该方案每段的描述信息 
				var numRoutes = plan.getNumRoutes();
				for (var m = 0; m < numRoutes; m++) {
					var route = plan.getRoute(m);
					describeStr += (m + 1) + ".<span>" + route.getDescription() + "</span><br/>"

					//显示该方案每段的详细描述信息 
					var numStepsStr = "";
					var numSteps = route.getNumSteps();
					for (var n = 0; n < numSteps; n++) {
						var step = route.getStep(n);
						var showPositionId = me._genDomID('position');
						numStepsStr += "<p>" + (n + 1) + ")<a href='#' id='" + showPositionId + "' >" + step.getDescription() +
							"</a></p>";
						(function(step) {
							$('#' + showPositionId).delegate('', 'click', function() {
								me.showNavigationPosition(step.getPosition().getLng(), step.getPosition().getLat(), step.getDescription());
							});
						})(step);
					}
					describeStr += numStepsStr;
				}
				describeStr += "<div><img src='" + me.endIcon + "'/>" + $('#' + me.data.navigationId.end).val() + "</div>";
				div.innerHTML = describeStr;
				resultList.appendChild(div);

				//显示驾车线路 
				var line = new TPolyline(plan.getPath(), {
					strokeColor: "red",
					strokeWeight: 5,
					strokeOpacity: 0.9
				});
				me.map.addOverLay(line);

				//显示最佳级别 
				me.map.setViewport(plan.getPath());
			}
			//显示公交搜索结果 
			$('#' + me.data.navigationId.resultDiv).append(resultList);
		}
	};
	me.drivingRoute = new TDrivingRoute(me.map, configCar);
	var config = {
		icon: new TIcon(me.startIcon, new TSize(24, 24), {
			anchor: new TPixel(14, 28)
		})
	};
	me.startTool = new TMarkTool(me.map, config);
	TEvent.addListener(me.startTool, "mouseup", function(point) {
		var icon = new TIcon(me.startIcon, new TSize(24, 24), {
			anchor: new TPixel(14, 28)
		})
		var startMarker = new TMarker(point, {
			icon: icon
		});
		me.map.addOverLay(startMarker);
		me.startTool.close();
		$('#' + me.data.navigationId.start).val(point.getLng() + "," + point.getLat());
	});
	var config = {
		icon: new TIcon(me.endIcon, new TSize(24, 24), {
			anchor: new TPixel(14, 28)
		})
	};
	me.endTool = new TMarkTool(me.map, config);
	TEvent.addListener(me.endTool, "mouseup", function(point) {
		var icon = new TIcon(me.endIcon, new TSize(24, 24), {
			anchor: new TPixel(14, 28)
		})
		var endMarker = new TMarker(point, {
			icon: icon
		});
		me.map.addOverLay(endMarker);
		me.endTool.close();
		$('#' + me.data.navigationId.end).val(point.getLng() + "," + point.getLat());
		$('#' + me.data.navigationId.endTips).val(point.getLng() + "," + point.getLat());
	});

	// 设置终点的值
	//TODO
	//	$("#end").val(tempLng+","+tempLat);
	//	$("#endTips").val(name);

	// 给开始结束按钮绑定事件
	$('#' + me.data.navigationId.starBtnId).bind('click', function() {
		me.startTool.open();
	});
	$('#' + me.data.navigationId.endBtnId).bind('click', function() {
		me.endTool.open();
	});
	$('#' + me.data.navigationId.searchBtnId).bind('click', function() {
		$('#' + me.data.navigationId.resultDiv).html('');
		me.map.clearOverLays();
		var startVal = $('#' + me.data.navigationId.start).val().split(",");
		me.startLngLat = new T.LngLat(startVal[0], startVal[1]);
		var endVal = $('#' + me.data.navigationId.end).val().split(",");
		me.endLngLat = new T.LngLat(endVal[0], endVal[1]);
		me.drivingRoute.setPolicy(getNavigationRadioValue());
		me.drivingRoute.search(me.startLngLat, me.endLngLat);
	});
}

//获得驾车路线策略 
function getNavigationRadioValue() {
	var obj = $('input[name=planType]');
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
}
/********************************************************************导航函数end************************************************************/

/********************************************************************搜索函数************************************************************/
//关键字搜索回调函数
BaseMap.prototype.localSearchResult = function(result) {
	this.clearAllSearchContent();
	this.promptSearch(result);
	console.log(result);
	switch (parseInt(result.getResultType())) {
		case 1:
			this.poisSearch(result.getPois());
			break;
		case 2:
			this.statisticsSearch(result.getStatistics());
			break;
		case 3:
			this.areaSearch(result.getArea());
			break;
		case 4:
			this.suggestsSearch(result.getSuggests());
			break;
		case 5:
			this.lineDataSearch(result.getLineData());
			break;
	}
}
//关键字搜索
BaseMap.prototype.searchByKey = function(keyWord) {
	var me = this;
	var config = {
		pageCapacity: 17, //每页显示的数量 
		//接收数据的回调函数 
		onSearchComplete: function(data) {
			me.localSearchResult.apply(me, arguments);
		}
	}
	me.localsearch = new T.LocalSearch(me.map, config);
	me.localsearch.search(keyWord);

}

//周边搜索
BaseMap.prototype.searchNearby = function(keyWord, callback, center, radius) {
	var me = this;
	if (center == undefined) {
		center = new T.LngLat(me.mapCenterLng, me.mapCenterLat);
	}
	if (radius == undefined) {
		radius = me.mapRadius;
	}
	var config = {
		pageCapacity: 100000, //每页显示的数量 
		//接收数据的回调函数 
		onSearchComplete: function(data) {
			//me.localSearchResult.apply(me, arguments);
			if (typeof callback=='function') {
				callback(data);
			}
		}
	}
	me.localsearch = new T.LocalSearch(me.map, config);
	me.localsearch.searchNearby(keyWord, center, radius);

}


//清理地图上信息
BaseMap.prototype.clearAllSearchContent = function() {
	this.map.clearOverLays();

}
//解析提示词
BaseMap.prototype.promptSearch = function(obj) {
	var prompts = obj.getPrompt();
	// console.log(prompts)
	if (prompts) {
		var promptHtml = "";
		for (var i = 0; i < prompts.length; i++) {
			var prompt = prompts[i];
			var promptType = prompt.type;
			var promptAdmins = prompt.admins;
			var meanprompt = prompt.DidYouMean;
			if (promptType == 1) {
				promptHtml += "<p>您是否要在" + promptAdmins[0].name + "</strong>搜索更多包含<strong>" + obj.getKeyword() +
					"</strong>的相关内容？<p>";
			} else if (promptType == 2) {
				promptHtml += "<p>在<strong>" + promptAdmins[0].name + "</strong>没有搜索到与<strong>" + obj.getKeyword() +
					"</strong>相关的结果。<p>";
				if (meanprompt) {
					promptHtml += "<p>您是否要找：<font weight='bold' color='#035fbe'><strong>" + meanprompt + "</strong></font><p>";
				}
			} else if (promptType == 3) {
				promptHtml += "<p style='margin-bottom:3px;'>有以下相关结果，您是否要找：</p>"
				for (i = 0; i < promptAdmins.length; i++) {
					promptHtml += "<p>" + promptAdmins[i].name + "</p>";
				}
			}
		}
		// if (promptHtml != "") {
		// 	$('#' + this.data.searchBtnsId.promptDiv).css('display', 'block');
		// 	$('#' + this.data.searchBtnsId.promptDiv).html(promptHtml);
		// }
	}
}

//解析点数据结果 
BaseMap.prototype.poisSearch = function(obj) {
	var me = this;
	var suggestsHtml = "";
	if (obj) {
		//显示搜索列表 
		var divMarker = document.createElement("li");
		//坐标数组，设置最佳比例尺时会用到 
		var zoomArr = [];
		for (var i = 0; i < obj.length; i++) {
			//闭包 
			(function(i) {
				//名称 
				var name = obj[i].name;
				//地址 
				var address = obj[i].address;
				//电话
				var phone = obj[i].phone;
				//坐标 
				var lnglatArr = obj[i].lonlat.split(" ");
				var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);

				var winHtml = "地址:" + address;

				//创建标注对象
				var marker = new T.Marker(lnglat);
				//地图上添加标注点 
				me.map.addOverLay(marker);
				//注册标注点的点击事件 
				// T.Event.bind(marker, "click", marker, function() {
				// 	var info = this.openInfoWinHtml(winHtml);
				// 	info.setTitle(name);
				// });
				marker.Fr.addEventListener("tap", function() {
					marker.openInfoWindow(winHtml);
					// console.log(document.getElementById("detailInfo"));
					document.getElementsByClassName("mui-bar-tab")[0].style.opacity = 1;
					document.getElementById("detailInfo").children[1].innerHTML = name;
					document.getElementById("detailInfo").children[2].innerHTML = address;
					if (phone) {
						document.getElementById("detailInfo").children[3].innerHTML = phone;
					}
					localStorage.setItem("result", lnglatArr);
					localStorage.setItem("resultname", name);
				}, false);

				zoomArr.push(lnglat);

				suggestsHtml +=
					"<li class='mui-table-view-cell'><div class='mui-table'><div class='mui-table-cell mui-col-xs-10'><h4 class='mui-ellipsis'><span class='mui-icon mui-icon-location'></span>" +
					obj[i].name + "</h4><h5>" + obj[i].address +
					"</h5><p class='mui-h6 mui-ellipsis'>" + obj[i].phone +
					"</p></div><div class='mui-table-cell mui-col-xs-2 mui-text-right'></div></div></li>";
				//在页面上显示搜索的列表 
				var a = document.createElement("a");
				a.href = "javascript://";
				a.innerHTML = name;
				a.onclick = function() {
					me.showPositionSearch(marker, name, winHtml);
				}
				divMarker.appendChild(document.createTextNode((i + 1) + "."));
				divMarker.appendChild(a);
				divMarker.appendChild(document.createElement("br"));
			})(i);
		}
		//显示地图的最佳级别 
		me.map.setViewport(zoomArr);
		//显示搜索结果 
		divMarker.appendChild(document.createTextNode('共' + me.localsearch.getCountNumber() + '条记录，分' + me.localsearch.getCountPage() +
			'页,当前第' + me.localsearch.getPageIndex() + '页'));
		//document.getElementsByClassName("mui-table-view")[0].appendChild(suggestsHtml);
		// console.log(document.getElementById("listInfo"));
		if (document.getElementById("listInfo")) {
			document.getElementById("listInfo").innerHTML = suggestsHtml;
		}
	}
}

//显示信息框 
BaseMap.prototype.showPositionSearch = function(marker, name, winHtml) {
	var info = marker.openInfoWinHtml(winHtml);
	info.setTitle(name);
}

//解析推荐城市
BaseMap.prototype.statisticsSearch = function(obj) {
	// if (obj) {
	// 	//坐标数组，设置最佳比例尺时会用到 
	// 	var pointsArr = [];
	// 	var priorityCitysHtml = "";
	// 	var allAdminsHtml = "";
	// 	var priorityCitys = obj.priorityCitys;
	// 	if (priorityCitys) {
	// 		//推荐城市显示  
	// 		priorityCitysHtml += "在中国以下城市有结果<ul>";
	// 		for (var i = 0; i < priorityCitys.length; i++) {
	// 			priorityCitysHtml += "<li>" + priorityCitys[i].name + "(" + priorityCitys[i].count + ")</li>";
	// 		}
	// 		priorityCitysHtml += "</ul>";
	// 	}

	// 	var allAdmins = obj.allAdmins;
	// 	if (allAdmins) {
	// 		allAdminsHtml += "更多城市<ul>";
	// 		for (var i = 0; i < allAdmins.length; i++) {
	// 			allAdminsHtml += "<li>" + allAdmins[i].name + "(" + allAdmins[i].count + ")";
	// 			var childAdmins = allAdmins[i].childAdmins;
	// 			if (childAdmins) {
	// 				for (var m = 0; m < childAdmins.length; m++) {
	// 					allAdminsHtml += "<blockquote>" + childAdmins[m].name + "(" + childAdmins[m].count + ")</blockquote>";
	// 				}
	// 			}
	// 			allAdminsHtml += "</li>"
	// 		}
	// 		allAdminsHtml += "</ul>";
	// 	}
	// 	document.getElementById("statisticsDiv").style.display = "block";
	// 	document.getElementById("statisticsDiv").innerHTML = priorityCitysHtml + allAdminsHtml;

	// 	$('#' + this.data.searchBtnsId.statisticsDiv).css('display', 'block');
	// 	$('#' + this.data.searchBtnsId.statisticsDiv).html(priorityCitysHtml + allAdminsHtml);
	// }
}

//解析行政区划边界 
BaseMap.prototype.areaSearch = function(obj) {
	// if (obj) {
	// 	//坐标数组，设置最佳比例尺时会用到
	// 	var pointsArr = [];
	// 	var points = obj.points;
	// 	for (var i = 0; i < points.length; i++) {
	// 		var regionLngLats = [];
	// 		var regionArr = points[i].region.split(",");
	// 		for (var m = 0; m < regionArr.length; m++) {
	// 			var lnglatArr = regionArr[m].split(" ");
	// 			var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
	// 			regionLngLats.push(lnglat);
	// 			pointsArr.push(lnglat);
	// 		}
	// 		//创建线对象 
	// 		var line = new TPolyline(regionLngLats, {
	// 			strokeColor: "blue",
	// 			strokeWeight: 3,
	// 			strokeOpacity: 1,
	// 			strokeStyle: "dashed"
	// 		});
	// 		//向地图上添加线 
	// 		this.map.addOverLay(line);
	// 	}
	// 	//显示最佳比例尺 
	// 	this.map.setViewport(pointsArr);
	// }
}

//解析建议词信息 
BaseMap.prototype.suggestsSearch = function(obj) {
	console.log(obj)
	if (obj) {
		//建议词提示，如果搜索类型为公交规划建议词或公交站搜索时，返回结果为公交信息的建议词。 
		var suggestsHtml = "建议词提示<ul>";
		for (var i = 0; i < obj.length; i++) {
			suggestsHtml += "<li>" + obj[i].name + "&nbsp;&nbsp;<font style='color:#666666'>" + obj[i].address + "</font></li>";
		}
		document.getElementsByClassName("mui-table-view")[0].appendChild(divMarker)
		// $('#' + this.data.searchBtnsId.suggestsDiv).css('display', 'block');
		// $('#' + this.data.searchBtnsId.suggestsDiv).html(suggestsHtml);
	}
}

//解析公交信息 
BaseMap.prototype.lineDataSearch = function(obj) {
	// if (obj) {
	// 	//公交提示 
	// 	var lineDataHtml = "公交提示<ul>";
	// 	for (var i = 0; i < obj.length; i++) {
	// 		lineDataHtml += "<li>" + obj[i].name + "&nbsp;&nbsp;<font style='color:#666666'>共" + obj[i].stationNum +
	// 			"站</font></li>";
	// 	}
	// 	lineDataHtml += "</ul>";

	// 	$('#' + this.data.searchBtnsId.lineDataDiv).css('display', 'block');
	// 	$('#' + this.data.searchBtnsId.lineDataDiv).html(lineDataHtml);
	// }
}

//画圆
BaseMap.prototype.createCircle = function() {
	
	var me = this;
	var config = {
		color: "blue", //折线颜色
		fillColor: "#84f679", //填充颜色。当参数为空时，折线覆盖物将没有填充效果
		weight: "3", //折线的宽度，以像素为单位
		opacity: 0.5, //折线的透明度，取值范围0 - 1
		fillOpacity: 0.4,
		lineStyle: "solid" //折线的样式，solid或dashed
	};
	//定义该矩形的显示区域
	var circle = new T.Circle(new T.LngLat(me.mapCenterLng, me.mapCenterLat), me.mapRadius, config);
	me.map.addOverLay(circle);
}

BaseMap.prototype.dragendSearch = function(lnglat) {
	// this.map.removeOverLay(infoWin);
	// var nowLng = lnglat.getLng();
	// var nowLat = lnglat.getLat();
	// var config = {
	// 	text: "经度：" + nowLng + "</br>纬度：" + nowLat,
	// 	offset: new TPixel(-45, -50),
	// 	position: lnglat
	// };
	// infoWin = new TLabel(config);
	// this.map.addOverLay(infoWin);
}

BaseMap.prototype.showSearchPanel = function() {
	// var me = this;
	// me.data.searchBtnsId.searchBtn = me._genDomID('searchBtn');
	// me.data.searchBtnsId.promptDiv = me._genDomID('promptDiv');
	// me.data.searchBtnsId.statisticsDiv = me._genDomID('statisticsDiv');
	// me.data.searchBtnsId.suggestsDiv = me._genDomID('suggestsDiv');
	// me.data.searchBtnsId.lineDataDiv = me._genDomID('lineDataDiv');
	// me.data.searchBtnsId.resultDiv = me._genDomID('resultDiv');
	// me.data.searchBtnsId.searchDiv = me._genDomID('searchDiv');
	// me.data.searchBtnsId.pageDiv = me._genDomID('pageDiv');
	// me.data.searchBtnsId.first_page = me._genDomID('first_page');
	// me.data.searchBtnsId.up_page = me._genDomID('up_page');
	// me.data.searchBtnsId.next_page = me._genDomID('next_page');
	// me.data.searchBtnsId.end_page = me._genDomID('end_page');
	// me.data.searchBtnsId.turn_page = me._genDomID('turn_page');
	// me.data.searchBtnsId.hide_page = me._genDomID('hide_page');
	// me.data.searchBtnsId.pageId = me._genDomID('pageId');
	// me.data.searchBtnsId.keyWord = me._genDomID('keyWord');
	// var searchDivId = me._genDomID('searchDiv');

	// var html = '';
	// html += '<div id=' + searchDivId + ' style="background-color: RGB(237,244,255);height=500px;">';
	// html += '<div style="font-size:13px; border:1px solid #999999; line-height:27px; padding-left:7px">';
	// html += '搜索内容：<input type="text" id="' + me.data.searchBtnsId.keyWord + '"/>';
	// html += '<input type="button" id="' + me.data.searchBtnsId.searchBtn + '" value="搜索"/>';
	// html += '</div>';
	// html += '<br/>';
	// html += '<div id="' + me.data.searchBtnsId.promptDiv + '" class="prompt"></div>';
	// html += '<div id="' + me.data.searchBtnsId.statisticsDiv + '" class="statistics"></div>';
	// html += '<div id="' + me.data.searchBtnsId.suggestsDiv + '" class="suggests"></div>';
	// html += '<div id="' + me.data.searchBtnsId.lineDataDiv + '" class="lineData"></div>';
	// html += '<div id="' + me.data.searchBtnsId.resultDiv + '" class="result">';
	// html += '<div id="' + me.data.searchBtnsId.searchDiv + '"></div>';
	// html += '<div id="' + me.data.searchBtnsId.pageDiv + '">';
	// html += '<input type="button" value="第一页" id="' + me.data.searchBtnsId.first_page + '" />';
	// html += '<input type="button" value="上一页" id="' + me.data.searchBtnsId.up_page + '" />';
	// html += '<input type="button" value="下一页" id="' + me.data.searchBtnsId.next_page + '" />';
	// html += '<input type="button" value="最后一页" id="' + me.data.searchBtnsId.end_page + '" />';
	// html += '<br/>';
	// html += '转到第<input type="text" value="1" id="' + me.data.searchBtnsId.pageId + '" size="3"/>页';
	// html += '<input type="button" id="' + me.data.searchBtnsId.turn_page + '" value="转到"/>';
	// html += '<input type="button" id="' + me.data.searchBtnsId.hide_page + '" value="收起"/>';
	// html += '</div>';
	// html += '</div>';
	// html += '</div>';

	// var navigationPanelWidth = 310;
	// var mapWidth = me.width - navigationPanelWidth - 20;
	// me.containerId = me.mapId;
	// me.mapId = me._genDomID('mapDiv');
	// var navigationPanelId = me._genDomID('navigationPanel');
	// var mapContainerDom = $('#' + me.containerId);
	// mapContainerDom.css('width', me.width);
	// mapContainerDom.css('height', me.height);
	// mapContainerDom.layout();
	// mapContainerDom.layout('add', {
	// 	region: 'west',
	// 	width: navigationPanelWidth,
	// 	height: me.height,
	// 	style: {
	// 		zIndex: 100
	// 	},
	// 	title: '搜索',
	// 	content: '<div id="' + navigationPanelId + '"></div>',
	// 	split: true,
	// 	onCollapse: function() {
	// 		me.map.checkResize();
	// 	},
	// 	onExpand: function() {
	// 		me.map.checkResize();
	// 	}
	// });

	// $('#' + navigationPanelId).append($(html));

	// mapContainerDom.layout('add', {
	// 	region: 'center',
	// 	style: {
	// 		zIndex: 98
	// 	},
	// 	content: '<div id="' + me.mapId + '" style="width:100%;height:100%;"></div>'
	// });

	// $('#' + searchDivId).height((me.height - 30));

	// //绑定事件
	// $('#' + me.data.searchBtnsId.first_page).bind('click', function() {
	// 	me.localsearch.firstPage();
	// });
	// $('#' + me.data.searchBtnsId.up_page).bind('click', function() {
	// 	me.localsearch.previousPage();
	// });
	// $('#' + me.data.searchBtnsId.next_page).bind('click', function() {
	// 	me.localsearch.nextPage();
	// });
	// $('#' + me.data.searchBtnsId.end_page).bind('click', function() {
	// 	me.localsearch.lastPage();
	// });
	// $('#' + me.data.searchBtnsId.turn_page).bind('click', function() {
	// 	me.localsearch.gotoPage(parseInt($('#' + me.data.searchBtnsId.pageId).val()));
	// });
	// $('#' + me.data.searchBtnsId.hide_page).bind('click', function() {
	// 	me.clearAllSearchContent();
	// });

	// $('#' + me.data.searchBtnsId.pageDiv).hide();
}
/********************************************************************搜索函数end************************************************************/



/*********************选取经纬度Dialog*************************/
var BaseMapLngLatChooseDialog = function(init_params) {
	// var p = init_params,
	// 	me = this;
	// me.dialogId = me._genDomID('dialog');
	// me.mapDivId = me._genDomID('mapdiv');
	// me.onOkEvent = p.onOkEvent || null;

	// me.dialogDom = $('<div id="' + me.dialogId + '"></div>');
	// $(document.body).append(me.dialogDom);

	// var dialogParams = p['dialog'] || {};
	// if (dialogParams.closed == undefined) {
	// 	dialogParams.closed = true; //dialog默认关闭
	// }
	// dialogParams.width = dialogParams.width || 600;
	// dialogParams.height = dialogParams.height || 440;
	// dialogParams.modal = true;
	// dialogParams.title = dialogParams.title || '标注点';

	// dialogParams.content = '<div id="' + me.mapDivId + '" style="width:800px;height:600px;"></div>';
	// dialogParams.buttons = [{
	// 	text: '确定',
	// 	iconCls: 'icon-ok',
	// 	handler: function() {
	// 		var point = me.map.getMarkerToolPointData();
	// 		if (me.onOkEvent) {
	// 			me.onOkEvent.call(me, point);
	// 		}
	// 		me.close();
	// 	}
	// }, {
	// 	text: '关闭',
	// 	iconCls: 'icon-cancel',
	// 	handler: function() {
	// 		me.close();
	// 	}
	// }];
	// me.dialogDom.dialog(dialogParams);

	// me.map = null;
	// me.mapParams = p['map'] || {};
	// me.mapParams.mapId = me.mapDivId;
	// me.mapParams.width = dialogParams.width - 31;
	// me.mapParams.height = dialogParams.height - 75;
};

//显示
BaseMapLngLatChooseDialog.prototype.show = function() {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('open');
	// 	if (!this.map) {
	// 		this.map = new BaseMap(this.mapParams);
	// 		this.map.openMarkerTool();
	// 	}
	// }
};

//关闭
BaseMapLngLatChooseDialog.prototype.close = function() {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('close');
	// }
};

//关闭
BaseMapLngLatChooseDialog.prototype.setTitle = function(title) {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('setTitle', title || '');
	// }
};

//ID生成
BaseMapLngLatChooseDialog.prototype._genDomID = function(type) {
	__map_gen_dom_idx++;
	return "_basemap_lnglat_choosedialog_gen_" + (type || '') + __map_gen_dom_idx;
};



/*********************选取区域Dialog*************************/
var BaseMapAreaChooseDialog = function(init_params) {
	// var p = init_params,
	// 	me = this;
	// me.dialogId = me._genDomID('dialog');
	// me.mapDivId = me._genDomID('mapdiv');

	// me.onOkEvent = p.onOkEvent || null;
	// me.dialogDom = $('<div id="' + me.dialogId + '"></div>');
	// $(document.body).append(me.dialogDom);

	// var dialogParams = p['dialog'] || {};
	// if (dialogParams.closed == undefined) {
	// 	dialogParams.closed = true; //dialog默认关闭
	// }
	// dialogParams.width = dialogParams.width || 600;
	// dialogParams.height = dialogParams.height || 440;

	// dialogParams.modal = true;
	// dialogParams.title = dialogParams.title || '区域标注';

	// dialogParams.content = '<div id="' + me.mapDivId + '"></div>';
	// dialogParams.buttons = [{
	// 	text: '确定',
	// 	iconCls: 'icon-ok',
	// 	handler: function() {
	// 		var pointsStr = me.map.getPolygonToolDrawPointStr();
	// 		var pointsData = me.map.getPolygonToolDrawData();
	// 		if (me.onOkEvent) {
	// 			me.onOkEvent.call(me, pointsData, pointsStr);
	// 		}
	// 		me.close();
	// 	}
	// }, {
	// 	text: '重新选取',
	// 	iconCls: 'icon-edit',
	// 	handler: function() {
	// 		if (me.area) {
	// 			try {
	// 				me.map.map.removeOverLay(me.area);
	// 			} catch (e) {}

	// 			me.area = null;
	// 			me.map.openPolygonTool();
	// 		}
	// 	}
	// }, {
	// 	text: '关闭',
	// 	iconCls: 'icon-cancel',
	// 	handler: function() {
	// 		me.close();
	// 	}
	// }];
	// me.dialogDom.dialog(dialogParams);

	// me.map = null;
	// me.mapParams = p['map'] || {};
	// me.mapParams.mapId = me.mapDivId;
	// me.mapParams.width = dialogParams.width - 31;
	// me.mapParams.height = dialogParams.height - 75;
	// me.area = null; //选取的区域
	// me.mapParams.onDrawPolygonComplete = function(points, length, polyline, eventOwn) {
	// 	me.area = polyline;
	// };
};

//显示
BaseMapAreaChooseDialog.prototype.show = function() {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('open');
	// 	if (!this.map) {
	// 		this.map = new BaseMap(this.mapParams);
	// 		this.map.openPolygonTool();
	// 	}
	// }
};

//关闭
BaseMapAreaChooseDialog.prototype.close = function() {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('close');
	// }
};

//关闭
BaseMapAreaChooseDialog.prototype.setTitle = function(title) {
	// if (this.dialogDom) {
	// 	this.dialogDom.dialog('setTitle', title || '');
	// }
};

//ID生成
BaseMapAreaChooseDialog.prototype._genDomID = function(type) {
	__map_gen_dom_idx++;
	return "_basemap_area_choosedialog_gen_" + (type || '') + __map_gen_dom_idx;
};

//全局ID索引
__map_gen_dom_idx = 0;
