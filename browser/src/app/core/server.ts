import ActionCreators = require('./action/actioncreators');
import AppPlayer = require('./player');
import Clock = require('../../../../core/src/app/clock');
import ConfigData = require('./data/config');
import DBTypes = require('../../../../core/src/app/dbtypes');
import Helpers = require('../../../../core/src/app/utils/helpers');
import LocalDB = require('../../../../core/src/app/localdb');
import Main = require('../../../../core/src/app/main');
import Message = require('../../../../core/src/app/message');
import MessageHelpers = require('../../../../core/src/app/messagehelpers');
import Player = require('../../../../core/src/app/player');
import Promises = require('../../../../core/src/app/promises');
import Redux = require('./redux/redux');
import State = require('../../../../core/src/app/state');

interface Id {
        uid: number;
}

export interface RuntimeServer {
        lastEvaluatedKey: string;
        db: LocalDB.DBState;
        id: Id;
}
export interface Server extends RuntimeServer {
        app: State.State;
}

export function createServerFromSaveData (
        settings: ConfigData.GameSettings,
        data: State.Data,
        saveData: RuntimeServer)
{
        const lastEvaluatedKey = saveData.lastEvaluatedKey;
        const db = saveData.db;
        const id = saveData.id;
        const promises = createPromises(id, db);

        const app = {
                data,
                promises,
        };
        return { app, lastEvaluatedKey, db, id };
}

export function createRuntimeServer (): RuntimeServer
{
        return {
                lastEvaluatedKey: null,
                db: LocalDB.createDB(),
                id: { uid: 0 },
        };
}

export function createServer (settings: ConfigData.GameSettings, data: State.Data)
{
        const runtimeServer = createRuntimeServer();
        return createServerFromSaveData(settings, data, runtimeServer);
}

function createPromises (id: Id, db: LocalDB.DBState)
{
        const debugDBTimeoutMs = 0;
        const calls = LocalDB.createLocalDBCalls(db, debugDBTimeoutMs);
        const sendFn = (data: Message.MessageData) => send(id, data);
        return DBTypes.createPromiseFactories(calls, sendFn);
}

export function send (id: Id, data: Message.MessageData) {
        const uid = (id.uid + 1);
        const messageId = MessageHelpers.createMessageId(data.from, uid);
        id.uid += 1;

        const reply = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                body: data.body,
                strippedBody: data.body,
                id: messageId,
                inReplyToId: data.inReplyToId,
                attachment: data.attachment,
        };
        const action = ActionCreators.receiveReply(reply);
        Redux.handleAction(action);
        return Promise.resolve(messageId);
}

export function beginGame (
        playerData: AppPlayer.Player,
        settings: ConfigData.GameSettings,
        server: Server,
        clock: Clock.Clock)
{
        const { email, publicKey, firstName, lastName, timezoneOffset } = playerData;
        const { version, beginGameMessage } = settings;

        const player = Player.createPlayerState(
                email, publicKey, version, firstName, lastName, timezoneOffset);

        const groupData = server.app.data[version];
        const promises = server.app.promises;
        const timestampMs = Clock.gameTimeMs(clock);

        return Promises.beginGame(
                beginGameMessage,
                player,
                timestampMs,
                groupData,
                promises);
}

export function tickServer (server: Server, clock: Clock.Clock)
{
        const { app, lastEvaluatedKey } = server;

        return Main.tick(app, clock, lastEvaluatedKey).then(lastEvaluatedKey => {
                console.log(`tick, lastEvaluatedKey = ${lastEvaluatedKey}`);
                server.lastEvaluatedKey = lastEvaluatedKey;
        });
}
