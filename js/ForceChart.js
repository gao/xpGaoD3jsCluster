;(function() {

    (function ($) {
        brite.registerView("ForceChart",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-ForceChart");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function () {
                var view = this;
                var $e = view.$el;
                
                var $container = $e.find(".ForceChartSummary");
                //clear container
				$container.empty();
				$container.append("<div class='fstCon'></div>");
				
				var data = {};
				data.name = "UserA";
				data.children = [];
				
				//generate data,weight between 1 and 10
				for(var i=0; i< 30 ;i++){
					var weight = RandomData(1,10);
					data.children.push({"name": "User"+i,"weightVal":weight});
				}
				var dataAll = {};
				dataAll.data = data;
			
				app.DrawD3Chart("forceChart","fstCon",dataAll,{});
			}
        });
        
        // --------- Private Method --------- //
		function RandomData(under, over){ 
			return parseInt(Math.random()*(over-under) + under); 
		}
		// --------- /Private Method --------- //
        
    })(jQuery);
})();
