import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: {
        targets: targets()
          .pushIf(!app.inProduction, targets.pretty())
          .pushIf(app.inProduction, targets.file({ destination: 1 }))
          .toArray(),
      },
    },
    slack: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info'),
      icon: 'boom',
      url: env.get('LOG_SLACK_WEBHOOK_URL'),
      redact: {
        paths: ['password', '*.password']
      },
      transport: {
        targets: targets()
        .pushIf(!app.inProduction, targets.pretty())
        .pushIf(app.inProduction, targets.file({ destination: 1 }))
        .push({
          target: '@youngkiu/pino-slack-webhook',
          level: 'info',
          options: {
            webhookUrl: env.get('LOG_SLACK_WEBHOOK_URL'),
            channel: '#error_notifications',
            username: 'webhookbot',
            icon_emoji: ':ghost:'
          }
        })
        .toArray()
      }
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
