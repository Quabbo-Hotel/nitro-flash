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

    const prntLink = useMemo(() => chat?.formattedText?.match(/https?:\/\/(?:prnt\.sc|prntscr\.com|prnt\.scr)\/[a-zA-Z0-9_-]{4,}/i)?.[0] ?? null, [chat?.formattedText]);

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
                        prntLink ? (
                            <a
                                href={prntLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="message"
                                style={{ textDecoration: 'underline', color: '#0d47a1' }}
                                onClick={e => e.stopPropagation()}
                            >
                                {` ${chat.formattedText ?? prntLink} `}
                            </a>
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
