"""
Shruhi Collections — Autonomous 24/7 AI Product Media & Video Showcase Agent
Created to ingest raw product image samples, extract exact garment pattern/fabric DNA,
and autonomously render 4K studio catalog plates, macro texture swatches, and 9:16 MP4 video reels.
"""

from .agent import ProductMediaAgent
from .model_synthesizer import synthesize_model_wearing_garment, has_human_model

__all__ = ["ProductMediaAgent", "synthesize_model_wearing_garment", "has_human_model"]
