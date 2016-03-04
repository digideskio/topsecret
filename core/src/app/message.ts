import ReplyOption = require('./replyoption');

export interface ReplyState {
        replyIndex: number;
        timestampMs: number;
}

export interface MessageState {
        email: string;
        version: string;
        id: string;
        name: string;
        reply: ReplyState;
        sentTimestampMs: number;
        childrenSent: boolean[];
        replySent: boolean;
        threadStartName: string;
}

export var ThreadMessageTypes = {
        DEFAULT: 'default',
        EMPTY: 'empty',
};

export interface MessageReceiver {
        message: Message;
        receiver: string;
}

export interface Coord {
        x: number;
        y: number;
}

export interface ThreadMessage {
        name: string;
        threadSubject: string;
        position: Coord;
        newConversation: boolean;
        endGame: boolean;
        message: Message;
        encrypted: boolean;
        receiver?: string; // For unsolicited player-to-character emails (where message is null)
        replyOptions: ReplyOption.ReplyOption[];
        children: ThreadDelay[];
        fallback: ThreadDelay;
}

export interface ThreadDelay {
        name: string;
        delayMins: number;
}

export interface NamedThreadDelay {
        name: string;
        matches: string[];
        threadDelay: ThreadDelay;
}

export interface Message {
        from: string;
        to: string[];
        body: string[];
}

export interface MessagePacket {
        id: string;
        from: string;
        to: string[];
        subject: string;
        body: string;
}

export interface PendingMessage {
        name: string;
        playerEmail: string;
        parentId: string;
        childIndex: number;
        threadStartName: string;
}

export interface SentMessageData {
        name: string;
        playerEmail: string;
        id: string;
        parentId: string;
        childIndex: number;
        threadStartName: string;
}

export interface MessageData {
        name: string;
        playerEmail: string;
        from: string;
        to: string[];
        subject: string;
        body: string;
}
