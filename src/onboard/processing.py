from pathlib import Path
import json
import time

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data" / "raw"
OUT = ROOT / "outputs" / "onboard"

OUT.mkdir(parents=True, exist_ok=True)

# Explicit simulation assumptions
COMPRESSION_RATIO = 4.0
LINK_SPEED_MBPS = 5.0
ONBOARD_POWER_WATTS = 5.0
PROCESSING_RATE_MB_PER_SEC = 100.0

print("FLOODSENTINEL ONBOARD PROCESSING")
print("--------------------------------")

files = []

for path in DATA.rglob("*"):
    if not path.is_file():
        continue

    size = path.stat().st_size
    start = time.perf_counter()

    # Read actual input bytes to measure local read performance.
    with path.open("rb") as f:
        while f.read(1024 * 1024):
            pass

    elapsed = time.perf_counter() - start

    files.append({
        "filename": path.name,
        "size_bytes": size,
        "size_mb": size / (1024 * 1024),
        "local_read_time_sec": elapsed
    })

total_bytes = sum(f["size_bytes"] for f in files)
raw_mb = total_bytes / (1024 * 1024)

reduced_mb = raw_mb / COMPRESSION_RATIO
reduction_pct = (1 - 1 / COMPRESSION_RATIO) * 100

processing_time = raw_mb / PROCESSING_RATE_MB_PER_SEC
transmission_time = (reduced_mb * 8) / LINK_SPEED_MBPS

energy_wh = (
    ONBOARD_POWER_WATTS * processing_time / 3600
)

result = {
    "status": "COMPLETED",
    "classification": "SIMULATED_ESTIMATES",
    "input_files": files,
    "total_input_files": len(files),
    "raw_data_mb": round(raw_mb, 6),
    "estimated_reduced_data_mb": round(reduced_mb, 6),
    "estimated_data_reduction_pct": reduction_pct,
    "assumptions": {
        "compression_ratio": COMPRESSION_RATIO,
        "link_speed_mbps": LINK_SPEED_MBPS,
        "onboard_power_watts": ONBOARD_POWER_WATTS,
        "processing_rate_mb_per_sec": PROCESSING_RATE_MB_PER_SEC
    },
    "estimated_processing_time_sec": round(processing_time, 6),
    "estimated_transmission_time_sec": round(transmission_time, 6),
    "estimated_processing_energy_wh": round(energy_wh, 8),
    "actual_local_read_time_sec": round(
        sum(f["local_read_time_sec"] for f in files), 6
    ),
    "limitations": [
        "Compression ratio is assumed, not benchmarked.",
        "Satellite link speed is assumed.",
        "Power consumption is assumed.",
        "Local laptop read performance is not spacecraft performance."
    ]
}

output = OUT / "onboard_result.json"
output.write_text(json.dumps(result, indent=2), encoding="utf-8")

print("\nInput files:", len(files))
print("Raw data MB:", round(raw_mb, 4))
print("Estimated reduced MB:", round(reduced_mb, 4))
print("Estimated reduction:", reduction_pct, "%")
print("Estimated transmission seconds:", round(transmission_time, 4))
print("Estimated energy Wh:", round(energy_wh, 8))
print("\nSaved:", output)
print("ONBOARD PROCESSING COMPLETED")
