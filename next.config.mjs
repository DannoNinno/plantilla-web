//@ts-check

import bundleAnalyzerLoader from '@next/bundle-analyzer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const withBundleAnalyzer = bundleAnalyzerLoader({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.hbs': ['raw-loader'],
      },
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__filename, 'src', 'styles')],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      /**
       * @type {import('webpack').RuleSetRule}
       */
      const rule = {
        test: /(\.hbs|\.handlebars)$/i,
        loader: 'handlebars-loader',
        type: 'javascript/auto',
      }

      config?.module?.rules?.push?.(rule) ?? (config.module.rules = [rule])
    }

    return config
  },
}

export default withBundleAnalyzer(nextConfig)