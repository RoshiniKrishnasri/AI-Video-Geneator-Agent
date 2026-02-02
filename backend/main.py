from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio

from script_generator import generate_script
from scene_planner import create_scenes
from image_generator import generate_images
from voice_generator import generate_voice
from video_builder import build_video
from caption_generator import generate_captions

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class VideoRequest(BaseModel):
    topic: str
    description: str
    duration: int
    tone: str
    voice: str
    language: str


def send_progress(step: int, message: str, total_steps: int = 5):
    """Create a progress event"""
    return f"data: {json.dumps({'step': step, 'total': total_steps, 'message': message})}\n\n"


@app.post("/generate")
async def generate_video_endpoint(data: VideoRequest):
    """Stream progress updates while generating video"""

    async def generate_with_progress():
        try:
            # Step 1: Generate script
            yield send_progress(1, "Writing your script...")
            await asyncio.sleep(0.1)  # Allow event to send
            script = generate_script(data)

            # Step 2: Create scenes
            yield send_progress(2, "Planning scenes...")
            await asyncio.sleep(0.1)
            scenes = create_scenes(script, data.duration)

            # Step 3: Generate images
            yield send_progress(3, f"Creating {len(scenes)} visuals...")
            await asyncio.sleep(0.1)
            images = generate_images(scenes)

            # Step 4: Generate voice
            yield send_progress(4, "Recording narration...")
            await asyncio.sleep(0.1)
            audio = generate_voice(scenes, data.voice)

            # Step 5: Build video
            yield send_progress(5, "Assembling your video...")
            await asyncio.sleep(0.1)
            video_path = build_video(images, audio, scenes)

            # Generate captions
            captions = generate_captions(scenes)

            if video_path:
                result = {
                    "done": True,
                    "success": True,
                    "script": script,
                    "scenes": scenes,
                    "video_url": f"http://localhost:8000/{video_path}",
                    "captions": captions
                }
            else:
                result = {
                    "done": True,
                    "success": False,
                    "error": "Failed to generate video"
                }

            yield f"data: {json.dumps(result)}\n\n"

        except Exception as e:
            print(f"Error in generate_video_endpoint: {e}")
            yield f"data: {json.dumps({'done': True, 'success': False, 'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_with_progress(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
