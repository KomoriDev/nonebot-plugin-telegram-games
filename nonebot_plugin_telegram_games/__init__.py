from nonebot import on, require
from nonebot.adapters.telegram import Bot
from nonebot.plugin import PluginMetadata
from nonebot.adapters.telegram.event import InlineQueryEvent, CallbackQueryEvent
from nonebot.adapters.telegram.model import (
    CallbackGame,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    InlineQueryResultGame,
)

require("nonebot_plugin_alconna")
from nonebot_plugin_alconna import Button, Command, UniMessage, CommandMeta

__plugin_meta__ = PluginMetadata(
    name="Telegram Games",
    description="Telegram Games",
    usage="/game",
    type="application",
    config=None,
    homepage="https://github.com/KomoriDev/nonebot-plugin-telegram-games",
    supported_adapters={"~telegram"},
    extra={
        "unique_name": "Telegram Games",
        "author": "Komorebi <mute231010@gmail.com>",
        "version": "0.1.0",
    },
)


game = Command("game", meta=CommandMeta(description="Telegram 游戏")).build(
    use_cmd_start=True
)


@game.handle()
async def _():
    await (
        UniMessage.text("I can get you 1 fun games to play. ")
        .text("Just tap 'Play', then select a game.")
        .keyboard(Button("input", label="Play", text="/"))
        .finish()
    )


@on("inline").handle()
async def _(bot: Bot, event: InlineQueryEvent):
    await bot.answer_inline_query(
        inline_query_id=event.id,
        results=[
            InlineQueryResultGame(
                id="game_2048",
                game_short_name="game2048",
                reply_markup=InlineKeyboardMarkup(
                    inline_keyboard=[
                        [
                            InlineKeyboardButton(
                                text="Play 2048",
                                callback_game=CallbackGame(),
                            )
                        ],
                        [
                            InlineKeyboardButton(
                                text="Star",
                                url="https://github.com/KomoriDev/nonebot-plugin-telegram-games",
                            )
                        ],
                    ]
                ),
            )
        ],
    )


@on("inline").handle()
async def _(bot: Bot, event: CallbackQueryEvent):
    if event.game_short_name:
        await bot.answer_callback_query(
            event.id, url="https://telegram.komoridevs.icu/2048/index.html"
        )
