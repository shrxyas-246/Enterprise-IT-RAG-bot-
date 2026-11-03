from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    app_name: str = "Enterprise IT Support Agentic RAG Copilot"
    app_env: str = "development"
    groq_api_key: str = ""
    tavily_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_index_name: str = "fde-it-support-rag"
    pinecone_namespace: str = "company-it-kb"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    groq_model: str = "openai/gpt-oss-120b"
    top_k: int = 4
    max_retries: int = 1
    admin_api_key: str = "change-me"#only admin gets access to ingest docs and change data in KB
    audit_db_path: str = str(BASE_DIR / "data" / "audit.db")#storing conversations (sqlite) 
    upload_dir: str = str(BASE_DIR / "uploads")#user uploads docs in this dir (can use bucket S3 service etc etc..)
    sample_kb_dir: str = str(BASE_DIR / "data" / "sample_kb")#extract and keep data

    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra="ignore")
@lru_cache
def get_settings() -> Settings:
    return Settings()