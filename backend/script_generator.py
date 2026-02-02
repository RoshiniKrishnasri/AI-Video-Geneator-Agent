def generate_script(data):
    """
    Generate a video script based on user input
    """
    try:
        # Create a script based on the topic and description
        script_parts = []

        # Introduction
        script_parts.append(f"Welcome to {data.topic}")

        # Main content from description
        if data.description:
            # Split description into sentences
            sentences = [s.strip() for s in data.description.replace(
                '!', '.').replace('?', '.').split('.') if s.strip()]
            # Limit to 5 sentences for short videos
            script_parts.extend(sentences[:5])

        # Closing based on tone
        if data.tone.lower() == "motivational":
            script_parts.append("You can achieve great things")
        elif data.tone.lower() == "informative":
            script_parts.append("Now you know more about this topic")
        elif data.tone.lower() == "storytelling":
            script_parts.append("And that's the story")
        else:
            script_parts.append("Thanks for watching")

        script = ". ".join(script_parts) + "."
        return script

    except Exception as e:
        print(f"Error generating script: {e}")
        return f"This video is about {data.topic}. {data.description}. The tone is {data.tone}."
