from langchain_groq import ChatGroq
from app.core.config import get_settings

settings = get_settings()

_llm = None #store the chat model instance


def get_llm(temperature: float = 0.0, model: str | None = None):
    global _llm
    if model is None and temperature == 0.0:
        if _llm is None:
            _llm = _build_llm(temperature, settings.groq_model)
        return _llm
    return _build_llm(temperature, model or settings.groq_model)


def _build_llm(temperature: float, model: str):
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is missing")
    return ChatGroq(
        model=model,
        api_key=settings.groq_api_key,
        temperature=temperature,
        max_retries=settings.max_retries,
    )
