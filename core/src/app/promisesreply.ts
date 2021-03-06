import Arr = require('./utils/array');
import DBTypes = require('./dbtypes');
import KBPGP = require('./kbpgp');
import Log = require('./log');
import Map = require('./utils/map');
import Message = require('./message');
import MessageHelpers = require('./messagehelpers');
import Player = require('./player');
import Profile = require('./profile');
import Prom = require('./utils/promise');
import ReplyOption = require('./replyoption');
import Script = require('./script');
import State = require('./state');
import Str = require('./utils/string');

export function handleReplyMessage (
        reply: Message.MailgunReply,
        timestampMs: number,
        data: Map.Map<State.GameData>,
        promises: DBTypes.PromiseFactories)
{
        const email = reply.from;
        const inReplyToId = reply.inReplyToId;

        return promises.getMessage(inReplyToId).then(message =>
                message && !message.reply ?
                        promises.getPlayer(email).then(player =>
                                handleTimelyReply(
                                        reply,
                                        timestampMs,
                                        player,
                                        message,
                                        data,
                                        promises)) :
                        null
        );
}

export function handleTimelyReply (
        reply: Message.MailgunReply,
        timestampMs: number,
        player: Player.PlayerState,
        message: Message.MessageState,
        data: Map.Map<State.GameData>,
        promises: DBTypes.PromiseFactories)
{
        const groupName = player.version;
        const groupData = data[groupName];
        const body = reply.body;
        const strippedBody = reply.strippedBody;
        const profiles = groupData.profiles;
        const profile = Profile.getProfileByEmail(reply.to, profiles);
        const keyManager = groupData.keyManagers[profile.name];

        const messageName = message.name;
        const messageState = groupData.messages[messageName];
        const hasReplyOptions = messageState.replyOptions.length > 0;

        if (hasReplyOptions) {
                return player.publicKey ?
                        KBPGP.loadKey(player.publicKey).then(from => {
                                const keyManagers = [keyManager, from];
                                const keyRing = KBPGP.createKeyRing(keyManagers);
                                return KBPGP.decryptVerify(keyRing, strippedBody).then(plaintext => {
                                        const newStrippedBody = MessageHelpers.stripBody(plaintext);
                                        const newBody = plaintext;
                                        return handleDecryptedReplyMessage(
                                                newBody,
                                                newStrippedBody,
                                                timestampMs,
                                                player,
                                                message,
                                                groupData,
                                                promises)
                                });
                        }) :
                        handleDecryptedReplyMessage(
                                body,
                                strippedBody,
                                timestampMs,
                                player,
                                message,
                                groupData,
                                promises);
        } else {
                return null;
        }
}

export function handleDecryptedReplyMessage (
        body: string,
        strippedBody: string,
        timestampMs: number,
        player: Player.PlayerState,
        messageState: Message.MessageState,
        groupData: State.GameData,
        promises: DBTypes.PromiseFactories)
{
        const threadMessage = groupData.messages[messageState.name];
        const replyOptions = groupData.replyOptions;
        const messageReplyOptions = replyOptions[threadMessage.replyOptions];
        const indices = messageReplyOptions.map((option, index) => index);
        const conditions = indices.filter(index => {
                const option = messageReplyOptions[index];
                const condition = <string>((<any>option.parameters)['condition']);
                return !condition ||
                        <boolean><any>Script.executeScript(condition, player);
        });

        const validChecks = conditions.map(index =>
                () => isValidReply(strippedBody, messageReplyOptions[index]));

        return Prom.find(validChecks).then(matched => {
                if (matched !== -1) {
                        const index = conditions[matched];
                        const option = messageReplyOptions[index];
                        messageState.reply = { index, body, timestampMs, sent: [] };

                        if (option.type === ReplyOption.ReplyOptionType.ValidPGPKey) {
                                const publicKey = extractPublicKey(body);
                                player.publicKey = publicKey;

                                return promises.updatePlayer(player).then(player =>
                                        promises.addMessage(messageState)
                                );
                        } else {
                                return promises.addMessage(messageState);

                        }
                } else {
                        return null;
                }
        });
}

export function isValidReply(
        body: string, replyOption: ReplyOption.ReplyOption): Promise<boolean>
{
        switch (replyOption.type) {
        case ReplyOption.ReplyOptionType.Keyword:
                const keywordOption = <ReplyOption.ReplyOptionKeyword>replyOption;
                return Promise.resolve(isKeywordReply(keywordOption, body));

        case ReplyOption.ReplyOptionType.ValidPGPKey:
                const validOption = <ReplyOption.ReplyOptionValidPGPKey>replyOption;
                return isValidKeyReply(validOption, body);

        default:
                return Promise.resolve(true);
        }
}

export function isKeywordReply (
        replyOption: ReplyOption.ReplyOptionKeyword, text: string): boolean
{
        const matches = replyOption.parameters.matches;
        return matches.some(match => {
                const trimmedMatch = match.trim();
                return Str.contains(text, trimmedMatch);
        });
}

export function isValidKeyReply (
        replyOption: ReplyOption.ReplyOptionValidPGPKey, text: string)
{
        const publicKey = extractPublicKey(text);
        if (publicKey) {
                return KBPGP.isValidPublicKey(publicKey);
        } else {
                return Promise.resolve(false);
        }
}

export function extractPublicKey (message: string): string
{
        var reg = /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]*?-----END PGP PUBLIC KEY BLOCK-----/;
        var matches = message.match(reg);
        return (matches ? matches[0] : null);
}
