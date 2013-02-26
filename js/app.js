var app = app || {};

(function(w){  
  
	w.render = function(templateName, data) {
		var tmpl = Handlebars.templates[templateName];
		if (tmpl) {
			return tmpl(data);
		} else {
			// obviously, handle this case as you think most appropriate.
			return "<small>Error: could not find template: " + templateName + "</small>";
		}
	}

})(window);

(function($) {
	
	app.render = function(templateName,data){
		data = data || {};
		return render(templateName,data);
	}
	
	app.getJsonData = function(url,isNewRequest,paramData){
		if(typeof paramData == "undefined"){
			paramData = {};
		}
		var dfd = $.Deferred();
		var index = url.indexOf("?");
		var uri = url;
		var tempUrl = app.buildTempUrl(url,paramData);
		if(index > 0){
			uri = url.substring(0,index);
		}
		//When we click on left navigation and open the report, invalidate all data caches and reload the data
		if(isNewRequest){
			app.dataTempObject = {};
		}
		app.dataTempObject[uri] = app.dataTempObject[uri] || {};
		var tempObj = app.dataTempObject[uri];
		console.log("app DEBUG: calling " + url);
		if(tempObj.url == tempUrl){
			console.log("app DEBUG: saved url, use cache");
			dfd.resolve(tempObj.data);
		}else{
			var innerDfd = $.Deferred();
			console.log("app DEBUG: calling Type GET");
			jQuery.ajax({
				type: "GET",
	            url: url,
	            async: true,
	            dataType: "json",
	            traditional:true,
	            data:paramData
	        }).success(function(data){
	        	innerDfd.resolve(data);
	        }).fail(function(jxhr,arg2){
	        	try {
		        	if (jxhr.responseText){
		        		console.log("app WARNING: json not well formatted, falling back to JS eval");
		        		var data = eval("(" + jxhr.responseText + ")");
		        		innerDfd.resolve(data);	
		        	}else{
		        		innerDfd.fail("cannot get " + url + " : " + arg2);
			        	throw "app EXCEPTION: Cannot get content for ";
		        	}
	        	}catch (ex){
	        		
	        		console.log("app ERROR: " + ex + " Fail parsing JSON for url: " + url + "\nContent received:\n" + jxhr.responseText);
	        		innerDfd.fail("app ERROR: Cannot get JSON from " + url);
	        	}
	        });
			
			innerDfd.done(function(data){
				if(typeof app.dataTempObject[uri] == "undefined"){
					app.dataTempObject[uri] = {};
				}
				app.dataTempObject[uri].data = data;
				app.dataTempObject[uri].url = tempUrl;
				dfd.resolve(app.dataTempObject[uri].data);
			});
		}
        
        return dfd.promise();		
	}
	
	
	app.getSummary = function(reportType,dataType,isNewRequest){
		var url;
		var paramData = {};		
		url = "data/getChartReport.jso";
		
		return app.getJsonData(url,isNewRequest,paramData);
	}
	
	app.buildTempUrl=function(url,paramData){
		var uri = new String(url);
		for(k in paramData){
			if(typeof paramData[k] =="object"){
				for(var i=0;i<paramData[k].length; i++){
					uri += "&" + k+"="+paramData[k][i];
				}
			}else{
				uri += "&" + k+"="+paramData[k];
			}
		}
		return uri;
	}

})(jQuery);
