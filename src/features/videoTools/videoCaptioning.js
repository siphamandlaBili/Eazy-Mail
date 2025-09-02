import OpenAI from 'openai';

const generateCaptions = async (videoPath) => {
  try {
    // Transcribe audio using OpenAI Whisper
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const transcription = await openai.audio.transcriptions.create({
      file: videoPath,
      model: 'whisper-1',
    });

    // Format transcription into captions
    const captions = transcription.segments.map((segment) => {
      return `${segment.start} --> ${segment.end}\n${segment.text}`;
    }).join('\n\n');

    return captions;
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
};

export default generateCaptions;
