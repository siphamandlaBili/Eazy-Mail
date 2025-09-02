import OpenAI from 'openai';

const summarizeVideo = async (videoPath) => {
  try {
    // Transcribe audio using OpenAI Whisper
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const transcription = await openai.audio.transcriptions.create({
      file: videoPath,
      model: 'whisper-1',
    });

    // Summarize transcription
    const summary = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Summarize the following text:' },
        { role: 'user', content: transcription.text },
      ],
    });

    return summary.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing video:', error);
    throw error;
  }
};

export default summarizeVideo;
