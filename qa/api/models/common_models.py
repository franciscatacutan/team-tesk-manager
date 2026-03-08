from pydantic import BaseModel
from datetime import datetime


class ErrorResponse(BaseModel):
    status: int
    error: str
    message: str
    path: str
    timestamp: datetime
