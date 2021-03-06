import Message = require('../../message');
import Meta = require('./meta');
import Helpers = require('../helpers');
import React = require('react');

import Core = require('../core');
import Div = Core.Div;

interface PagerProps extends React.Props<any> {
        message: Message.Message;
}

function renderPager(props: PagerProps)
{
        const message = props.message;
        const body = Helpers.createBody(message.body);

        const meta = Meta({ message: message });

        return Div({ className: 'pager' },
                meta,
                Div({ className: 'pager-body' }, body)
        );
}

const Pager = React.createFactory(renderPager);

export = Pager;
