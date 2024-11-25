module.exports = {
  apps: [{
    name: 'multimodel-chat',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/multimodel-chat/error.log',
    out_file: '/var/log/multimodel-chat/output.log',
    time: true
  }]
} 