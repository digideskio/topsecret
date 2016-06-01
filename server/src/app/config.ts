import Data = require('../../../core/src/app/data');
import FileSystem = require('../../../core/src/app/filesystem');
import Helpers = require('../../../core/src/app/utils/helpers');

export interface AWSConfig {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        messagesTableName: string;
        playersTableName: string;
}

export interface MailgunConfig {
        apiKey: string;
}

export interface ConfigState {
        port: string;
        useDynamoDB: boolean;
        useEmail: boolean;
        debugDBTimeoutMs: number;
        aws: AWSConfig;
        mailgun: MailgunConfig;
        emailDomain: string;
        updateIntervalMs: number;
        content: {
                narrativeFolder: string;
                defaultNarrativeGroup: string;
                validApplicationThread: string;
                validApplicationThreadPGP: string;
                invalidApplicationThread: string;
                resignationThread: string;
                messageSchemaPath: string;
                profileSchemaPath: string;
                replyOptionSchemaPath: string;
        },
        timeFactor: number;
}

export function loadCredentials(config: ConfigState)
{
        let awsConfig: AWSConfig = null;
        let mailgunConfig: MailgunConfig = null;
        try {
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        'credentials/aws.json');
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        'credentials/mailgun.json');
        } catch (e) {
                console.log('Using example credentials');
                awsConfig = <AWSConfig>FileSystem.loadJSONSync(
                        'example_credentials/aws.json');
                mailgunConfig = <MailgunConfig>FileSystem.loadJSONSync(
                        'example_credentials/mailgun.json');
        }
        Object.assign(config.aws, awsConfig);
        Object.assign(config.mailgun, mailgunConfig);
}
