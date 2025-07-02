#!/usr/bin/env node

/**
 * Performance Check Script
 * Monitors bundle size and generates performance metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PERF_LOG_FILE = '.performance-history.json';
const BUNDLE_SIZE_LIMIT = 500; // KB warning threshold

function getFileSize(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return Math.round(stats.size / 1024); // Size in KB
  } catch (error) {
    return 0;
  }
}

function analyzeBundleSize() {
  const buildDir = '.next/static/chunks';
  
  if (!fs.existsSync(buildDir)) {
    console.warn('⚠️  Build directory not found. Run `pnpm build` first.');
    return null;
  }

  const chunks = fs.readdirSync(buildDir)
    .filter(file => file.endsWith('.js'))
    .map(file => ({
      name: file,
      size: getFileSize(path.join(buildDir, file))
    }))
    .sort((a, b) => b.size - a.size);

  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  
  return {
    chunks,
    totalSize,
    largestChunk: chunks[0],
    timestamp: new Date().toISOString()
  };
}

function loadPerformanceHistory() {
  try {
    if (fs.existsSync(PERF_LOG_FILE)) {
      return JSON.parse(fs.readFileSync(PERF_LOG_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('⚠️  Could not load performance history');
  }
  return [];
}

function savePerformanceHistory(history) {
  try {
    fs.writeFileSync(PERF_LOG_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('❌ Could not save performance history:', error.message);
  }
}

function generateReport(analysis) {
  console.log('\n📊 Performance Analysis Report');
  console.log('================================\n');
  
  if (!analysis) {
    console.log('❌ No build data available');
    return;
  }

  console.log(`📦 Total Bundle Size: ${analysis.totalSize} KB`);
  
  if (analysis.totalSize > BUNDLE_SIZE_LIMIT) {
    console.log(`⚠️  Warning: Bundle size exceeds ${BUNDLE_SIZE_LIMIT} KB threshold`);
  } else {
    console.log('✅ Bundle size is within acceptable limits');
  }
  
  console.log(`\n🎯 Largest Chunk: ${analysis.largestChunk.name} (${analysis.largestChunk.size} KB)\n`);
  
  console.log('📋 Top 5 Largest Chunks:');
  for (const [index, chunk] of analysis.chunks.slice(0, 5).entries()) {
    const icon = index === 0 ? '🔴' : index === 1 ? '🟡' : '🟢';
    console.log(`   ${icon} ${chunk.name}: ${chunk.size} KB`);
  }
}

function compareWithHistory(current, history) {
  if (history.length === 0) {
    console.log('\n📝 First performance measurement recorded');
    return;
  }
  
  const previous = history[history.length - 1];
  const sizeDiff = current.totalSize - previous.totalSize;
  const percentDiff = ((sizeDiff / previous.totalSize) * 100).toFixed(1);
  
  console.log('\n📈 Performance Trend:');
  
  if (sizeDiff > 0) {
    console.log(`📈 Bundle size increased by ${sizeDiff} KB (${percentDiff}%)`);
    if (sizeDiff > 50) {
      console.log('⚠️  Significant increase detected! Review recent changes.');
    }
  } else if (sizeDiff < 0) {
    console.log(`📉 Bundle size decreased by ${Math.abs(sizeDiff)} KB (${Math.abs(percentDiff)}%)`);
    console.log('✅ Great job on optimization!');
  } else {
    console.log('➡️  No change in bundle size');
  }
}

function printOptimizationTips() {
  console.log('\n💡 Optimization Tips:');
  console.log('• Run `pnpm analyze` to see detailed bundle composition');
  console.log('• Use dynamic imports for large libraries');
  console.log('• Check for duplicate dependencies');
  console.log('• Consider code splitting for routes');
  console.log('• Optimize images using Next.js Image component');
  console.log('• Remove unused dependencies and code');
}

function main() {
  console.log('🔍 Running Performance Check...\n');
  
  // Analyze current build
  const analysis = analyzeBundleSize();
  
  // Load and update history
  const history = loadPerformanceHistory();
  
  if (analysis) {
    // Generate report
    generateReport(analysis);
    
    // Compare with history
    compareWithHistory(analysis, history);
    
    // Update history
    history.push(analysis);
    
    // Keep only last 10 measurements
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    savePerformanceHistory(history);
  }
  
  // Show optimization tips
  printOptimizationTips();
  
  console.log('\n✨ Performance check complete!');
  console.log('📁 Detailed analysis available at: .next/analyze/client.html');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeBundleSize, generateReport };