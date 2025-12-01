from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
import uuid


class PrivacyConfig(BaseModel):
    visibility: str = Field(default="public", description="public|private|internal")
    consent_to_share: bool = Field(default=True, description="Indicates if data can be shared externally")
    allow_contact: bool = Field(default=False, description="If false, email will be masked for non-owners")


class UserProfileBase(BaseModel):
    name: str
    email: EmailStr
    bio: str = ""
    skills: List[str] = Field(default_factory=list)
    privacy: PrivacyConfig = Field(default_factory=PrivacyConfig)


class UserProfileCreate(UserProfileBase):
    id: Optional[str] = None

    def ensure_id(self) -> str:
        return self.id or str(uuid.uuid4())


class UserProfile(UserProfileBase):
    id: str
    created_at: Optional[datetime] = None


class OpportunityBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = Field(default_factory=list)
    owner_id: str
    visibility: str = Field(default="public")
    tags: List[str] = Field(default_factory=list)


class OpportunityCreate(OpportunityBase):
    id: Optional[str] = None

    def ensure_id(self) -> str:
        return self.id or str(uuid.uuid4())


class Opportunity(OpportunityBase):
    id: str
    created_at: Optional[datetime] = None


class KnowledgeBase(BaseModel):
    user_id: str
    title: str
    content: str
    tags: List[str] = Field(default_factory=list)
    visibility: str = Field(default="private")
    retention_policy: str = Field(
        default="long_term", description="short_term|long_term|restricted"
    )


class KnowledgeCreate(KnowledgeBase):
    id: Optional[str] = None

    def ensure_id(self) -> str:
        return self.id or str(uuid.uuid4())


class Knowledge(KnowledgeBase):
    id: str
    created_at: Optional[datetime] = None


class MetricBase(BaseModel):
    user_id: str
    metric_type: str
    value: float
    observed_at: datetime = Field(default_factory=datetime.utcnow)


class MetricCreate(MetricBase):
    id: Optional[str] = None

    def ensure_id(self) -> str:
        return self.id or str(uuid.uuid4())


class Metric(MetricBase):
    id: str


class MatchRequest(BaseModel):
    skills: List[str] = Field(default_factory=list)
    user_id: Optional[str] = None
    viewer_id: Optional[str] = None
    minimum_overlap: int = 1


class MatchResult(BaseModel):
    opportunity: Opportunity
    overlap_count: int
    matching_skills: List[str]


class MemoryRequest(BaseModel):
    user_id: str
    content: str
    tags: List[str] = Field(default_factory=list)
    visibility: str = Field(default="private")
    retention_policy: str = Field(default="long_term")

    def ensure_id(self) -> str:
        return str(uuid.uuid4())


class HealthResponse(BaseModel):
    status: str
