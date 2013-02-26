;(function() {

    (function ($) {
        brite.registerView("ClusterChart",  {
        	loadTmpl : true,
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-ClusterChart");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function (data, config) {
                var view = this;
                var $e = view.$el;
                
                var viewName = "summary";
				view.viewName = viewName;
				view.reportType = "BATCH";
                
                view.showView(viewName);
			},
			
			getAllData: function(viewBy){
				var view = this;
				var dfd = $.Deferred();
				app.getSummary(view.reportType,"common",viewBy).done(function(data){
					var dataSet = {};
					if(data.items!=null){
						dataSet = data.items[0];
					}
					dfd.resolve(dataSet);
				});
				return dfd.promise();
			},
			
			showView: function(){
				var view = this;
				var $e = view.$el;
				
				//clean first
				$e.bEmpty();
				var html;
				if(view.viewName == 'summary'){
					html = app.render("tmpl-ClusterChart-Summary")
				}else{
					return false;
				}
		
				$e.append($(html));
				
				
				view.getAllData("day").done(function(dataAll){
					showSummaryView.call(view,dataAll);
				});
				
				return true;
			}
        });
        
        function showSummaryView(dataAll){
        	var data = dataAll.data
        	var view = this;
			var $e = view.$el;
        	var $container = $e.find(".ClusterChartSummary");
        	if(typeof dataAll == "undefined"){
				$container.html("");
				$container.append("<div class='noData'>No Data!</div>");
			}else{
				//clear container
				$container.empty();
				$container.append("<div class='fstCon'></div>");
			
				app.DrawD3Chart("clusterChart","fstCon",dataAll,{});
			}
		}
        
    })(jQuery);
})();
