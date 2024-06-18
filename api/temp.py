import torch
from diffusers import StableDiffusionPipeline

# Load the Stable Diffusion model from Hugging Face
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", torch_dtype=torch.float16)
pipe = pipe.to("cuda")

# Define the prompt for the image generation
prompt = "a dynamic, stylized anime character in action pose with a hat, dramatic lighting, cloudy background"

# Generate the image
image = pipe(prompt, guidance_scale=7.5).images[0]

# Save the generated image
image.save("generated_image.png")
