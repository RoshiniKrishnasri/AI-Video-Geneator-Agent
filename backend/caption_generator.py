def generate_captions(scenes):
    captions = []
    for s in scenes:
        captions.append({
            "scene": s["scene_id"],
            "text": s["text"]
        })
    return captions
