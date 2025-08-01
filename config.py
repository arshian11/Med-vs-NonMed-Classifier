# config.py - Configuration settings

# Model paths
CNN_MODEL_PATH = "checkpoints/cnn_model.pth"
VIT_MODEL_PATH = "checkpoints/vit_model.pth"

# Model selection - choose which model to use
MODEL_TYPE = "cnn"  # Options: "cnn" or "vit"

# Image processing settings
IMAGE_SIZE = (224, 224)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# ViT specific settings
VIT_PATCH_SIZE = 32
VIT_MODEL_NAME = 'vit_small_patch32_224'

# PDF processing settings
PDF_DPI = 200

# Web scraping settings
REQUEST_TIMEOUT = 30
IMAGE_TIMEOUT = 10