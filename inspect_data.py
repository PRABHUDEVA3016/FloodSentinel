from pathlib import Path
import json
import pandas as pd
import rasterio

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "raw"

print("\n========== FLOODSENTINEL DATA AUDIT ==========\n")

report = {"rasters": [], "csv_files": []}

for path in DATA.rglob("*"):
    if not path.is_file():
        continue

    print(f"\nFILE: {path.name}")
    print(f"SIZE: {path.stat().st_size:,} bytes")

    if path.suffix.lower() in [".tif", ".tiff"]:
        try:
            with rasterio.open(path) as ds:
                info = {
                    "file": path.name,
                    "width": ds.width,
                    "height": ds.height,
                    "bands": ds.count,
                    "crs": str(ds.crs),
                    "bounds": list(ds.bounds),
                    "dtype": str(ds.dtypes),
                    "nodata": ds.nodata,
                    "resolution": list(ds.res),
                }
                report["rasters"].append(info)
                print(json.dumps(info, indent=2))
                print("Sample:", ds.read(1, masked=True)[::max(1, ds.height//5),
                                                       ::max(1, ds.width//5)])
        except Exception as e:
            print("RASTER ERROR:", e)

    elif path.suffix.lower() == ".csv":
        try:
            df = pd.read_csv(path)
            info = {
                "file": path.name,
                "rows": len(df),
                "columns": list(df.columns),
            }
            report["csv_files"].append(info)
            print(json.dumps(info, indent=2))
            print(df.head(5).to_string())
        except Exception as e:
            print("CSV ERROR:", e)

output = ROOT / "outputs" / "data_audit.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2, default=str))

print("\n========== AUDIT COMPLETED ==========")
print("Report:", output)
