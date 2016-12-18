application.services.router.register({
	alias: "serverLog",
	enter: function(parameters) {
		console.log("PARAMS", parameters);
		return new application.views.ServerLog({ data: parameters });
	},
	url: "/server/log/{group}/{server}"
});