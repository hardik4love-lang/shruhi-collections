"""
Command-Line Interface for Product Media Agent
Examples:
  python -m product_media_agent.cli --sample path/to/sample.jpg
  python -m product_media_agent.cli --batch-dir path/to/samples/ --with-videos
  python -m product_media_agent.cli --daemon
"""
import os
import argparse
from .agent import ProductMediaAgent
from .config import INCOMING_DIR

def main():
    parser = argparse.ArgumentParser(
        description="Shruhi Collections — Autonomous 24/7 AI Product Media & Video Showcase Agent"
    )
    parser.add_argument("--sample", type=str, help="Path to single product image sample to process")
    parser.add_argument("--code", type=str, default=None, help="Optional custom product code (e.g. SHRUHI-MS-101)")
    parser.add_argument("--title", type=str, default=None, help="Optional custom product title")
    parser.add_argument("--batch-dir", type=str, default=None, help="Directory containing product samples for batch processing")
    parser.add_argument("--daemon", action="store_true", help="Run 24/7 autonomous inbox watcher daemon")
    parser.add_argument("--inbox", type=str, default=INCOMING_DIR, help="Inbox directory for 24/7 daemon watcher")
    parser.add_argument("--with-videos", action="store_true", help="Generate 9:16 MP4 showcase videos in addition to 4K studio images")

    args = parser.parse_args()
    agent = ProductMediaAgent()

    if args.daemon:
        agent.run_daemon(inbox_dir=args.inbox)
    elif args.sample:
        res = agent.process_sample(
            sample_path=args.sample,
            code=args.code,
            custom_title=args.title,
            create_video=args.with_videos
        )
        print("\n=== Product Media Created Successfully ===")
        print(f"Code:         {res['code']}")
        print(f"Title:        {res['title']}")
        print(f"Pattern Type: {res['pattern_type']}")
        print(f"Color:        {res['primary_color']}")
        print(f"Studio Image: {res['studio_image']}")
        print(f"Macro Swatch: {res['macro_swatch']}")
        if res.get("video_reel"):
            print(f"Video Reel:   {res['video_reel']}")
    elif args.batch_dir:
        files = [
            os.path.join(args.batch_dir, f) for f in sorted(os.listdir(args.batch_dir))
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
        ]
        agent.batch_process(files, create_videos=args.with_videos)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
