# Tests ka setup: asli Groq call NAHI hogi (free quota bachta hai, aur tests bina internet/API key ke chalte hain)
import os
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

BACKEND_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BACKEND_DIR))   # taaki "import main" mil jaaye

# main.py import hote hi API key check karta hai -> nakli key de do (koi asli call nahi jaayegi)
os.environ.setdefault("GROQ_API_KEY", "test-key-not-real")

# main.py resume.json tabhi use karta hai jab wo PDF se naya ho, warna LLM se parse karta hai.
# git clone ke baad dono ka time same-sa hota hai -> resume.json ka time "abhi" kar do, taaki parse na ho.
os.utime(BACKEND_DIR / "data" / "resume.json")

import main  # noqa: E402  (upar wala setup pehle chalna zaroori hai)
from fastapi.testclient import TestClient  # noqa: E402


def make_chunk(text):
    # Groq stream ka ek chunk aisa dikhta hai: chunk.choices[0].delta.content
    return SimpleNamespace(choices=[SimpleNamespace(delta=SimpleNamespace(content=text))])


class FakeGroq:
    """Groq client ki nakal: jo bhi bheja wo yaad rakhta hai, aur tay kiya hua answer stream karta hai."""

    def __init__(self):
        self.calls = []            # har LLM call ke arguments (test check kar sake kya bheja gaya)
        self.reply = ["Yug ", "is a ", "QA engineer."]
        self.json_reply = "{}"     # /match ke liye (non-stream) JSON answer
        self.error = None          # set karo toh LLM call fail hogi
        self.chat = SimpleNamespace(completions=SimpleNamespace(create=self._create))

    def _create(self, **kwargs):
        self.calls.append(kwargs)
        if self.error:
            raise self.error
        if kwargs.get("stream"):
            return iter(make_chunk(t) for t in self.reply)
        # stream nahi -> poora answer ek saath: response.choices[0].message.content
        # json_reply list ho toh har call pe agla answer (retry test karne ke liye)
        reply = self.json_reply.pop(0) if isinstance(self.json_reply, list) else self.json_reply
        return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=reply))])


@pytest.fixture
def fake_llm(monkeypatch):
    fake = FakeGroq()
    monkeypatch.setattr(main, "client", fake)
    return fake


@pytest.fixture
def client(fake_llm):
    main.request_log.clear()   # har test fresh rate limit se shuru ho
    return TestClient(main.app)
