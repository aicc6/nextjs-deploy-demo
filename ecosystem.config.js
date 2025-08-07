module.exports = {
  apps: [
    {
      name: 'nextjs-demo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max', // 클러스터 모드: CPU 코어 수만큼 인스턴스 생성
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/nextjs-demo-error.log',
      out_file: '/var/log/pm2/nextjs-demo-out.log',
      log_file: '/var/log/pm2/nextjs-demo-combined.log',
      time: true,
      merge_logs: true,
      
      // 애플리케이션 상태 모니터링
      min_uptime: '10s',
      max_restarts: 10,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // 애플리케이션 시작 후 health check
      post_update: [
        'npm install --production',
        'echo "Application updated and restarted"'
      ]
    }
  ],
  
  // PM2 배포 설정 (선택사항)
  deploy: {
    production: {
      user: 'deploy',
      host: ['production-server.example.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-org/nextjs-deploy-demo.git',
      path: '/var/www/nextjs-app',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: ['staging-server.example.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/nextjs-deploy-demo.git',
      path: '/var/www/nextjs-app-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    }
  }
};