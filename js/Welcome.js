;(function() {

    (function ($) {
        brite.registerView("Welcome",  {
			emptyParent : true,
			parent:".MainScreen-main"
		}, {
        	create:function (data, config) {
                var $html = app.render("tmpl-Welcome");
               	var $e = $($html);
                return $e;
            },
            postDisplay:function (data, config) {
                var view = this;
                var $e = view.$el;
                
                d3.select(".Welcome")
			      .style("width", "0%")
			      .style("background-color", "steelblue")
			      .text("Welcome to the D3JS Chart Demo!")
		    	  .transition()
			      .ease("bounce")
			      .duration(2000)
			      .style("width", "100%")
			      .style("background-color", "brown");
			}
        });
        
    })(jQuery);
})();
