import EncryptionType = require('../../folder');
import Kbpgp = require('kbpgp');
import KbpgpHelpers = require('../../../../../../core/src/app/kbpgp');
import Helpers = require('../../../../../../core/src/app/utils/helpers');
import Map = require('../../../../../../core/src/app/utils/map');
import React = require('react');
import SelectableRows = require('./selectablerows');

interface EncryptionProps extends React.Props<any> {
        keyManagersById: Map.Map<Kbpgp.KeyManagerInstance>;
        activeId: string;
        selectedId: string;
}

function renderEncryption(props: EncryptionProps)
{
        const keyManagersById = props.keyManagersById;
        const keyManagerIds = Object.keys(keyManagersById);
        const activeId = props.activeId;
        const activeIndex = keyManagerIds.indexOf(activeId);
        const selectedId = props.selectedId;
        const selectedIndex = keyManagerIds.indexOf(selectedId);
        const highlightedIndices = [activeIndex];
        const rowData = keyManagerIds.map(
                id => createRowData(keyManagersById[id], id, activeId));
        return SelectableRows({ rowData, selectedIndex, highlightedIndices });
}

const Encryption = React.createFactory(renderEncryption);

function createRowData (
        instance: Kbpgp.KeyManagerInstance, id: string, activeId: string)
{
        const status = id === activeId ? 'A' : ' ';
        const type = KbpgpHelpers.getDisplayType(instance);
        const userId = KbpgpHelpers.getUserId(instance);

        return [status, id, type, userId];
}

export = Encryption;
