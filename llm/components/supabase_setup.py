import os
from pathlib import Path

from supabase import Client, create_client


def _load_env_file() -> None:
    """
    Load key=value pairs from the project .env file into process env
    only when the key is not already set.
    """
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


def _create_supabase_client() -> Client:
    _load_env_file()

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "Missing SUPABASE_URL and SUPABASE_KEY/SUPABASE_ANON_KEY. "
            "Set them in environment or .env."
        )

    return create_client(supabase_url, supabase_key)


supabase = _create_supabase_client()

