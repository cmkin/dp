define('toolLayers', ['tmap', 'basetmap', 'jquery', 'd3', 'd3SvgOverlay'],
	function(tmap, bmap, $, d3, d3SvgOverlay) {

		/////////////////////////  公共变量  ///////////////////////////////////////
		var AreaMechanism = 'data/AreaMechanism.json'; //功能区审批机构
		var AreaRange = 'data/AreaRange.json'; //功能区审批范围
		var CommunityMechanism = 'data/CommunityMechanism.json'; //社区审批机构
		var CommunityRange = 'data/CommunityRange.json'; //社区审批范围
		var StreetMechanism = 'data/StreetMechanism.json'; //街镇审批机构
		var StreetRange = 'data/StreetRange.json'; //街镇审批范围
		var dataroot = 'data/Area.json';
		//图层集合对象
		var layerGroup = {
			AreaRange: [],
			AreaMechanism: [],
			StreetRange: [],
			StreetMechanism: [],
			CommunityRange: [],
			CommunityMechanism: []
		}
		//geojson数据对象
		var geoJson = {
			AreaRange: [],
			AreaMechanism: [],
			StreetRange: [],
			StreetMechanism: [],
			CommunityRange: [],
			CommunityMechanism: []
		}
		//返回对象
		toolLayers = {

			initToolLayers: function() {
				var self = this;
				//初始化地图对象
				var basemap = bmap.baseTmap;
				var funArr = [];
				funArr.push(basemap.getGeoJson(AreaRange));
				funArr.push(basemap.getGeoJson(AreaMechanism));
				funArr.push(basemap.getGeoJson(StreetRange));
				funArr.push(basemap.getGeoJson(StreetMechanism));
				funArr.push(basemap.getGeoJson(CommunityRange));
				funArr.push(basemap.getGeoJson(CommunityMechanism));
				$.when.apply($, funArr).done(function(data1, data2, data3, data4, data5, data6) {
					geoJson.AreaRange = data1;
					geoJson.AreaMechanism = data2;
					geoJson.StreetRange = data3;
					geoJson.StreetMechanism = data4;
					geoJson.CommunityRange = data5;
					geoJson.CommunityMechanism = data6;
				}).then(function(data) {
					//专题图层
					self.themeLayers();
					
					var layName = 'btn_area';
					var style = {
						color: "#ffffff",
						weight: 1,
						opacity: 0.5,
						fillColor: "#1fcb25",
						fillOpacity: 0.5
					};
					var lays = layerGroup.AreaRange;
					layerGroup.AreaRange = basemap.getLayerGroup(geoJson.AreaRange, layName, style);
					//添加弹出信息事件
					addOpenInfo(layerGroup.AreaRange);
					
					setTimeout(function(){
						
						reomveLayerGroup(lays);
						
						
						layerGroup.AreaRange = basemap.getLayerGroup(geoJson.AreaRange, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.AreaRange);
						
					},1000*60)
					
					
					
				})
			},



			//专题图层
			themeLayers: function() {
				var basemap = bmap.baseTmap;
				//功能区范围
				$('.btn_area').on('click', function(e) {
					var img = $(e.currentTarget);
					var layName = 'btn_area';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_area2.png').attr('data-show', 1);
						var style = {
							color: "#ffffff",
							weight: 1,
							opacity: 0.5,
							fillColor: "#1fcb25",
							fillOpacity: 0.5
						};
						layerGroup.AreaRange = basemap.getLayerGroup(geoJson.AreaRange, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.AreaRange);

					} else {
						img.attr('src', 'images/btn_area.png').attr('data-show', 0);
						var lays = layerGroup.AreaRange;
						reomveLayerGroup(lays);
					}
				})
				//功能区审批机构
				$('.btn_area_jg').on('click', function(e) {
					var img = $(e.currentTarget);
					var layName = 'btn_area_jg';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_area_jg2.png').attr('data-show', 1);
						var style = {
							iconUrl: "images/marker-icon.png",
							iconSize: new T.Point(25, 41),
							iconAnchor: new T.Point(13, 41)
						};
						layerGroup.AreaMechanism = basemap.getLayerGroup(geoJson.AreaMechanism, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.AreaMechanism);

					} else {
						img.attr('src', 'images/btn_street.png').attr('data-show', 0);
						var lays = layerGroup.AreaMechanism;
						reomveLayerGroup(lays);
					}
				})
				//街镇范围
				$('.btn_street').on('click', function(e) {
					var img = $(e.currentTarget);
					var layName = 'btn_street';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_street2.png').attr('data-show', 1);
						var style = {
							color: "#ff0000",
							weight: 1,
							opacity: 0.5,
							fillColor: "#f8b226",
							fillOpacity: 0.5,
							lineStyle: 'dashed'
						};
						layerGroup.StreetRange = basemap.getLayerGroup(geoJson.StreetRange, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.StreetRange);
					} else {
						img.attr('src', 'images/btn_street.png').attr('data-show', 0);
						var lays = layerGroup.StreetRange;
						reomveLayerGroup(lays);
					}
				})
				//街镇审批机构
				$('.btn_street_jg').on('click', function(e) {
					var img = $(e.currentTarget);
					var layName = 'btn_street_jg';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_street_jg2.png').attr('data-show', 1);

						var style = {
							iconUrl: "images/marker-icon.png",
							iconSize: new T.Point(25, 41),
							iconAnchor: new T.Point(13, 41)
						};
						layerGroup.StreetMechanism = basemap.getLayerGroup(geoJson.StreetMechanism, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.StreetMechanism);


					} else {
						img.attr('src', 'images/btn_street_jg.png').attr('data-show', 0);
						var lays = layerGroup.StreetMechanism;
						reomveLayerGroup(lays);
					}
				})
				//社区范围
				$('.btn_community').on('click', function(e) {

					var img = $(e.currentTarget);
					var layName = 'btn_community';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_community2.png').attr('data-show', 1);

						var style = {
							color: "#ff0000",
							weight: 1,
							opacity: 0.5,
							fillColor: "#fc02b2",
							fillOpacity: 0.5,
							lineStyle: 'dashed'
						};
						layerGroup.CommunityRange = basemap.getLayerGroup(geoJson.CommunityRange, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.CommunityRange);


					} else {
						img.attr('src', 'images/btn_community.png').attr('data-show', 0);
						var lays = layerGroup.CommunityRange;
						reomveLayerGroup(lays);
					}
				})
				//社区审批机构
				$('.btn_community_jg').on('click', function(e) {

					var img = $(e.currentTarget);
					var layName = 'btn_community_jg';
					if (img.attr('data-show') == "0") {
						img.attr('src', 'images/btn_community_jg2.png').attr('data-show', 1);

						var style = {
							iconUrl: "images/marker-icon.png",
							iconSize: new T.Point(25, 41),
							iconAnchor: new T.Point(13, 41)
						};
						layerGroup.CommunityMechanism = basemap.getLayerGroup(geoJson.CommunityMechanism, layName, style);
						//添加弹出信息事件
						addOpenInfo(layerGroup.CommunityMechanism);


					} else {
						img.attr('src', 'images/btn_community_jg.png').attr('data-show', 0);
						var lays = layerGroup.CommunityMechanism;
						reomveLayerGroup(lays);
					}
				})


				//地图类型切换
				$('.vector').on('click', function(data) {
					basemap.mapTypeControl(2);
					$('.satellite').attr('src', 'images/wx.png');
					$(this).attr('src', 'images/bz1.png');

				})
				$('.satellite').on('click', function(data) {
					basemap.mapTypeControl(1);
					$('.vector').attr('src', 'images/bz.png');
					$(this).attr('src', 'images/wx1.png');

				})

				//图层替换模板内容
				function openInfoWindow(marker) {
					marker.addEventListener("click", function(e) {
						//获取数据信息
						var data = e.target.data;
						var info = new T.InfoWindow();
						//设置信息窗口要显示的内容
						var inwindowTemplate = $('.control-infowindow');
						var name = data.jgmc;
						if (e.target.type = 'Polygon') {
							switch (e.target.layName) {
								case 'btn_area':
									name = data.gnqname;
									break;
								case 'btn_street':
									name = data.jzname;
									break;
								case 'btn_community':
									name = data.comname;
									break;
								default:
									break;
							}
						}
						var name = inwindowTemplate.find('.info_name').text(name);
						info.setContent(inwindowTemplate.html());
						e.target.openInfoWindow(info);
					});
					return marker;
				}

				//添加弹出信息事件
				//lays的数组
				function addOpenInfo(lays) {
					//添加弹出信息事件
					for (var i = 0; i < lays.length; i++) {
						var pointMarker = lays[i];
						openInfoWindow(pointMarker);
					}
				}
				//移除图层组
				//lays的数组
				function reomveLayerGroup(lays) {
					for (var i = 0; i < lays.length; i++) {
						basemap.tmap.removeOverLay(lays[i]);
					}
				}

			}
		}


		return toolLayers;
	})
