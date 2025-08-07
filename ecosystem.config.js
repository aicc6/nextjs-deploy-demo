module.exports = {
  apps: [
    {
      name: 'nextjs-deploy-demo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1, // 단일 인스턴스로 시작
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 9000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 9000
      },
      // 로그 파일을 사용자 홈 디렉토리에 저장
      error_file: '~/.pm2/logs/nextjs-deploy-demo-error.log',
      out_file: '~/.pm2/logs/nextjs-deploy-demo-out.log',
      log_file: '~/.pm2/logs/nextjs-deploy-demo-combined.log',
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