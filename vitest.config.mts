import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.jsonc' },
				miniflare: {
					bindings: {
						SLACK_SIGNING_SECRET: 'test-signing-secret',
						SLACK_BOT_TOKEN: 'xoxb-test-token',
					},
				},
			},
		},
	},
});
