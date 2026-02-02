def create_scenes(script, duration):
    sentences = script.split(".")
    scenes = []
    time_per_scene = max(3, duration // len(sentences))

    for i, text in enumerate(sentences):
        if text.strip():
            scenes.append({
                "scene_id": i + 1,
                "text": text.strip(),
                "duration": time_per_scene
            })
    return scenes
