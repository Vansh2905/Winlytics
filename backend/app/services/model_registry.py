import re
import joblib
import logging
import threading
from pathlib import Path
from typing import Any, Dict, Tuple,Union

logger = logging.getLogger(__name__)


class ModelRegistry:
    def __init__(self, models_dir: Union[str,Path]):
        self.models_dir = Path(models_dir)
        self._models: Dict[str, Tuple[Any, Any, Any]] = {}
        self._active_ver: str = ""
        self._lock = threading.Lock()
        self._load_all_models()

        if not self._models:
            raise RuntimeError(
                f"No valid model versions found in '{self.models_dir}'. "
                "Expected at least one v*/ subdirectory."
            )
        logger.info(
            "ModelRegistry ready | versions=%s | active=%s",
            list(self._models.keys()), self._active_ver,
        )


    @staticmethod
    def _version_num(path: Path) -> int:
        match = re.search(r"\d+", path.name)
        return int(match.group()) if match else -1

    def _load_all_models(self) -> None:                      
        version_dirs = [
            d for d in self.models_dir.iterdir()
            if d.is_dir() and d.name.startswith("v")          
        ]
        version_dirs = sorted(version_dirs, key=self._version_num)  

        for version_dir in version_dirs:
            version = version_dir.name
            try:
                model       = joblib.load(version_dir / "winlytics.pkl")
                features    = joblib.load(version_dir / "features.pkl")
                cat_features = joblib.load(version_dir / "categorical_features.pkl")

    
                self._models[version] = (model, features, cat_features)
                logger.info("Loaded model version '%s'.", version)

            except Exception as exc:
                logger.warning("Skipping version '%s': %s", version, exc)

        if self._models:                                       
            self._active_ver = max(
                self._models.keys(), key=lambda v: self._version_num(Path(v)))
    @property
    def active(self) -> Tuple[Any, Any, Any]:
        with self._lock:
            if not self._active_ver or self._active_ver not in self._models:  
                raise RuntimeError("No active model version set in registry.")
            return self._models[self._active_ver]

    def set_active(self, version: str) -> None:
        if version not in self._models:
            raise ValueError(
                f"Version '{version}' not found. "
                f"Available: {list(self._models.keys())}"
            )
        with self._lock:
            previous = self._active_ver
            self._active_ver = version
        logger.info("Active version switched: '%s' → '%s'.", previous, version)

    def list_versions(self) -> Dict[str, Any]:
        with self._lock:
            active = self._active_ver
        return {"versions": list(self._models.keys()), "active": active}


registry = ModelRegistry(Path(__file__).parent.parent / "models")