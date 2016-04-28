document.addEventListener('DOMContentLoaded', function () {

	console.log('in popup js');
	return;
	// var data = chrome.extension.getBackgroundPage().articleData;
	// if(data && data.error){
	// 	$("#message").text(data.error);
	// 	$("#content").hide();
	// 	return;
	// }
	// // console.log(data);
	// var modulesMockUrl = [];
	// var modulesMockTpl = [];
	//
	// // module link html
	// function createALinkString(url, txt) {
	// 	var linkUrl = '<li><a href="' + url + '" target="_blank">' + txt + '</a></li>';
	// 	return linkUrl;
	// }
	//
	//
	// for(var i=0 ; i < data.modulesId.length; i++) {
	// 		let linkUrl = 'http://tms.alibaba-inc.com/web/modules/' + data.modulesId[i] + '/mock';			modulesMockTpl.push(createALinkString(linkUrl, data.modulesName[i]));
	// }
	//
	//
	// 	$("#message").hide();
	// 	$("#content").show();
	// 	$("#content-title").text(data.title);
	// 	$("#content-author a").text('设计页面');
	// 	$("#content-author a").attr('href', data.pageUrl);
	// 	$("#content-date a").text('查看页面数据');
	// 	$("#content-date a").attr('href', data.postDate);
	// 	$("#content-first-access ul").html(modulesMockTpl.join(''));
});
