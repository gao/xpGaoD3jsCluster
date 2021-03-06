;(function() {

    (function ($) {
        brite.registerView("ClusterChart",  {
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
                
                var $container = $e.find(".ClusterChartSummary");
                //clear container
				$container.empty();
				$container.append("<div class='fstCon'></div>");
				
				data = data || {};
				data.name = "User";
				data.children = [];
				
				//generate data,weight between 1 and 10
				for(var i=0; i< 30 ;i++){
					var weight = RandomData(1,10);
					data.children.push({"name": "User"+i,"weight":weight});
				}
				
				var dataAll = {};
				dataAll.data = data;
			
				app.DrawD3Chart("clusterChart","fstCon",dataAll,{});
                
			}
        });
        
        // --------- Private Method --------- //
		function RandomData(under, over){ 
			return parseInt(Math.random()*(over-under) + under); 
		}
		// --------- /Private Method --------- //
        
    })(jQuery);
})();
