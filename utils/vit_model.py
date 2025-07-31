# utils/vit_model.py - Vision Transformer model definition and loading

import torch
import torch.nn as nn
import timm
from torchvision import transforms
from config import VIT_MODEL_PATH, IMAGE_SIZE, VIT_MODEL_NAME,IMAGENET_MEAN, IMAGENET_STD


# class ViTClassifier(nn.Module):
#     def __init__(self, pretrained=True):
#         super().__init__()
#         if pretrained:
#             self.vit = timm.create_model(VIT_MODEL_NAME, pretrained=True)
#         else:
#             self.vit = timm.create_model(VIT_MODEL_NAME, pretrained=False)
        
#         # Reset classifier for binary classification
#         self.vit.reset_classifier(num_classes=1) # type: ignore

#     def forward(self, x):
#         return self.vit(x).squeeze(1)


def load_vit_model(device):
    """Load the trained ViT model"""
    model = timm.create_model(VIT_MODEL_NAME, pretrained=False)
    model.reset_classifier(num_classes=1) # type: ignore
    model.load_state_dict(torch.load(VIT_MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    return model


def preprocess_image_vit(image, model):
    """Preprocess image for ViT model inference"""
    # ViT models often use different normalization
    transform = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD) 
    ])
    return transform(image.convert("RGB")).unsqueeze(0).to(next(model.parameters()).device)


def classify_image_vit(image, model):
    """Classify a single image using ViT model"""
    tensor = preprocess_image_vit(image, model)
    with torch.no_grad():
        output = model(tensor)
        prob = torch.sigmoid(output).item()
        return "medical" if prob >= 0.5 else "non-medical", prob