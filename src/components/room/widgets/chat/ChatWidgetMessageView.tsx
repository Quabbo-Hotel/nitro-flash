import { RoomChatSettings, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChatBubbleMessage, GetRoomEngine } from '../../../../api';

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    bubbleWidth?: number;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null, bubbleWidth = RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [isReady, setIsReady] = useState<boolean>(false);
    const elementRef = useRef<HTMLDivElement>();

    const getBubbleWidth = useMemo(() =>
    {
        switch (bubbleWidth)
        {
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
                return 350;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
                return 240;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
                return 2000;
        }
    }, [bubbleWidth]);

    // Función para detectar si el mensaje contiene un link de partida de TETR.IO
    const isTetrioInviteLink = (text: string) =>
    {
        const tetrioRegex = /https:\/\/tetr\.io\/#\w+/i;
        return tetrioRegex.test(text);
    };

    // Detectar enlaces de prnt.sc o prntscr (PrntScr) y extraer el id
    const getPrntscrId = (text: string) =>
    {
        // ejemplos: https://prnt.sc/abcd12 o https://prntscr.com/abcd12
        const regex = /https?:\/\/(?:prnt\.sc|prntscr\.com|prnt\.scr)\/([a-zA-Z0-9_-]{4,})/i;
        const match = text.match(regex);
        return match ? match[1] : null;
    };

    // Construir posibles URLs directas de imagen a partir del id de prntscr
    const buildPrntscrUrls = (id: string) =>
    {
        if (!id) return [];

        // Prnt.sc normalmente sirve imágenes desde i.prnt.sc o direct links con la extensión
        // Intentamos varios patrones: i.prnt.sc/<id>.png, https://image.prntscr.com/image/<id>.png, y prnt.sc/<id>.png
        return [
            `https://i.prnt.sc/${id}.png`,
            `https://i.prnt.sc/${id}.jpg`,
            `https://image.prntscr.com/image/${id}.png`,
            `https://image.prntscr.com/image/${id}.jpg`,
            `https://prnt.sc/${id}`
        ];
    };

    // Hooks to manage prntscr preview state (must be top-level)
    const prntId = useMemo(() => getPrntscrId(chat?.formattedText ?? ''), [chat?.formattedText]);
    const prntUrls = useMemo(() => prntId ? buildPrntscrUrls(prntId) : [], [prntId]);
    const [currentPrntSrcIndex, setCurrentPrntSrcIndex] = useState(0);
    const [resolvedPrntImage, setResolvedPrntImage] = useState<string | null>(null);
    const [isResolvingPrntImage, setIsResolvingPrntImage] = useState(false);

    useEffect(() =>
    {
        setCurrentPrntSrcIndex(0);
    }, [prntId]);

    const handlePrntImageError = () =>
    {
        // If we had a resolved og:image and it errored, clear it and try fallbacks
        if (resolvedPrntImage)
        {
            setResolvedPrntImage(null);
            return;
        }

        const next = currentPrntSrcIndex + 1;
        if (next < prntUrls.length) setCurrentPrntSrcIndex(next);
    };

    // Try to fetch the prnt.sc page and extract og:image (or twitter:image) meta tag
    useEffect(() =>
    {
        let cancelled = false;
        setResolvedPrntImage(null);

        if (!prntId) return;

        const pageUrl = chat?.formattedText?.match(/https?:\/\/(?:prnt\.sc|prntscr\.com|prnt\.scr)\/[a-zA-Z0-9_-]{4,}/i)?.[0];
        if (!pageUrl) return;

        const controller = new AbortController();
        setIsResolvingPrntImage(true);

        const tryParseHtml = (html: string) =>
        {
            if (cancelled) return null;
            const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
                || html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
            return ogMatch ? ogMatch[1] : null;
        };

        fetch(pageUrl, { signal: controller.signal })
            .then(response => response.text())
            .then(html =>
            {
                if (cancelled) return;
                const imageUrl = tryParseHtml(html);
                if (imageUrl) setResolvedPrntImage(imageUrl);
                return imageUrl;
            })
            .catch(() => null)
            .then(async (maybeImage) =>
            {
                if (cancelled) return;
                if (maybeImage) return;

                // Si no obtuvimos la imagen directamente (CORS o contenido), intentamos vía AllOrigins public proxy
                try
                {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(pageUrl)}`;
                    const resp = await fetch(proxyUrl, { signal: controller.signal });
                    const text = await resp.text();
                    const imageUrl = tryParseHtml(text);
                    if (imageUrl && !cancelled) setResolvedPrntImage(imageUrl);
                }
                catch (e) {
                    // Si falla también, dejamos que los fallbacks manejen el caso
                }
            })
            .finally(() =>
            {
                if (!cancelled) setIsResolvingPrntImage(false);
            });

        return () =>
        {
            cancelled = true;
            controller.abort();
        };
    }, [prntId, chat?.formattedText]);

    useEffect(() =>
    {
        setIsVisible(false);

        const element = elementRef.current;
        if (!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;

        let left = chat.left;
        let top = chat.top;

        if (!left && !top)
        {
            left = (chat.location.x - (width / 2));
            top = (element.parentElement.offsetHeight - height);

            chat.left = left;
            chat.top = top;
        }

        setIsReady(true);

        return () =>
        {
            chat.elementRef = null;
            setIsReady(false);
        }
    }, [chat]);

    useEffect(() =>
    {
        if (!isReady || !chat || isVisible) return;

        if (makeRoom) makeRoom(chat);
        setIsVisible(true);
    }, [chat, isReady, isVisible, makeRoom]);

    return (
        <div ref={elementRef} className={`bubble-container ${isVisible ? 'visible' : 'invisible'}`} onClick={event => GetRoomEngine().selectRoomObject(chat.roomId, chat.senderId, RoomObjectCategory.UNIT)}>
            {(chat.styleId === 0) &&
                <div className="user-container-bg" style={{ backgroundColor: chat.color }} />}
            <div className={`chat-bubble bubble-${chat.styleId} type-${chat.type}`} style={{ maxWidth: getBubbleWidth }}>
                <div className="user-container">
                    {chat.imageUrl && (chat.imageUrl.length > 0) &&
                        <div className="user-image" style={{ backgroundImage: `url(${chat.imageUrl})` }} />}
                </div>
                <div className="chat-content">
                    <span className="username mr-1" dangerouslySetInnerHTML={{ __html: `${chat.username}: ` }} />
                    {
                        // Si hay un enlace prnt.sc y el autor es g6re o Yogurt, mostramos la imagen embebida con fallbacks
                        (prntId && (chat.username === 'g6re' || chat.username === 'Yogurt')) ? (
                            <div className="prntscr-embed" style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }} onClick={e => e.stopPropagation()}>
                                <a href={chat.formattedText.match(/https?:\/\/(?:prnt\.sc|prntscr\.com|prnt\.scr)\/[a-zA-Z0-9_-]{4,}/i)?.[0] ?? '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                                    <img
                                        src={resolvedPrntImage ?? prntUrls[currentPrntSrcIndex]}
                                        alt="PrntScr preview"
                                        onError={handlePrntImageError}
                                        style={{ maxWidth: Math.min(500, getBubbleWidth - 20), maxHeight: 500, width: 'auto', height: 'auto', borderRadius: 6, display: 'block', objectFit: 'contain' }}
                                    />
                                </a>
                                <div style={{ fontSize: 12, color: 'var(--text-muted, #666)' }}>{chat.formattedText}</div>
                            </div>
                        ) : isTetrioInviteLink(chat.formattedText) && chat.username === 'g6re' ? (
                            <a
                                href={chat.formattedText.match(/https:\/\/tetr\.io\/#\w+/i)[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tetrio-invite-embed"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid #4CAF50',
                                    backgroundColor: '#E8F5E9',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontStyle: 'italic',
                                    color: '#2E7D32',
                                    maxWidth: getBubbleWidth - 20,
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    gap: '10px'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src="https://txt.osk.sh/branding/tetrio-anim.gif"
                                    alt="TETR.IO Logo"
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 4,
                                        objectFit: 'contain',
                                        display: 'block'
                                    }}
                                />
                                <div>
                                    <strong>¡Invitación para jugar TETR.IO!</strong><br />
                                    Haz clic para unirte a la partida 🎮
                                </div>
                            </a>
                        ) : (
                            <span className="message" dangerouslySetInnerHTML={{ __html: `${chat.formattedText}` }} />
                        )
                    }


                </div>
                <div className="pointer" />
            </div>
        </div>
    );
}
