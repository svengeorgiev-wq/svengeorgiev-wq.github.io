from __future__ import annotations

import hashlib
import json
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BITRATES = {
    "1": [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
    "2": [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
}
SAMPLE_RATES = {
    3: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    0: [11025, 12000, 8000],
}


def id3v2_size(data: bytes) -> int:
    if not data.startswith(b"ID3") or len(data) < 10:
        return 0
    flags = data[5]
    size = sum(byte << shift for byte, shift in zip(data[6:10], (21, 14, 7, 0)))
    return 10 + size + (10 if flags & 0x10 else 0)


def parse_mp3(path: Path) -> dict[str, object]:
    data = path.read_bytes()
    pos = id3v2_size(data)
    frames = 0
    samples = 0
    bitrates: set[int] = set()
    sample_rates: set[int] = set()
    channel_modes: set[str] = set()
    first_frame = None
    channel_names = ["stereo", "joint-stereo", "dual-channel", "mono"]

    while pos + 4 <= len(data):
        header = struct.unpack(">I", data[pos : pos + 4])[0]
        if header >> 21 != 0x7FF:
            pos += 1
            continue
        version_id = (header >> 19) & 0b11
        layer_id = (header >> 17) & 0b11
        bitrate_index = (header >> 12) & 0b1111
        sample_index = (header >> 10) & 0b11
        padding = (header >> 9) & 1
        if version_id == 1 or layer_id != 1 or bitrate_index in (0, 15) or sample_index == 3:
            pos += 1
            continue

        version = "1" if version_id == 3 else "2"
        bitrate = BITRATES[version][bitrate_index]
        sample_rate = SAMPLE_RATES[version_id][sample_index]
        frame_length = int((144000 if version == "1" else 72000) * bitrate / sample_rate) + padding
        if frame_length < 24 or pos + frame_length > len(data):
            pos += 1
            continue

        next_pos = pos + frame_length
        if next_pos + 2 <= len(data) and next_pos < len(data) - 128:
            if data[next_pos] != 0xFF or data[next_pos + 1] & 0xE0 != 0xE0:
                pos += 1
                continue

        if first_frame is None:
            first_frame = pos
        frames += 1
        samples += 1152 if version == "1" else 576
        bitrates.add(bitrate)
        sample_rates.add(sample_rate)
        channel_modes.add(channel_names[(header >> 6) & 0b11])
        pos = next_pos

    if not frames or first_frame is None or len(sample_rates) != 1:
        raise ValueError(f"Keine konsistente MP3-Framefolge: {path.name}")

    sample_rate = next(iter(sample_rates))
    return {
        "file": path.name,
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "frames": frames,
        "duration_seconds": round(samples / sample_rate, 3),
        "sample_rate_hz": sample_rate,
        "bitrates_kbps": sorted(bitrates),
        "channels": sorted(channel_modes),
    }


def main() -> None:
    expected = [f"tag-{day:02}.mp3" for day in range(1, 22)]
    manifest = json.loads((ROOT / "audio-manifest.json").read_text(encoding="utf-8"))
    declared = [Path(item["path"]).name for item in manifest["files"]]
    actual = sorted(path.name for path in (ROOT / "audio").glob("tag-*.mp3"))
    if declared != expected or actual != expected:
        raise SystemExit(f"Audio-Satz stimmt nicht: declared={declared}, actual={actual}")

    index = (ROOT / "index.html").read_text(encoding="utf-8")
    app = (ROOT / "app.js").read_text(encoding="utf-8")
    worker = (ROOT / "sw.js").read_text(encoding="utf-8")
    assertions = {
        "index_css_v6": 'styles.css?v=6' in index,
        "index_js_v6": 'app.js?v=6' in index,
        "worker_registration_v6": 'sw.js?v=6' in app,
        "cache_v1_0_5": 'anker-begleiter-v1.0.5' in worker,
        "audio_head_offline_fallback": 'new Request(request.url, { method: "GET" })' in worker,
    }
    if not all(assertions.values()):
        raise SystemExit(f"PWA-Pruefung fehlgeschlagen: {assertions}")

    results = [parse_mp3(ROOT / "audio" / name) for name in expected]
    payload = {
        "files": len(results),
        "total_bytes": sum(item["bytes"] for item in results),
        "total_duration_seconds": round(sum(item["duration_seconds"] for item in results), 3),
        "min_duration_seconds": min(item["duration_seconds"] for item in results),
        "max_duration_seconds": max(item["duration_seconds"] for item in results),
        "sample_rates_hz": sorted({item["sample_rate_hz"] for item in results}),
        "bitrates_kbps": sorted({rate for item in results for rate in item["bitrates_kbps"]}),
        "channels": sorted({mode for item in results for mode in item["channels"]}),
        "pwa": assertions,
        "audios": results,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
