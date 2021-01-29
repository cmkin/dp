//模块的配置
require.config({
	//baseUrl: "",
	paths: {
		'jquery': './libs/jquery-2.1.4.min',
		'tmap': ['./libs/tianditu4.0',',http://api.tianditu.gov.cn/api?v=4.0&tk=e2bfcb2014ba51b1ae74ad65600a62df'],
		'd3': './libs/d3',
		'd3SvgOverlay': './libs/D3SvgOverlay',
		'basetmap': './core/baseTmap',
		'turf': ['./libs/turf.min', 'https://npmcdn.com/@turf/turf/turf.min'],
		'underscore': './libs/underscore',
		'message': './libs/message',
		'uibase': './core/uibase',
		'index': './bll/index',
		'html2canvas': './libs/html2canvas',
		'leaflet':'./libs/leaflet/leaflet',
		'leaflet-tilelayer-wmts-src':'./libs/leaflet/leaflet-tilelayer-wmts-src',
		'toolLayers':'./core/toolLayers'
		
	},
	//依赖关系，不执行
	shim: {
		'tmap': {
			deps: [],
			exports: 'tmap'
		},
		'd3SvgOverlay': {
			deps: ['tmap', 'd3'],
			exports: 'd3SvgOverlay'
		},
		'turf': {
			deps: ['tmap'],
			exports: 'turf'
		},
		'basetmap': {
			deps: ['jquery', 'tmap', 'd3', 'd3SvgOverlay','leaflet'],
			exports: 'basetmap'
		},
		'toolLayers':{
			deps: ['basetmap'],
			exports: 'toolLayers'
		},
		'underscore': {
			deps: [],
			exports: '_'
		},
		 
		'leaflet-tilelayer-wmts-src': {
			deps: ['leaflet'],
			exports: '_'
		},
	}
});

//应用程序
require(['_main_']);
define('_main_', ['index'],
	function(idnex) {

		idnex.initialize();
	});
