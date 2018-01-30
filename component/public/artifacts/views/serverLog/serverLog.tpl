<template id="serverLog">
	<div class="serverLog">
		<div class="buttons">
			<button v-on:click="goBack">older</button>
		</div>
		<div class="log" v-for="log in logs" :class="{ 'bad': log.severity == 'ERROR', 'neutral': log.severity == 'WARNING'}">
			<span class="logged">{{ new Date(log.logged).toLocaleString() }}</span>
			<span class="errorCode" v-if="log.errorCode">[{{ log.errorCode }}]</span>
			<span class="log-message" :class="{ 'bad': log.severity == 'ERROR', 'neutral': log.severity == 'WARNING'}">{{ log.message }}</span>
			<pre v-if="log.description" class="description" :class="{ 'bad': log.severity == 'ERROR', 'neutral': log.severity == 'WARNING'}">{{ log.description }}</pre>
		</div>
	</div>
</template>