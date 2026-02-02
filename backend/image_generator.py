import os
import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import textwrap


def generate_images(scenes):
    """
    Generate visually appealing images with modern design for each scene using PIL
    """
    paths = []

    # Create images directory if it doesn't exist
    os.makedirs("static/images", exist_ok=True)

    # Modern color themes (primary, secondary, accent)
    color_themes = [
        {"bg1": (99, 102, 241), "bg2": (79, 70, 229),
         "accent": (236, 72, 153)},    # Indigo/Pink
        {"bg1": (6, 182, 212), "bg2": (14, 116, 144),
         "accent": (250, 204, 21)},    # Cyan/Yellow
        {"bg1": (236, 72, 153), "bg2": (190, 24, 93),
         "accent": (139, 92, 246)},    # Pink/Purple
        {"bg1": (34, 197, 94), "bg2": (21, 128, 61),
         "accent": (59, 130, 246)},     # Green/Blue
        {"bg1": (251, 146, 60), "bg2": (234, 88, 12),
         "accent": (99, 102, 241)},    # Orange/Indigo
        {"bg1": (139, 92, 246), "bg2": (109, 40, 217),
         "accent": (6, 182, 212)},    # Purple/Cyan
    ]

    for s in scenes:
        try:
            # Create a 1080x1920 image (vertical format for shorts)
            width, height = 1080, 1920

            # Choose theme for this scene
            theme = color_themes[s['scene_id'] % len(color_themes)]

            # Create base image
            image = Image.new('RGB', (width, height))
            draw = ImageDraw.Draw(image)

            # Draw gradient background
            for y in range(height):
                ratio = y / height
                r = int(theme['bg1'][0] * (1 - ratio) +
                        theme['bg2'][0] * ratio)
                g = int(theme['bg1'][1] * (1 - ratio) +
                        theme['bg2'][1] * ratio)
                b = int(theme['bg1'][2] * (1 - ratio) +
                        theme['bg2'][2] * ratio)
                draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

            # Add decorative elements
            add_decorative_shapes(draw, width, height, theme)

            # Add floating particles/dots
            add_particles(draw, width, height, theme)

            # Load fonts
            try:
                title_font = ImageFont.truetype("arial.ttf", 72)
                text_font = ImageFont.truetype("arial.ttf", 52)
                small_font = ImageFont.truetype("arial.ttf", 36)
            except:
                title_font = ImageFont.load_default()
                text_font = ImageFont.load_default()
                small_font = ImageFont.load_default()

            # Add scene number badge
            badge_y = 120
            badge_text = f"0{s['scene_id']}" if s['scene_id'] < 10 else str(
                s['scene_id'])
            draw_rounded_badge(draw, 80, badge_y, badge_text,
                               theme['accent'], title_font)

            # Add main text with text box
            text = s['text'][:200]  # Limit text length
            wrapped_lines = textwrap.wrap(text, width=28)

            # Calculate text box dimensions
            line_height = 70
            text_box_height = len(wrapped_lines) * line_height + 100
            text_box_y = height // 2 - text_box_height // 2

            # Draw semi-transparent text background
            draw_text_box(draw, 60, text_box_y, width - 120,
                          text_box_height, (0, 0, 0, 120))

            # Draw text lines
            y_offset = text_box_y + 50
            for line in wrapped_lines:
                # Shadow
                draw.text((104, y_offset + 3), line,
                          fill=(0, 0, 0, 150), font=text_font)
                # Main text
                draw.text((100, y_offset), line, fill=(
                    255, 255, 255), font=text_font)
                y_offset += line_height

            # Add bottom branding
            draw.text((width // 2 - 80, height - 120), "Clipify",
                      fill=(255, 255, 255, 180), font=small_font)

            # Save image
            image_path = f"static/images/scene_{s['scene_id']}.png"
            image.save(image_path, 'PNG', quality=95)

            paths.append(image_path)
            print(f"Generated image for scene {s['scene_id']}")

        except Exception as e:
            print(f"Error generating image for scene {s['scene_id']}: {e}")
            # Create a simple fallback image
            try:
                image = Image.new('RGB', (1080, 1920), color=(100, 100, 100))
                image_path = f"static/images/scene_{s['scene_id']}.png"
                image.save(image_path, 'PNG')
                paths.append(image_path)
            except:
                paths.append(None)

    return paths


def add_decorative_shapes(draw, width, height, theme):
    """Add modern decorative shapes to the background"""
    accent = theme['accent']

    # Large circle in top right (semi-transparent)
    circle_color = (accent[0], accent[1], accent[2], 40)
    draw.ellipse([width - 400, -200, width + 200, 400], fill=circle_color)

    # Large circle in bottom left
    draw.ellipse([-300, height - 500, 400, height + 200], fill=circle_color)

    # Smaller decorative circles
    for _ in range(5):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(50, 150)
        opacity = random.randint(20, 50)
        color = (accent[0], accent[1], accent[2], opacity)
        draw.ellipse([x, y, x + size, y + size], fill=color)

    # Add some lines for visual interest
    line_color = (255, 255, 255, 15)
    for i in range(3):
        y = 400 + i * 500
        draw.line([(0, y), (width, y + 100)], fill=line_color, width=2)


def add_particles(draw, width, height, theme):
    """Add floating particle dots"""
    for _ in range(30):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(3, 8)
        opacity = random.randint(100, 200)
        draw.ellipse([x, y, x + size, y + size], fill=(255, 255, 255, opacity))


def draw_rounded_badge(draw, x, y, text, color, font):
    """Draw a rounded badge with text"""
    badge_width = 140
    badge_height = 80

    # Draw badge background
    draw.rounded_rectangle(
        [x, y, x + badge_width, y + badge_height],
        radius=20,
        fill=color
    )

    # Draw text centered in badge
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = x + (badge_width - text_width) // 2
    text_y = y + (badge_height - text_height) // 2 - 5
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)


def draw_text_box(draw, x, y, width, height, color):
    """Draw a semi-transparent text box with rounded corners"""
    # Create a separate image for transparency
    draw.rounded_rectangle(
        [x, y, x + width, y + height],
        radius=30,
        fill=(20, 20, 30, 180)
    )
