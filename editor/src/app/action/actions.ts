module Actions {
        export const Types = {
                UNDO: 'UNDO',
                REDO: 'REDO',
                SAVE: 'SAVE',
                SET_GAME_DATA: 'SET_GAME_DATA',
                END_DRAG: 'END_DRAG',
                SET_ACTIVE_NARRATIVE: 'SET_ACTIVE_NARRATIVE',
                OPEN_MESSAGE: 'OPEN_MESSAGE',
                CLOSE_MESSAGE: 'CLOSE_MESSAGE',
                CREATE_MESSAGE: 'CREATE_MESSAGE',
                DELETE_MESSAGE: 'DELETE_MESSAGE',
                SELECT_MESSAGE: 'SELECT_MESSAGE',
                UNIQUE_SELECT_MESSAGE: 'UNIQUE_SELECT_MESSAGE',
                DESELECT_MESSAGE: 'DESELECT_MESSAGE',
                DESELECT_ALL_MESSAGES: 'DESELECT_ALL_MESSAGES',
                SET_EDITED_MESSAGE_NAME: 'SET_EDITED_MESSAGE_NAME',
                SET_MESSAGE_NAME: 'SET_MESSAGE_NAME',
                SET_MESSAGE_SUBJECT: 'SET_MESSAGE_SUBJECT',
                SET_MESSAGE_END_GAME: 'SET_MESSAGE_END_GAME',
                SET_MESSAGE_ENCRYPTED: 'SET_MESSAGE_ENCRYPTED',
                SET_MESSAGE_POSITION: 'SET_MESSAGE_POSITION',
                SET_MESSAGE_CONTENT: 'SET_MESSAGE_CONTENT',
                SET_MESSAGE_FALLBACK: 'SET_MESSAGE_FALLBACK',
                SET_MESSAGE_CHILDREN: 'SET_MESSAGE_CHILDREN',
                SET_MESSAGE_REPLY_OPTIONS: 'SET_MESSAGE_REPLY_OPTIONS',
                SET_MESSAGE_SCRIPT: 'SET_MESSAGE_SCRIPT',
                SET_STRING: 'SET_STRING',
        };

        export interface NameValueParameters<T> {
                name: string;
                value: T;
        }
        export interface NameValueAction<T> extends Redux.Action<NameValueParameters<T>> {}

        export interface Undo extends Redux.Action<void> {}
        export interface Redo extends Redux.Action<void> {}
        export interface Save extends Redux.Action<void> {}
        export interface SetGameData extends Redux.Action<Im.Narratives> {}

        export interface EndDragParameters {
                id: string;
                delta: Im.Coord;
        }
        export interface EndDrag extends Redux.Action<EndDragParameters> {}
        export interface SetActiveNarrative extends Redux.Action<string> {}
        export interface OpenMessage extends Redux.Action<string> {}
        export interface CloseMessage extends Redux.Action<void> {}
        export interface CreateMessage extends Redux.Action<void> {}
        export interface DeleteMessage extends Redux.Action<string> {}
        export interface SelectMessage extends Redux.Action<string> {}
        export interface UniqueSelectMessage extends Redux.Action<string> {}
        export interface DeselectMessage extends Redux.Action<string> {}
        export interface DeselectAllMessages extends Redux.Action<void> {}

        export interface SetEditedMessageName extends NameValueAction<string> {}
        export interface SetMessageName extends NameValueAction<void> {}
        export interface SetMessageSubject extends NameValueAction<string> {}
        export interface SetMessageEndGame extends NameValueAction<boolean> {}
        export interface SetMessageEncrypted extends NameValueAction<boolean> {}
        export interface SetMessageScript extends NameValueAction<string> {}
        export interface SetMessagePosition extends NameValueAction<Im.Coord> {}
        export interface SetMessageContent extends NameValueAction<Im.MessageContent> {}
        export interface SetMessageFallback extends NameValueAction<Im.MessageDelay> {}
        export interface SetMessageChildren extends NameValueAction<Immutable.List<Im.MessageDelay>> {}
        export interface SetMessageReplyOptions extends NameValueAction<Immutable.List<Im.ReplyOption>> {}

        export interface SetString extends NameValueAction<string> {}
}
