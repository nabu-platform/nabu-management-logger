application.initialize.modules.push(function() {
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
				var children = [];
				for (var key in groups) {
					var groupChildren = [];
					for (var i = 0; i < groups[key].length; i++) {
						var parameters = {
							group: key,
							server: groups[key][i]
						};
						groupChildren.push({
							title: groups[key][i],
							handle: function() {
								application.services.router.route("serverLog", parameters);
							}
						})
					}
					children.push({
						title: key,
						children: groupChildren
					});
				}
				application.services.vue.menu.push({
					title: "Server Logs",
					children: children
				});
			}
		}
	});
	
});