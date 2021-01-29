/**
 * common公共库
 */
define([], function() {
	/**
	 * 获取用户机器本地时间
	 * @return {long} 返回一个long型的毫秒数,为现在距1970年的毫秒数格式
	 * example:
	 * time.getLocalTime();
	 */
	var getLocalTime = function() {
		var localTime = "";
		var myDate = new Date();
		localTime = myDate.getTime();
		return localTime;
	};

	/**
	 * 转换时间，由201501010000格式转换为现在距1970年的毫秒数格式
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {long} 返回一个long型的毫秒数,为现在距1970年的毫秒数格式
	 * example:
	 * time.parseToTime("20150101010101");
	 */
	var parseToTime = function(timeValue) {
		var secTime = "";
		var year = timeValue.substr(0, 4);
		var month = timeValue.substr(4, 2) - 1;
		var date = timeValue.substr(6, 2);
		var hour = timeValue.substr(8, 2);
		var min = timeValue.substr(10, 2);
		var sec = timeValue.substr(12, 2);

		var myDate = new Date();
		myDate.setFullYear(year, month, date);
		myDate.setHours(hour, min, sec);
		secTime = myDate.getTime();

		return secTime;
	};

	/**
	 * 由14位时间字符串转换为以"星期"为单位的时间
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {String} 返回一个 '星期*' 的字符串
	 * example:
	 * time.parseToDay("20150101010101");
	 */
	var parseToDay = function(timeValue) {
		var day = "";
		var dayIndex = "";
		var year = timeValue.substr(0, 4);
		var month = timeValue.substr(4, 2) - 1;
		var date = timeValue.substr(6, 2);
		var myDate = new Date();
		myDate.setFullYear(year, month, date);
		dayIndex = myDate.getDay();
		switch(dayIndex) {
			case 0:
				day = "星期日";
				break;
			case 1:
				day = "星期一";
				break;
			case 2:
				day = "星期二";
				break;
			case 3:
				day = "星期三";
				break;
			case 4:
				day = "星期四";
				break;
			case 5:
				day = "星期五";
				break;
			case 6:
				day = "星期六";
				break;
		}
		return day;
	};

	/**
	 * 由14位时间字符串转换为以“日期”为单位（2015.01.01格式）的时间
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {String} 返回一个 '2015.01.01'时间格式的字符串
	 */
	var parseToDate = function(timeValue) {
		var result = "";
		var year = timeValue.substr(0, 4);
		var month = timeValue.substr(4, 2);
		var date = timeValue.substr(6, 2);
		result = year + "/" + month + "/" + date;
		return result;
	};

	/**
	 * 由14位时间字符串转换为以“日期”为单位（2015.01.01格式）的时间
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {String} 返回一个 '2015-01-01'时间格式的字符串
	 */
	var parseToDate2 = function(timeValue) {
		var result = "";
		var year = timeValue.substr(2, 2);
		var month = timeValue.substr(4, 2);
		var date = timeValue.substr(6, 2);
		result = year + "-" + month + "-" + date;
		return result;
	};

	/**
	 * 由14位时间字符串转换为以'时分'为单位（00:00格式）的时间
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {String} 返回一个 '00:00'时间格式的字符串
	 * example:
	 * time.parseToHourmin("20150101010101");
	 */
	var parseToHourmin = function(timeValue) {
		var time = "";
		var hour = timeValue.substr(8, 2);
		var min = timeValue.substr(10, 2);
		time = hour + ":" + min;
		return time;
	};

	/**
	 * 由14位时间字符串转换为以'时分'为单位（00:00格式）的时间
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒）
	 * @return {String} 返回一个 '00:00:00'时间格式的字符串
	 * example:
	 * time.parseToHourmin("20150101010101");
	 */
	var parseToHourminsec = function(timeValue) {
		var time = "";
		var hour = timeValue.substr(8, 2);
		var min = timeValue.substr(10, 2);
		var sec = timeValue.substr(12, 2);
		time = hour + ":" + min + ":" + sec;
		return time;

	}

	/**
	 * 由14位时间字符串转换为以“XXX分钟前、XXX小时前”为单位的时间，
	 * 即较大的时间值具较小时间值的范围,若超出范围则按时间较小的值显示。
	 * @param {String} timeValue 14位的时间字符串  20150101010101（年月日时分秒） 较大的时间值
	 * @param {String} serverTime 14位的时间字符串  20150101010101（年月日时分秒）较小的时间值
	 * @return {String} 返回一个 '*小时前或*分钟前或*月*日'时间格式的字符串
	 * example:
	 * time.parseToNearTime('20160406143900','20160407152000');
	 */
	var parseToNear = function(minTimeValue, maxTimeValue) {
		var minTime = parseToTime(minTimeValue);
		var maxTime = parseToTime(maxTimeValue);
		var spaceTime = Math.round((maxTime - minTime) / 1000);
		var resultTime = "";
		if(Math.floor(spaceTime / 60) == 0) {
			resultTime = "现在";
		} else if(Math.floor(spaceTime / 60) > 0 && Math.floor(spaceTime / 60) < 60) {
			resultTime = Math.floor(spaceTime / 60) + "分钟前";
		} else if(Math.floor(spaceTime / 60) >= 60 && Math.floor(spaceTime / 60) < 1440) {
			resultTime = Math.floor(Math.floor(spaceTime / 60) / 60) + "小时前";
		} else {
			var month = minTimeValue.substr(4, 2);
			var date = minTimeValue.substr(6, 2);
			resultTime = "" + month + "月" + date + "日";
		}
		return resultTime;
	};

	/**
	 * 由单位秒转化为单位（00:00格式）的时间
	 * @param {String} 秒数
	 * @return {String} 返回一个 '00:00'时间格式的字符串
	 * example:
	 * time.secToMinsec("360");
	 */
	var secToMinsec = function(restTimeValue) {
		var conTime = "";
		var fen = Math.floor(restTimeValue / 60);
		var miao = restTimeValue % 60;
		if(fen < 10) {
			fen = "0" + fen;
		}
		if(miao < 10) {
			miao = "0" + miao;
		}
		conTime = fen + ":" + 　miao;
		return conTime;
	};

	/**
	 * 由距离1970的毫秒数转14位的时间字符串  20150101010101（年月日时分秒）
	 * @param {string} timeValue 距离1970的毫秒数
	 * @return {String} 返回一个 14位时间格式的字符串
	 * example:
	 * time.timeTo14("1451581261223");
	 */
	var timeTo14 = function(timeValue) {
		var time = "";
		var myDate = new Date();
		myDate.setTime(timeValue);
		var year = myDate.getFullYear();
		var mouth = myDate.getMonth() + 1;
		var date = myDate.getDate();
		var hour = myDate.getHours();
		var min = myDate.getMinutes();
		var sec = myDate.getSeconds();
		if(mouth < 10) {
			mouth = "0" + mouth;
		}
		if(date < 10) {
			date = "0" + date;
		}
		if(hour < 10) {
			hour = "0" + hour;
		}
		if(min < 10) {
			min = "0" + min;
		}
		if(sec < 10) {
			sec = "0" + sec;
		}
		time = "" + year + mouth + date + hour + min + sec;
		return time;
	};

	//time类库方法
	var time = new Object();
	time.getLocalTime = getLocalTime;
	time.timeTo14 = timeTo14;
	time.secToMinsec = secToMinsec;
	time.parseToTime = parseToTime;
	time.parseToDay = parseToDay;
	time.parseToHourmin = parseToHourmin;
	time.parseToNear = parseToNear;
	time.parseToHourminsec = parseToHourminsec;
	time.parseToDate = parseToDate;
	time.parseToDate2 = parseToDate2;

	return {
		time: time
	};
});