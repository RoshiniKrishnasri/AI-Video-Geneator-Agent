import os
try:
    # MoviePy 2.x
    from moviepy import ImageClip, AudioFileClip, concatenate_videoclips
    MOVIEPY_V2 = True
except ImportError:
    # MoviePy 1.x
    from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
    MOVIEPY_V2 = False


def build_video(images, audio_files, scenes):
    """
    Build final video using moviepy by combining images and audio
    """
    try:
        # Create videos directory if it doesn't exist
        os.makedirs("static/videos", exist_ok=True)

        clips = []

        for i, (img_path, audio_path, scene) in enumerate(zip(images, audio_files, scenes)):
            try:
                # Check if files exist
                if not os.path.exists(img_path):
                    print(
                        f"Warning: Image {img_path} not found, skipping scene {i+1}")
                    continue

                if not os.path.exists(audio_path):
                    print(
                        f"Warning: Audio {audio_path} not found, skipping scene {i+1}")
                    continue

                # Load audio to get duration
                audio = AudioFileClip(audio_path)
                duration = audio.duration

                # Create image clip with same duration as audio
                # MoviePy 2.x uses with_duration, 1.x uses set_duration
                if MOVIEPY_V2:
                    img_clip = ImageClip(img_path).with_duration(duration)
                    video_clip = img_clip.with_audio(audio)
                else:
                    img_clip = ImageClip(img_path).set_duration(duration)
                    video_clip = img_clip.set_audio(audio)

                clips.append(video_clip)
                print(
                    f"Added scene {i+1} to video (duration: {duration:.2f}s)")

            except Exception as e:
                print(f"Error processing scene {i+1}: {e}")
                continue

        if not clips:
            raise Exception("No valid clips were created")

        # Concatenate all clips
        final_video = concatenate_videoclips(clips, method="compose")

        # Export final video
        output_path = "static/videos/final_video.mp4"
        final_video.write_videofile(
            output_path,
            fps=24,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True
        )

        # Clean up
        final_video.close()
        for clip in clips:
            clip.close()

        print(f"Video successfully created: {output_path}")
        return output_path

    except Exception as e:
        print(f"Error building video: {e}")
        return None
