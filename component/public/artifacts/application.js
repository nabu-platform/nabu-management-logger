application.configuration.modules.push(function($services) {
	var index = $services.manager.index();
	nabu.utils.ajax({
		method: "get",
		url: "${server.root()}api/logger/server",
		success: function(response) {
			if (response.responseText) {
				var response = JSON.parse(response.responseText);
				var groups = {};
				if (response.servers && response.servers.length) {
					for (var i = 0; i < response.servers.length; i++) {
						if (!groups[response.servers[i].serverGroup]) {
							groups[response.servers[i].serverGroup] = [];
						}
						groups[response.servers[i].serverGroup].push(response.servers[i].serverName);
					}
				}
				var push = function(parameters) {
					groupChildren.push({
						title: groups[key][i],
						handler: function() {
							application.services.router.route("serverLog", parameters);
						}
					});
				};
				var actions = [];
				for (var key in groups) {
					var groupChildren = [];
					for (var i = 0; i < groups[key].length; i++) {
						push({
							group: key,
							server: groups[key][i]
						});
					}
					actions.push({
						title: key,
						actions: groupChildren
					});
				}
				$services.manager.menu({
					title: "Server Logs",
					actions: actions,
					index: index
				});
			}
		}
	});
	$services.router.register({
		alias: "serverLog",
		enter: function(parameters) {
			console.log("PARAMS", parameters);
			return new application.views.ServerLog({ data: parameters });
		},
		url: "/server/log/{group}/{server}"
	});
});