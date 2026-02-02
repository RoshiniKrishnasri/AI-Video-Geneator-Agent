import os
from gtts import gTTS


def generate_voice(scenes, voice_type="female"):
    """
    Generate voice narration for each scene using gTTS (Google Text-to-Speech)
    """
    paths = []

    # Create audio directory if it doesn't exist
    os.makedirs("static/audio", exist_ok=True)

    # gTTS uses language codes
    lang = 'en'  # English

    for s in scenes:
        try:
            speech_file_path = f"static/audio/scene_{s['scene_id']}.mp3"

            # Generate speech
            tts = gTTS(text=s['text'], lang=lang, slow=False)
            tts.save(speech_file_path)

            paths.append(speech_file_path)
            print(f"Generated audio for scene {s['scene_id']}")

        except Exception as e:
            print(f"Error generating voice for scene {s['scene_id']}: {e}")
            paths.append(None)
    return paths
