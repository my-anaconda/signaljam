// One-shot generator for a short metronome click WAV.
// Run with: node scripts/gen-click.js
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION_S = 0.06; // 60ms
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_S);
const FREQ_HZ = 2000;
const DECAY = 35; // exponential decay rate

const samples = new Int16Array(NUM_SAMPLES);
for (let i = 0; i < NUM_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  const env = Math.exp(-DECAY * t);
  const s = Math.sin(2 * Math.PI * FREQ_HZ * t) * env;
  samples[i] = Math.max(-1, Math.min(1, s)) * 32767;
}

const dataSize = samples.length * 2;
const buf = Buffer.alloc(44 + dataSize);
let o = 0;
buf.write('RIFF', o); o += 4;
buf.writeUInt32LE(36 + dataSize, o); o += 4;
buf.write('WAVE', o); o += 4;
buf.write('fmt ', o); o += 4;
buf.writeUInt32LE(16, o); o += 4;
buf.writeUInt16LE(1, o); o += 2;          // PCM
buf.writeUInt16LE(1, o); o += 2;          // channels
buf.writeUInt32LE(SAMPLE_RATE, o); o += 4;
buf.writeUInt32LE(SAMPLE_RATE * 2, o); o += 4;
buf.writeUInt16LE(2, o); o += 2;          // block align
buf.writeUInt16LE(16, o); o += 2;         // bits per sample
buf.write('data', o); o += 4;
buf.writeUInt32LE(dataSize, o); o += 4;
for (let i = 0; i < samples.length; i++) {
  buf.writeInt16LE(samples[i], 44 + i * 2);
}

const outDir = path.resolve(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'click.wav');
fs.writeFileSync(outPath, buf);
console.log('Wrote', outPath, '(' + buf.length + ' bytes)');
