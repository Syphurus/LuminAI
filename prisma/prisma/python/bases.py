# -*- coding: utf-8 -*-
# code generated by Prisma. DO NOT EDIT.
# pyright: reportUnusedImport=false
# fmt: off

# global imports for type checking
from builtins import bool as _bool
from builtins import int as _int
from builtins import float as _float
from builtins import str as _str
import sys
import decimal
import datetime
from typing import (
    TYPE_CHECKING,
    Optional,
    Iterable,
    Iterator,
    Sequence,
    Callable,
    ClassVar,
    NoReturn,
    TypeVar,
    Generic,
    Mapping,
    Tuple,
    Union,
    List,
    Dict,
    Type,
    Any,
    Set,
    overload,
    cast,
)
from typing_extensions import TypedDict, Literal


LiteralString = str
# -- template models.py.jinja --
from pydantic import BaseModel

from . import fields, actions
from ._types import FuncType
from ._builder import serialize_base64
from ._compat import PYDANTIC_V2, ConfigDict

if TYPE_CHECKING:
    from .client import Prisma


_PrismaModelT = TypeVar('_PrismaModelT', bound='_PrismaModel')


class _PrismaModel(BaseModel):
    if PYDANTIC_V2:
        model_config: ClassVar[ConfigDict] = ConfigDict(
            use_enum_values=True,
            arbitrary_types_allowed=True,
            populate_by_name=True,
        )
    elif not TYPE_CHECKING:
        from ._compat import BaseConfig

        class Config(BaseConfig):
            use_enum_values: bool = True
            arbitrary_types_allowed: bool = True
            allow_population_by_field_name: bool = True
            json_encoders: Dict[Any, FuncType] = {
                fields.Base64: serialize_base64,
            }

    # TODO: ensure this is required by subclasses
    __prisma_model__: ClassVar[str]


class BaseGeneratedImage(_PrismaModel):
    __prisma_model__: ClassVar[Literal['GeneratedImage']] = 'GeneratedImage'  # pyright: ignore[reportIncompatibleVariableOverride]

    @classmethod
    def prisma(cls: Type[_PrismaModelT], client: Optional['Prisma'] = None) -> 'actions.GeneratedImageActions[_PrismaModelT]':
        from .client import get_client

        return actions.GeneratedImageActions[_PrismaModelT](client or get_client(), cls)


class BaseGeneratedVideo(_PrismaModel):
    __prisma_model__: ClassVar[Literal['GeneratedVideo']] = 'GeneratedVideo'  # pyright: ignore[reportIncompatibleVariableOverride]

    @classmethod
    def prisma(cls: Type[_PrismaModelT], client: Optional['Prisma'] = None) -> 'actions.GeneratedVideoActions[_PrismaModelT]':
        from .client import get_client

        return actions.GeneratedVideoActions[_PrismaModelT](client or get_client(), cls)


class BaseGeneratedSummary(_PrismaModel):
    __prisma_model__: ClassVar[Literal['GeneratedSummary']] = 'GeneratedSummary'  # pyright: ignore[reportIncompatibleVariableOverride]

    @classmethod
    def prisma(cls: Type[_PrismaModelT], client: Optional['Prisma'] = None) -> 'actions.GeneratedSummaryActions[_PrismaModelT]':
        from .client import get_client

        return actions.GeneratedSummaryActions[_PrismaModelT](client or get_client(), cls)


class BaseGeneratedGhibli(_PrismaModel):
    __prisma_model__: ClassVar[Literal['GeneratedGhibli']] = 'GeneratedGhibli'  # pyright: ignore[reportIncompatibleVariableOverride]

    @classmethod
    def prisma(cls: Type[_PrismaModelT], client: Optional['Prisma'] = None) -> 'actions.GeneratedGhibliActions[_PrismaModelT]':
        from .client import get_client

        return actions.GeneratedGhibliActions[_PrismaModelT](client or get_client(), cls)


class BaseGeneratedSVG(_PrismaModel):
    __prisma_model__: ClassVar[Literal['GeneratedSVG']] = 'GeneratedSVG'  # pyright: ignore[reportIncompatibleVariableOverride]

    @classmethod
    def prisma(cls: Type[_PrismaModelT], client: Optional['Prisma'] = None) -> 'actions.GeneratedSVGActions[_PrismaModelT]':
        from .client import get_client

        return actions.GeneratedSVGActions[_PrismaModelT](client or get_client(), cls)


