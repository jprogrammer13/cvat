// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import { connect } from 'react-redux';
import Layout, { SiderProps } from 'antd/lib/layout';
import { SelectValue } from 'antd/lib/select';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Text from 'antd/lib/typography/Text';

import { activateNext, updateAnnotationsAsync } from 'actions/annotation-actions';
import { CombinedState } from 'reducers/interfaces';
import ObjectSwitcher from './object-switcher';
import AttributeSwitcher from './attribute-switcher';
import ObjectBasicsEditor from './object-basics-edtior';
import AttributeEditor from './attribute-editor';

interface StateToProps {
    activeObjectState: any | null;
    states: any[];
    labels: any[];
}

interface DispatchToProps {
    nextObject(step: number): void;
    updateAnnotations(statesToUpdate: any[]): void;
}

interface LabelAttrMap {
    [index: number]: any | null;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
            annotations: {
                activatedStateID,
                states,
            },
            job: {
                labels,
            },
        },
    } = state;

    const [activeObjectState] = activatedStateID === null
        ? [null] : states.filter((objectState: any): boolean => (
            objectState.clientID === activatedStateID
        ));

    return {
        labels,
        activeObjectState,
        states,
    };
}

function mapDispatchToProps(dispatch: any): DispatchToProps {
    return {
        nextObject(): void {
            dispatch(activateNext(1));
        },
        updateAnnotations(states): void {
            dispatch(updateAnnotationsAsync(states));
        },
    };
}

function AttributeAnnotationSidebar(props: StateToProps & DispatchToProps): JSX.Element {
    const {
        labels,
        states,
        nextObject,
        updateAnnotations,
        activeObjectState,
    } = props;

    const [labelAttrMap, setLabelAttrMap] = useState({} as LabelAttrMap); // labelID: attr

    if (!activeObjectState && states.length) {
        nextObject(1);
    }

    const nextAttribute = (step: number): void => {
        const { label } = activeObjectState;
        const attribute = labelAttrMap[label.id];
        const updatedLabelAttrMap = { ...labelAttrMap };

        if (label.attributes.length) {
            const prevIndex = label.attributes.indexOf(attribute);
            let nextIndex = prevIndex + step;
            if (nextIndex < 0) {
                nextIndex = label.attributes.length - 1;
            } else if (nextIndex >= label.attributes.length) {
                nextIndex = 0;
            }
            updatedLabelAttrMap[label.id] = label.attributes[nextIndex];
            setLabelAttrMap(updatedLabelAttrMap);
        } else if (updatedLabelAttrMap[label.id] !== null) {
            updatedLabelAttrMap[label.id] = null;
            setLabelAttrMap(updatedLabelAttrMap);
        }
    };

    if (activeObjectState && !labelAttrMap[activeObjectState.label.id]) {
        nextAttribute(1);
    }

    const activeAttribute = activeObjectState
        ? labelAttrMap[activeObjectState.label.id] || null
        : null;
    const siderProps: SiderProps = {
        className: 'attribute-annotation-sidebar',
        theme: 'light',
        width: 300,
        collapsedWidth: 0,
        reverseArrow: true,
        collapsible: true,
        trigger: null,
    };

    if (activeObjectState) {
        return (
            <Layout.Sider {...siderProps}>
                <ObjectSwitcher
                    currentLabel={activeObjectState.label.name}
                    clientID={activeObjectState.clientID}
                    occluded={activeObjectState.occluded}
                    objectsCount={states.length}
                    currentIndex={states.indexOf(activeObjectState)}
                    nextObject={nextObject}
                />
                <ObjectBasicsEditor
                    currentLabel={activeObjectState.label.name}
                    labels={labels}
                    occluded={activeObjectState.occluded}
                    changeLabel={(value: SelectValue): void => {
                        const labelName = value as string;
                        const [newLabel] = labels
                            .filter((_label): boolean => _label.name === labelName);
                        activeObjectState.label = newLabel;
                        updateAnnotations([activeObjectState]);
                    }}
                    setOccluded={(event: CheckboxChangeEvent): void => {
                        activeObjectState.occluded = event.target.checked;
                        updateAnnotations([activeObjectState]);
                    }}
                />
                {
                    activeAttribute
                        ? (
                            <>
                                <AttributeSwitcher
                                    currentAttribute={activeAttribute.name}
                                    currentIndex={activeObjectState.label.attributes
                                        .indexOf(activeAttribute)}
                                    attributesCount={activeObjectState.label.attributes.length}
                                    nextAttribute={nextAttribute}
                                />
                                <AttributeEditor
                                    attribute={activeAttribute}
                                    currentValue={activeObjectState.attributes[activeAttribute.id]}
                                    onChange={(value: string) => {
                                        const { attributes } = activeObjectState;
                                        attributes[activeAttribute.id] = value;
                                        activeObjectState.attributes = attributes;
                                        updateAnnotations([activeObjectState]);
                                    }}
                                />
                            </>
                        ) : (
                            <div className='attribute-annotations-sidebar-not-found-wrapper'>
                                <Text strong>No attributes found</Text>
                            </div>
                        )
                }
            </Layout.Sider>
        );
    }

    return (
        <Layout.Sider {...siderProps}>
            <div className='attribute-annotations-sidebar-not-found-wrapper'>
                <Text strong>No objects found</Text>
            </div>
        </Layout.Sider>
    );
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AttributeAnnotationSidebar);
