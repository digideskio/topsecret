import Arr = require('./utils/array');
import Message = require('./message');
import Str = require('./utils/string');

export type ReplyOption = ReplyOptionKeyword | ReplyOptionValidPGPKey | ReplyOptionDefault;

export const ReplyOptionType = {
        Default: 'default',
        Keyword: 'keyword',
        ValidPGPKey: 'validPGPKey',
}

export interface ReplyOptionBase<T> {
        type: string;
        parameters: T;
        messageDelay: Message.ThreadDelay;
}

interface KeywordParameters {
        matches: string[];
}
export interface ReplyOptionKeyword extends ReplyOptionBase<KeywordParameters> {}
export interface ReplyOptionValidPGPKey extends ReplyOptionBase<{}> {}
export interface ReplyOptionDefault extends ReplyOptionBase<{}>{}

export function getReplyIndex(body: string, replyOptions: ReplyOption[]): number
{
        return Arr.find(replyOptions,
                replyOption => isValidReply(body, replyOption));
}

export function isValidReply(
        body: string, replyOption: ReplyOption): boolean
{
        switch (replyOption.type) {
        case ReplyOptionType.Keyword:
                const keywordOption = <ReplyOptionKeyword>replyOption;
                return isKeywordReply(keywordOption, body);

        case ReplyOptionType.ValidPGPKey:
                const validOption = <ReplyOptionValidPGPKey>replyOption;
                return isValidKeyReply(validOption, body);

        default:
                return true;
        }
}

export function isKeywordReply (
        replyOption: ReplyOptionKeyword, text: string): boolean
{
        const matches = replyOption.parameters.matches;
        return matches.some(match => Str.contains(text, match));
}

export function isValidKeyReply (
        replyOption: ReplyOptionValidPGPKey, text: string): boolean
{
        const publicKey = extractPublicKey(text);
        return (publicKey ? true : false);
}

export function extractPublicKey (message: string): string
{
        var reg = /-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]*?-----END PGP PUBLIC KEY BLOCK-----/;
        var matches = message.match(reg);
        return (matches ? matches[0] : null);
}