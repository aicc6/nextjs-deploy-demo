#!/usr/bin/env node

const http = require('http');
const https = require('https');

const args = process.argv.slice(2);
const url = args[0] || 'http://localhost:3000/api/health';
const maxRetries = parseInt(args[1]) || 5;
const retryDelay = parseInt(args[2]) || 5000; // milliseconds

const isHttps = url.startsWith('https');
const client = isHttps ? https : http;

async function checkHealth(attempt = 1) {
    return new Promise((resolve, reject) => {
        console.log(`Health check attempt ${attempt}/${maxRetries}: ${url}`);
        
        const request = client.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ Health check passed (${res.statusCode})`);
                    try {
                        const json = JSON.parse(data);
                        console.log('Response:', json);
                    } catch (e) {
                        console.log('Response:', data);
                    }
                    resolve(true);
                } else {
                    console.log(`❌ Health check failed (${res.statusCode})`);
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });
        
        request.on('error', (err) => {
            console.error(`❌ Health check error: ${err.message}`);
            reject(err);
        });
        
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function performHealthCheck() {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            await checkHealth(i);
            console.log('🎉 Application is healthy!');
            process.exit(0);
        } catch (error) {
            console.error(`Attempt ${i} failed:`, error.message);
            
            if (i < maxRetries) {
                console.log(`Waiting ${retryDelay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    
    console.error(`💀 Health check failed after ${maxRetries} attempts`);
    process.exit(1);
}

// Start health check
performHealthCheck();