import Map = require('./utils/map');
import Message = require('./message');
import Player = require('./player');

export interface Error {
        code: string;
        message: string;
}

export interface Callback<T> {
        (error: Error, data: T): void;
}

export interface RequestFunc<T, U> {
        (params: T, callback: Callback<U>): void;
}

export interface InitialRequestFunc<T> {
        (callback: Callback<T>): void;
}

export interface ErrorCallback {
        (error: Error): void;
}

export interface MessageUIDCallback extends Callback<string> {}

export interface MessageStateCallback extends Callback<Message.MessageState> {}

export interface CreateTableParams {
        tableName: string;
}
export interface CreateTableCallback extends Callback<{}> {}
export interface CreateTableRequest {
        (params: CreateTableParams, callback: CreateTableCallback): void;
}

export interface DeleteTableParams {
        tableName: string;
}
export interface DeleteTableCallback extends Callback<{}> {}
export interface DeleteTableRequest {
        (params: DeleteTableParams, callback: DeleteTableCallback): void;
}

export type AddPlayerParams = Player.PlayerState;
export interface AddPlayerCallback extends Callback<{}> {}
export interface AddPlayerRequest {
        (params: AddPlayerParams, callback: AddPlayerCallback): void;
}

export type UpdatePlayerParams = Player.PlayerState;
export interface UpdatePlayerCallback extends Callback<{}> {}
export interface UpdatePlayerRequest {
        (params: UpdatePlayerParams, callback: UpdatePlayerCallback): void;
}

export interface DeletePlayerParams {
        email: string;
}
export interface DeletePlayerCallback extends Callback<DeletePlayerParams> {}
export interface DeletePlayerRequest {
        (params: DeletePlayerParams, callback: DeletePlayerCallback): void;
}

export interface DeleteAllMessagesParams {
        email: string;
}
export interface DeleteAllMessagesCallback extends Callback<{}> {}
export interface DeleteAllMessagesRequest {
        (params: DeleteAllMessagesParams, callback: DeleteAllMessagesCallback): void;
}

export type AddMessageParams = Message.MessageState;
export interface AddMessageCallback extends MessageStateCallback {}
export interface AddMessageRequest {
        (params: AddMessageParams, callback: AddMessageCallback): void;
}

export type UpdateMessageParams = Message.MessageState;
export interface UpdateMessageCallback extends MessageStateCallback {}
export interface UpdateMessageRequest {
        (params: UpdateMessageParams, callback: UpdateMessageCallback): void;
}

export type DeleteMessageParams = Message.MessageState;
export interface DeleteMessageCallback extends MessageStateCallback {}
export interface DeleteMessageRequest {
        (params: DeleteMessageParams, callback: DeleteMessageCallback): void;
}

export interface GetMessageParams {
        messageId: string;
}
export interface GetMessageCallback extends MessageStateCallback {}
export interface GetMessageRequest {
        (params: GetMessageParams, callback: GetMessageCallback): void;
}

export interface GetMessagesParams {
        startKey: string;
        maxResults: number;
}
export interface GetMessagesResult {
        messages: Message.MessageState[];
        lastEvaluatedKey: string;
}
export interface GetMessagesCallback extends Callback<GetMessagesResult> {}
export interface GetMessagesRequest {
        (params: GetMessagesParams, callback: GetMessagesCallback): void;
}

export interface GetPlayerParams {
        email: string;
}
export interface GetPlayerCallback extends Callback<Player.PlayerState> {}
export interface GetPlayerRequest {
        (params: GetPlayerParams, callback: GetPlayerCallback): void;
}

export type SendRequest = (
        data: Message.MessageData,
        callback: Callback<string>)
        => void;

export function seq2<T, U, V> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>)
{
        return function (params: T, callback: Callback<V>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        requestB(data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq3<T, U, V, W> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>)
{
        return function (params: T, callback: Callback<W>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq2(requestB, requestC)(
                                                data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq4<T, U, V, W, X> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>,
        requestD: RequestFunc<W, X>)
{
        return function (params: T, callback: Callback<X>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq3(requestB, requestC, requestD)(
                                                data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function seq5<T, U, V, W, X, Y> (
        requestA: RequestFunc<T, U>,
        requestB: RequestFunc<U, V>,
        requestC: RequestFunc<V, W>,
        requestD: RequestFunc<W, X>,
        requestE: RequestFunc<X, Y>)
{
        return function (params: T, callback: Callback<Y>)
                {
                        var initialCallback = function (error: Error, data: U)
                        {
                                if (error) {
                                        callback(error, null);
                                } else {
                                        seq4(requestB,
                                                requestC,
                                                requestD,
                                                requestE)(data, callback);
                                }
                        };

                        requestA(params, initialCallback);
                };
}

export function sequence<T> (
        tasks: InitialRequestFunc<T>[],
        callback: Callback<T[]>)
{
        var index = 0;
        var result: T[] = [];
        var length = tasks.length;

        if (length > 0) {
                var onRequest = (error: Error, data: T) => {
                        if (error) {
                                callback(error, result);
                        } else {
                                result.push(data);

                                index += 1;

                                if (index < length) {
                                        tasks[index](onRequest);
                                } else {
                                        callback(error, result);
                                }
                        }
                };

                tasks[0](onRequest);
        } else {
                callback(null, result);
        }
}

export function parallel<T> (
        tasks: InitialRequestFunc<T>[], callback: Callback<T[]>)
{
        var count = tasks.length;
        var results: T[] = [];
        var hasError = false;
        var callbackWrapper = function (error: Error, result: T)
                {
                        if (error) {
                                hasError = true;
                                callback(error, null);
                        } else if (!hasError) {
                                count -= 1;
                                results.push(result);

                                if (count === 0) {
                                        callback(error, results);
                                }
                        }
                };

        tasks.forEach(function (task)
                {
                        task(callbackWrapper);
                });
}

export function parallelObject<T> (
        tasks: Map.Map<InitialRequestFunc<T>>,
        callback: Callback<Map.Map<T>>)
{
        var count = Object.keys(tasks).length;
        var results: Map.Map<T> = {};
        var hasError = false;
        var callbackWrapper = function (name: string, error: Error, result: T)
                {
                        if (error) {
                                hasError = true;
                                callback(error, null);
                        } else if (!hasError) {
                                count -= 1;
                                results[name] = result;

                                if (count === 0) {
                                        callback(error, results);
                                }
                        }
                };

        for (var taskName in tasks) {
                if (tasks.hasOwnProperty(taskName)) {
                        tasks[taskName](function (error: Error, result: T)
                                {
                                        callbackWrapper(
                                                taskName, error, result);
                                });
                }
        }
}
