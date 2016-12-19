application.views.ServerLog = Vue.extend({
	props: ["group", "server"],
	template: "#serverLog",
	data: function() {
		return {
			until: new Date(),
			toId: null,
			fromId: null,
			logs: [],
			timeout: null
		};
	},
	activate: function(done) {
		this.loadUntil().then(function() {
			done();
		});
	},
	beforeDestroy: function() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	},
	methods: {
		loadUntil: function() {
			var self = this;
			console.log("SCROLL", self.$document.body.scrollHeight, self.$document.body.scrollTop, self.$document.body.scrollHeight - self.$document.body.scrollTop, self.$document.body.clientHeight);
			return nabu.utils.ajax({
				method: "get", 
				url: "${server.root()}api/logger/log/" + self.server + "?until=" + self.until.toISOString() + (self.toId ? "&toId=" + self.toId : ""),
				success: function(response) {
					var following = self.$document.body.scrollHeight - self.$document.body.scrollTop == self.$document.body.clientHeight;
					if (response.responseText) {
						//var following = self.$el.scrollHeight == self.$el.offsetHeight;
						var result = JSON.parse(response.responseText);
						self.toId = result.logs[0].id;
						result.logs.reverse();
						if (self.fromId == null) {
							self.fromId = result.logs[0].id;
						}
						nabu.utils.arrays.merge(self.logs, result.logs);
						if (following) {
							console.log("FOLLOWING!", self.$window, self.$document.body.scrollHeight);
							//self.$document.body.scrollTop = self.$document.body.scrollHeight;
							self.$window.scrollTo(0, self.$document.body.scrollHeight);
							//self.$window.scroll(0, self.$document.body.scrollHeight + 50);
						}
					}
					// do the scroll with a certain delay so it has time to render...
					if (following) {
						setTimeout(function() {
							self.$window.scrollTo(0, self.$document.body.scrollHeight);
						}, 50);
					}
					self.timeout = setTimeout(function() {
						self.until = new Date();
						self.loadUntil();
					}, 5000);
				}
			});
		},
		goBack: function() {
			var self = this;
			if (self.fromId) {
				return nabu.utils.ajax({
					method: "get", 
					url: "${server.root()}api/logger/log/" + self.server + "?fromId=" + self.fromId,
					success: function(response) {
						if (response.responseText) {
							var result = JSON.parse(response.responseText);
							result.logs.reverse();
							self.fromId = result.logs[0].id;
							console.log("INJECTINg", result.logs);
							self.logs.splice.bind(self.logs, 0, 0).apply(self.logs, result.logs);
						}
					}
				});
			}
		}
	}
});