# utils/model.py - Model definition and loading with support for both CNN and ViT

import torch
import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights
from torchvision import transforms
from config import CNN_MODEL_PATH, VIT_MODEL_PATH, IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD, MODEL_TYPE


class SimpleCNN(nn.Module):
    def __init__(self, pretrained=True):
        super().__init__()
        if pretrained:
            self.base = resnet18(weights=ResNet18_Weights.DEFAULT)
        else:
            self.base = resnet18(weights=None)
        self.base.fc = nn.Linear(self.base.fc.in_features, 1)

    def forward(self, x):
        return self.base(x).squeeze(1)


def load_cnn_model(device):
    """Load the trained SimpleCNN model"""
    model = SimpleCNN(pretrained=False)
    model.load_state_dict(torch.load(CNN_MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    return model


def preprocess_image_cnn(image, model):
    """Preprocess image for CNN model inference"""
    transform = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
    ])
    return transform(image.convert("RGB")).unsqueeze(0).to(next(model.parameters()).device)


def classify_image_cnn(image, model):
    """Classify a single image using CNN model"""
    tensor = preprocess_image_cnn(image, model)
    with torch.no_grad():
        output = model(tensor)
        prob = torch.sigmoid(output).item()
        return "medical" if prob >= 0.5 else "non-medical", prob


# Generic functions that work with the selected model type
def load_model(device, model_type=None):
    """Load the specified model type"""
    if model_type is None:
        model_type = MODEL_TYPE
    
    if model_type.lower() == "cnn":
        print(f"🤖 Loading CNN model from: {CNN_MODEL_PATH}")
        return load_cnn_model(device)
    elif model_type.lower() == "vit":
        print(f"🤖 Loading ViT model from: {VIT_MODEL_PATH}")
        from utils.vit_model import load_vit_model
        return load_vit_model(device)
    else:
        raise ValueError(f"Unknown model type: {model_type}. Choose 'cnn' or 'vit'")


def preprocess_image(image, model):
    """Preprocess image based on the current model type"""
    if MODEL_TYPE.lower() == "cnn":
        return preprocess_image_cnn(image, model)
    elif MODEL_TYPE.lower() == "vit":
        from utils.vit_model import preprocess_image_vit
        return preprocess_image_vit(image, model)
    else:
        raise ValueError(f"Unknown model type: {MODEL_TYPE}")


def classify_image(image, model):
    """Classify a single image based on the current model type"""
    if MODEL_TYPE.lower() == "cnn":
        return classify_image_cnn(image, model)
    elif MODEL_TYPE.lower() == "vit":
        from utils.vit_model import classify_image_vit
        return classify_image_vit(image, model)
    else:
        raise ValueError(f"Unknown model type: {MODEL_TYPE}")