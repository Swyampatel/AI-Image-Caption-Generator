from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch

# Load model & processor once to avoid reloading on every request
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to("cpu")

def generate_caption(image_path):
    print(f"Processing image: {image_path}")  # Debugging

    try:
        image = Image.open(image_path).convert("RGB")
        print("Image loaded successfully")  # Debugging
    except Exception as e:
        raise ValueError(f"Error loading image: {str(e)}")

    try:
        inputs = processor(image, return_tensors="pt")
        print("Model input prepared")  # Debugging

        output = model.generate(**inputs, attention_mask=inputs["attention_mask"])
        caption = processor.decode(output[0], skip_special_tokens=True)

        print(f"Generated Caption: {caption}")  # Debugging
        return caption
    except Exception as e:
        raise RuntimeError(f"Error generating caption: {str(e)}")
