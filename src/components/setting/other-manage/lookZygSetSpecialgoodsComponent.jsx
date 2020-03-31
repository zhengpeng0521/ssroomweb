import React from 'react';
import { Table, Button } from 'antd';
import { NewModal, } from '../../common/new-component/NewComponent'
import ManagerList from '../../common/new-component/manager-list/ManagerList'
function LookZygSetSpecialgoodsComponent({
    TicketComponentProps,
}) {
    
    return (
        <ManagerList {...TicketComponentProps} />
    )
}

export default LookZygSetSpecialgoodsComponent;