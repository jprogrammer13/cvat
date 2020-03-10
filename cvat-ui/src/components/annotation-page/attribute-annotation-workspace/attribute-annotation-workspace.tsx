// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import Layout from 'antd/lib/layout';

import CanvasWrapperContainer from 'containers/annotation-page/standard-workspace/canvas-wrapper';
import ObjectSidebar from './attribute-annotation-sidebar/attribute-annotation-sidebar';

export default function StandardWorkspaceComponent(): JSX.Element {
    return (
        <Layout hasSider className='attribute-annotation-workspace'>
            <CanvasWrapperContainer />
            <ObjectSidebar />
        </Layout>
    );
}
