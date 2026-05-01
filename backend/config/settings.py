from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    hf_token: str = ""
    model_cache_dir: str = "./models"
    log_level: str = "INFO"
    backend_url: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=("settings_",)
    )

settings = Settings()