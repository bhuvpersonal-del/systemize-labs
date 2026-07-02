import * as fs from 'fs';
import * as path from 'path';

function generateWav() {
  const sampleRate = 44100;
  const duration = 4.0; // 4 seconds
  const numSamples = sampleRate * duration;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;

  const buffer = Buffer.alloc(fileSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length
  buffer.writeUInt32LE(fileSize - 8, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (raw PCM)
  buffer.writeUInt16LE(1, 20);
  // channel count
  buffer.writeUInt16LE(numChannels, 22);
  // sample rate
  buffer.writeUInt32LE(sampleRate, 24);
  // byte rate
  buffer.writeUInt32LE(byteRate, 28);
  // block align
  buffer.writeUInt16LE(blockAlign, 32);
  // bits per sample
  buffer.writeUInt16LE(bitsPerSample, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(dataSize, 40);

  // Write PCM audio samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Create a beautiful warm AI notification chime:
    // A combination of C5 (523.25 Hz), E5 (659.25 Hz), and G5 (783.99 Hz)
    // with a soft attack and smooth exponential decay.
    const f1 = 523.25;
    const f2 = 659.25;
    const f3 = 783.99;
    
    // Attack-Decay envelope
    let envelope = 0;
    if (t < 0.15) {
      // Smooth attack over 150ms
      envelope = t / 0.15;
    } else {
      // Exponential decay
      envelope = Math.exp(-1.2 * (t - 0.15));
    }
    
    // Synthesize the waveform
    const sampleVal = (
      Math.sin(2 * Math.PI * f1 * t) * 0.4 +
      Math.sin(2 * Math.PI * f2 * t) * 0.3 +
      Math.sin(2 * Math.PI * f3 * t) * 0.3
    ) * envelope;
    
    // Scale to 16-bit signed integer range [-32768, 32767]
    const intVal = Math.floor(sampleVal * 16000); // keep volume safe and clear
    
    buffer.writeInt16LE(intVal, offset);
    offset += 2;
  }

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'demo-voice.mp3'), buffer);
  console.log('Successfully generated clean audio chime to /public/demo-voice.mp3');
}

generateWav();
