from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from pydantic import BaseModel, Field
from app.core.config import get_settings
from app.rag.workflow import ask
from app.rag.vectorstore import add_documents
from app.services.ingestion import load_file, chunk_documents, SUPPORTED
from app.services.audit import write_audit

router = APIRouter(prefix="/api")
settings = get_settings()

class ChatRequest(BaseModel):    question: str = Field(..., min_length=1, max_length=4000)

class Citation(BaseModel):
    title: str = ""
    url: str = ""
    type: str = "private_kb"

class ChatResponse(BaseModel):
    answer: str
    source_used: str
    citations: list[Citation] = []
    trace: list[str] = []

class IngestResponse(BaseModel):
    filename: str
    documents: int
    chunks: int

@router.get("/health")
def health():
    return {
        "status": "ok",
        "app_name": settings.app_name,
        "env": settings.app_env,
        "model": settings.groq_model,
        "index": settings.pinecone_index_name,
    }

@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    try:
        result = ask(payload.question)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Agent failed: {exc}") from exc

    source_used = result.get("source_used", "unknown")
    trace = result.get("trace", [])

    try:
        write_audit(payload.question, source_used, trace)
    except Exception:
        pass

    return ChatResponse(
        answer=result.get("answer", ""),
        source_used=source_used,
        citations=result.get("citations", []),
        trace=trace,
    )

def require_admin(x_admin_key: str | None):
    if not x_admin_key or x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing admin key")

@router.post("/ingest", response_model=IngestResponse)
async def ingest(
    file: UploadFile = File(...),
    x_admin_key: str | None = Header(default=None, alias="X-Admin-Key"),
):
    require_admin(x_admin_key)

    name = Path(file.filename or "").name
    suffix = Path(name).suffix.lower()
    if suffix not in SUPPORTED:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Allowed: {', '.join(sorted(SUPPORTED))}",
        )

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    target = upload_dir / name
    target.write_bytes(await file.read())

    try:
        docs = load_file(target)
        chunks = chunk_documents(docs)
        add_documents(chunks)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Ingestion failed: {exc}") from exc

    return IngestResponse(filename=name, documents=len(docs), chunks=len(chunks))
